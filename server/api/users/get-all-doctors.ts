import { getAllDoctors } from '@/src/db/queries/users';

export default defineEventHandler(async (event) => {
    try {
        const data = await getAllDoctors();

        return {
            success: true,
            data: data,
            error: null
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Unexpected error occurs when fetching doctors`,
            data: null,
        });
    }
})
