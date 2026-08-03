import { regenerateOrganizationInviteCode } from '@/features/onboarding/server/onboardingRepository'
import { requireOrganizationAdministrator } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
  const { orgId } = await requireOrganizationAdministrator(event)
  const inviteCode = await regenerateOrganizationInviteCode(orgId)
  return { data: { inviteCode } }
})
