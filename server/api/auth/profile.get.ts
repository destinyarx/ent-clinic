import { getOrganizationProfile } from '@/features/organizations/server/organizationRepository'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const authUser = await serverSupabaseUser(event)

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const data = await getOrganizationProfile(authUser.id)

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'User profile not found' })
  }

  return { data }
})
