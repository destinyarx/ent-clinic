import { serverSupabaseUser } from '#supabase/server'
import { createOwnedOrganization, provisionApplicationUser } from '@/features/onboarding/server/onboardingRepository'
import { requireClinicName, requireProfileNames } from '@/server/utils/onboardingValidation'

export default defineEventHandler(async (event) => {
  const authUser = await serverSupabaseUser(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const body = await readBody<{
    clinicName?: unknown
    firstName?: unknown
    lastName?: unknown
  }>(event)
  const names = requireProfileNames(body)
  const clinicName = requireClinicName(body.clinicName)
  const user = await provisionApplicationUser(authUser)
  const organization = await createOwnedOrganization(user.id, { ...names, clinicName })

  return { data: organization }
})
