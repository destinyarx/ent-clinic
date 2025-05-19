import { updatePatient } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    let data = null;
    
    try {
        const body = await readBody(event);
        data = body.patientData;

        const response = await updatePatient(data);

        return response;

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});