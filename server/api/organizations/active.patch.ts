import { updateActiveOrganization } from '@/features/organizations/server/organizationRepository'
import { requireAuthenticatedUser } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
  const { user } = await requireAuthenticatedUser(event)
  const body = await readBody<{ orgId?: string }>(event)

  if (!body.orgId) {
    throw createError({ statusCode: 400, statusMessage: 'Organization is required' })
  }

  const updated = await updateActiveOrganization(user.id, body.orgId)

  if (!updated) {
    throw createError({ statusCode: 403, statusMessage: 'Organization access denied' })
  }

  return { data: { activeOrgId: body.orgId } }
})
