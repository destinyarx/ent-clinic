import { getOrganizationInviteCode } from '@/features/onboarding/server/onboardingRepository'
import { requireOrganizationAdministrator } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
  const { orgId } = await requireOrganizationAdministrator(event)
  const inviteCode = await getOrganizationInviteCode(orgId)

  if (!inviteCode) {
    throw createError({ statusCode: 404, statusMessage: 'Clinic not found' })
  }

  return { data: { inviteCode } }
})
