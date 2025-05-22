import { updatePatientStatus } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    let data = null;
    
    try {
        const body = await readBody(event);
        const { id, status } = body;

        const response = await updatePatientStatus(id, status);

        return response;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});