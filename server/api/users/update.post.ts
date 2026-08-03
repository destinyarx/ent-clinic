import { update } from '@/src/db/queries/users'
import { requireAuthenticatedUser } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
    try {
        const { authUser } = await requireAuthenticatedUser(event)
        const body = await readBody(event)
        const { user } = body

        await update(authUser.id, user)

        return {
            success: true,
            error: null,
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Unexpected error occurs when updating your profile',
        })
    }
})
