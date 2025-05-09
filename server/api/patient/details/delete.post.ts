import { deletePatient } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { id } = body;

        const response = await deletePatient(id);

        return response;

    } catch (error) {
        return {
            success: false,
            message: error.message || "Unknown error",
        }
    }
})