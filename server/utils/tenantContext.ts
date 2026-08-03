import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { findActiveMembership, findApplicationUser } from '@/features/organizations/server/organizationRepository'
import type { OrganizationRole } from '@/features/organizations/types/organization'

export interface TenantContext {
  orgId: string
  userId: number
  supabaseId: string
  role: OrganizationRole
}

export async function requireAuthenticatedUser(event: H3Event) {
  const authUser = await serverSupabaseUser(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const user = await findApplicationUser(authUser.id)

  if (!user) {
    throw createError({ statusCode: 403, statusMessage: 'User profile is not provisioned' })
  }

  return { authUser, user }
}

export async function requireTenantContext(event: H3Event): Promise<TenantContext> {
  const { authUser, user } = await requireAuthenticatedUser(event)
  const requestedOrgId = getHeader(event, 'x-organization-id') ?? user.activeOrgId

  if (!requestedOrgId) {
    throw createError({ statusCode: 403, statusMessage: 'No active organization' })
  }

  const membership = await findActiveMembership(user.id, requestedOrgId)

  if (!membership) {
    throw createError({ statusCode: 403, statusMessage: 'Organization access denied' })
  }

  return {
    orgId: requestedOrgId,
    userId: user.id,
    supabaseId: authUser.id,
    role: membership.role,
  }
}

export async function requireOrganizationAdministrator(event: H3Event): Promise<TenantContext> {
  const context = await requireTenantContext(event)

  if (context.role !== 'owner' && context.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Owner or admin access required' })
  }

  return context
}
