import { update } from '@/src/db/queries/users'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { user } = body

        await update(user)

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