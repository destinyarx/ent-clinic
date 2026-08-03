import { and, desc, eq, isNull } from 'drizzle-orm'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { db } from '@/src/db'
import { organizationJoinRequests } from '@/src/db/schema/organizationJoinRequests'
import { organizationMembers } from '@/src/db/schema/organizationMembers'
import { organizations } from '@/src/db/schema/organizations'
import { users } from '@/src/db/schema/users'
import { generateInviteCode, normalizeInviteCode } from '../domain/inviteCode'
import type { StaffRole } from '../domain/onboarding'
import type { ClinicJoinRequest, OnboardingStatus } from '../types/onboarding'

const MAX_INVITE_CODE_ATTEMPTS = 12

function getNamesFromAuthMetadata(authUser: SupabaseUser) {
  const metadata = authUser.user_metadata ?? {}
  const fullName = String(metadata.full_name ?? metadata.name ?? '').trim()
  const fullNameParts = fullName.split(/\s+/).filter(Boolean)

  return {
    firstName: String(metadata.given_name ?? fullNameParts[0] ?? '').slice(0, 30),
    lastName: String(metadata.family_name ?? fullNameParts.slice(1).join(' ') ?? '').slice(0, 30),
  }
}

export async function provisionApplicationUser(authUser: SupabaseUser) {
  const names = getNamesFromAuthMetadata(authUser)

  await db
    .insert(users)
    .values({
      supabaseId: authUser.id,
      email: authUser.email?.slice(0, 255) ?? null,
      firstName: names.firstName || null,
      lastName: names.lastName || null,
    })
    .onConflictDoNothing({ target: users.supabaseId })

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.supabaseId, authUser.id), isNull(users.deletedAt)))
    .limit(1)

  if (!user) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to provision user profile' })
  }

  return user
}

export async function getOnboardingStatus(authUser: SupabaseUser): Promise<OnboardingStatus> {
  const user = await provisionApplicationUser(authUser)
  const [membership] = await db
    .select({ id: organizationMembers.id })
    .from(organizationMembers)
    .where(and(eq(organizationMembers.userId, user.id), isNull(organizationMembers.deletedAt)))
    .limit(1)

  if (membership) {
    return {
      state: 'member',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? authUser.email ?? '',
      pendingRequest: null,
      rejectionMessage: null,
    }
  }

  const [latestRequest] = await db
    .select({
      id: organizationJoinRequests.id,
      organizationName: organizations.name,
      requestedRole: organizationJoinRequests.requestedRole,
      status: organizationJoinRequests.status,
      createdAt: organizationJoinRequests.createdAt,
    })
    .from(organizationJoinRequests)
    .innerJoin(organizations, eq(organizationJoinRequests.orgId, organizations.id))
    .where(
      and(
        eq(organizationJoinRequests.userId, user.id),
        isNull(organizationJoinRequests.deletedAt),
      ),
    )
    .orderBy(desc(organizationJoinRequests.createdAt), desc(organizationJoinRequests.id))
    .limit(1)

  const pendingRequest = latestRequest?.status === 'pending'
    ? {
        ...latestRequest,
        requestedRole: latestRequest.requestedRole as StaffRole,
      }
    : null

  return {
    state: pendingRequest ? 'pending' : 'onboarding',
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? authUser.email ?? '',
    pendingRequest,
    rejectionMessage: latestRequest?.status === 'rejected'
      ? `Your request to join ${latestRequest.organizationName} was rejected. You may submit a new request.`
      : null,
  }
}

async function createUniqueOrganization(
  transaction: Parameters<Parameters<typeof db.transaction>[0]>[0],
  name: string,
) {
  for (let attempt = 0; attempt < MAX_INVITE_CODE_ATTEMPTS; attempt += 1) {
    const inviteCode = generateInviteCode()
    const [organization] = await transaction
      .insert(organizations)
      .values({ name, inviteCode })
      .onConflictDoNothing({ target: organizations.inviteCode })
      .returning({ id: organizations.id, name: organizations.name, inviteCode: organizations.inviteCode })

    if (organization) return organization
  }

  throw createError({ statusCode: 503, statusMessage: 'Unable to generate a clinic invite code' })
}

async function assertUserCanOnboard(
  transaction: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: number,
) {
  const [membership] = await transaction
    .select({ id: organizationMembers.id })
    .from(organizationMembers)
    .where(and(eq(organizationMembers.userId, userId), isNull(organizationMembers.deletedAt)))
    .limit(1)

  if (membership) {
    throw createError({ statusCode: 409, statusMessage: 'You already belong to a clinic' })
  }

  const [pendingRequest] = await transaction
    .select({ id: organizationJoinRequests.id })
    .from(organizationJoinRequests)
    .where(
      and(
        eq(organizationJoinRequests.userId, userId),
        eq(organizationJoinRequests.status, 'pending'),
        isNull(organizationJoinRequests.deletedAt),
      ),
    )
    .limit(1)

  if (pendingRequest) {
    throw createError({ statusCode: 409, statusMessage: 'You already have a pending join request' })
  }
}

export async function createOwnedOrganization(
  userId: number,
  input: { clinicName: string; firstName: string; lastName: string },
) {
  return db.transaction(async (transaction) => {
    await assertUserCanOnboard(transaction, userId)

    const organization = await createUniqueOrganization(transaction, input.clinicName)

    await transaction.insert(organizationMembers).values({
      orgId: organization.id,
      userId,
      role: 'owner',
    })

    await transaction
      .update(users)
      .set({
        activeOrgId: organization.id,
        firstName: input.firstName,
        lastName: input.lastName,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))

    return organization
  })
}

