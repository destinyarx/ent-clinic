import { and, asc, eq, isNull } from 'drizzle-orm'
import { db } from '@/src/db'
import { organizationMembers } from '@/src/db/schema/organizationMembers'
import { organizations } from '@/src/db/schema/organizations'
import { permissions } from '@/src/db/schema/permissions'
import { rolePermissions } from '@/src/db/schema/rolePermissions'
import { users } from '@/src/db/schema/users'
import type { OrganizationProfile, OrganizationRole, OrganizationSummary } from '../types/organization'

export async function findApplicationUser(supabaseId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.supabaseId, supabaseId), isNull(users.deletedAt)))
    .limit(1)

  return user ?? null
}

export async function listUserOrganizations(userId: number): Promise<OrganizationSummary[]> {
  return db
    .select({
      id: organizations.id,
      name: organizations.name,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .where(
      and(
        eq(organizationMembers.userId, userId),
        isNull(organizationMembers.deletedAt),
        isNull(organizations.deletedAt),
      ),
    )
    .orderBy(asc(organizations.name))
}

export async function findActiveMembership(userId: number, orgId: string) {
  const [membership] = await db
    .select({ role: organizationMembers.role })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.orgId, organizations.id))
    .where(
      and(
        eq(organizationMembers.userId, userId),
        eq(organizationMembers.orgId, orgId),
        isNull(organizationMembers.deletedAt),
        isNull(organizations.deletedAt),
      ),
    )
    .limit(1)

  return membership ?? null
}

export async function updateActiveOrganization(userId: number, orgId: string) {
  const membership = await findActiveMembership(userId, orgId)

  if (!membership) {
    return false
  }

  await db.update(users).set({ activeOrgId: orgId }).where(eq(users.id, userId))
  return true
}

export async function getOrganizationProfile(supabaseId: string): Promise<OrganizationProfile | null> {
  const user = await findApplicationUser(supabaseId)

  if (!user) {
    return null
  }

  const memberships = await listUserOrganizations(user.id)
  const activeMembership = memberships.find((membership) => membership.id === user.activeOrgId) ?? memberships[0]
  const activeOrgId = activeMembership?.id ?? null
  const role = activeMembership?.role ?? null

  if (activeOrgId && activeOrgId !== user.activeOrgId) {
    await db.update(users).set({ activeOrgId }).where(eq(users.id, user.id))
  }

  const grantedPermissions = role
    ? await db
        .select({ name: permissions.name })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(
          and(
            eq(rolePermissions.role, role),
            isNull(rolePermissions.deletedAt),
            isNull(permissions.deletedAt),
          ),
        )
    : []

  return {
    id: supabaseId,
    name: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' '),
    birthdate: user.birthdate,
    email: user.email,
    role: role as OrganizationRole | null,
    permissions: grantedPermissions.map((permission) => permission.name),
    position: user.position,
    designationArea: user.designationArea,
    licenseNumber: user.licenseNumber,
    activeOrgId,
    organizations: memberships,
  }
}
