import { serverSupabaseUser } from '#supabase/server'
import { createJoinRequest, provisionApplicationUser } from '@/features/onboarding/server/onboardingRepository'
import { requireJoinRequestInput } from '@/server/utils/onboardingValidation'

export default defineEventHandler(async (event) => {
  const authUser = await serverSupabaseUser(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const body = await readBody<{
    inviteCode?: unknown
    role?: unknown
    firstName?: unknown
    lastName?: unknown
  }>(event)
  const input = requireJoinRequestInput(body)
  const user = await provisionApplicationUser(authUser)
  const request = await createJoinRequest(user.id, input)

  return { data: request }
})