export async function createJoinRequest(
  userId: number,
  input: { inviteCode: string; role: StaffRole; firstName: string; lastName: string },
) {
  return db.transaction(async (transaction) => {
    await assertUserCanOnboard(transaction, userId)

    const [organization] = await transaction
      .select({ id: organizations.id, name: organizations.name })
      .from(organizations)
      .where(
        and(
          eq(organizations.inviteCode, normalizeInviteCode(input.inviteCode)),
          isNull(organizations.deletedAt),
        ),
      )
      .limit(1)

    if (!organization) {
      throw createError({ statusCode: 400, statusMessage: 'The clinic invite code is incorrect' })
    }

    const [request] = await transaction
      .insert(organizationJoinRequests)
      .values({
        orgId: organization.id,
        userId,
        requestedRole: input.role,
      })
      .returning({ id: organizationJoinRequests.id, createdAt: organizationJoinRequests.createdAt })

    await transaction
      .update(users)
      .set({
        firstName: input.firstName,
        lastName: input.lastName,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))

    return { ...request, organizationName: organization.name, requestedRole: input.role }
  })
}

export async function listPendingJoinRequests(orgId: string): Promise<ClinicJoinRequest[]> {
  const rows = await db
    .select({
      id: organizationJoinRequests.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      requestedRole: organizationJoinRequests.requestedRole,
      createdAt: organizationJoinRequests.createdAt,
    })
    .from(organizationJoinRequests)
    .innerJoin(users, eq(organizationJoinRequests.userId, users.id))
    .where(
      and(
        eq(organizationJoinRequests.orgId, orgId),
        eq(organizationJoinRequests.status, 'pending'),
        isNull(organizationJoinRequests.deletedAt),
        isNull(users.deletedAt),
      ),
    )
    .orderBy(organizationJoinRequests.createdAt)

  return rows.map((row) => ({
    id: row.id,
    userName: [row.firstName, row.lastName].filter(Boolean).join(' ') || row.email || 'Unnamed user',
    email: row.email ?? '',
    requestedRole: row.requestedRole as StaffRole,
    createdAt: row.createdAt,
  }))
}

export async function reviewJoinRequest(
  orgId: string,
  requestId: number,
  reviewerId: number,
  decision: 'approved' | 'rejected',
) {
  return db.transaction(async (transaction) => {
    const now = new Date().toISOString()
    const [request] = await transaction
      .update(organizationJoinRequests)
      .set({ status: decision, reviewedBy: reviewerId, reviewedAt: now, updatedAt: now })
      .where(
        and(
          eq(organizationJoinRequests.id, requestId),
          eq(organizationJoinRequests.orgId, orgId),
          eq(organizationJoinRequests.status, 'pending'),
          isNull(organizationJoinRequests.deletedAt),
        ),
      )
      .returning({
        id: organizationJoinRequests.id,
        userId: organizationJoinRequests.userId,
        requestedRole: organizationJoinRequests.requestedRole,
      })

    if (!request) {
      throw createError({ statusCode: 404, statusMessage: 'Pending join request not found' })
    }

    if (decision === 'approved') {
      const [existingMembership] = await transaction
        .select({ id: organizationMembers.id })
        .from(organizationMembers)
        .where(and(eq(organizationMembers.userId, request.userId), isNull(organizationMembers.deletedAt)))
        .limit(1)

      if (existingMembership) {
        throw createError({ statusCode: 409, statusMessage: 'This user already belongs to a clinic' })
      }

      await transaction.insert(organizationMembers).values({
        orgId,
        userId: request.userId,
        role: request.requestedRole,
      })

      await transaction
        .update(users)
        .set({ activeOrgId: orgId, updatedAt: now })
        .where(eq(users.id, request.userId))
    }

    return { id: request.id, status: decision }
  })
}

export async function getOrganizationInviteCode(orgId: string) {
  const [organization] = await db
    .select({ inviteCode: organizations.inviteCode })
    .from(organizations)
    .where(and(eq(organizations.id, orgId), isNull(organizations.deletedAt)))
    .limit(1)

  return organization?.inviteCode ?? null
}

export async function regenerateOrganizationInviteCode(orgId: string) {
  const currentInviteCode = await getOrganizationInviteCode(orgId)

  if (!currentInviteCode) {
    throw createError({ statusCode: 404, statusMessage: 'Clinic not found' })
  }

  for (let attempt = 0; attempt < MAX_INVITE_CODE_ATTEMPTS; attempt += 1) {
    const inviteCode = generateInviteCode()

    if (inviteCode === currentInviteCode) continue

    try {
      const [organization] = await db
        .update(organizations)
        .set({ inviteCode, updatedAt: new Date().toISOString() })
        .where(and(eq(organizations.id, orgId), isNull(organizations.deletedAt)))
        .returning({ inviteCode: organizations.inviteCode })

      if (!organization) {
        throw createError({ statusCode: 404, statusMessage: 'Clinic not found' })
      }

      return organization.inviteCode
    } catch (error) {
      const databaseError = error as { code?: string }
      if (databaseError.code !== '23505') throw error
    }
  }

  throw createError({ statusCode: 503, statusMessage: 'Unable to generate a clinic invite code' })
}
