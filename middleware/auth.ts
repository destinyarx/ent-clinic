export default defineEventHandler(async (event) => {
    const user = useSupabaseUser()

    if (!user.value) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
})