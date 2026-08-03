import { listUserOrganizations } from '@/features/organizations/server/organizationRepository'
import { requireAuthenticatedUser } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
  const { user } = await requireAuthenticatedUser(event)
  const data = await listUserOrganizations(user.id)

  return { data }
})
