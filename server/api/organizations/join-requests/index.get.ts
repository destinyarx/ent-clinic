import { listPendingJoinRequests } from '@/features/onboarding/server/onboardingRepository'
import { requireOrganizationAdministrator } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
  const { orgId } = await requireOrganizationAdministrator(event)
  return { data: await listPendingJoinRequests(orgId) }
})
