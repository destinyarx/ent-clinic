import { reviewJoinRequest } from '@/features/onboarding/server/onboardingRepository'
import { requireOrganizationAdministrator } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
  const { orgId, userId } = await requireOrganizationAdministrator(event)
  const requestId = Number(getRouterParam(event, 'id'))

  if (!Number.isSafeInteger(requestId) || requestId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid join request' })
  }

  return { data: await reviewJoinRequest(orgId, requestId, userId, 'approved') }
})
