import { serverSupabaseUser } from '#supabase/server'
import { getOnboardingStatus } from '@/features/onboarding/server/onboardingRepository'

export default defineEventHandler(async (event) => {
  const authUser = await serverSupabaseUser(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  return { data: await getOnboardingStatus(authUser) }
})
