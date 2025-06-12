import { finishVisit } from '@/src/db/queries/encounters'

export default defineEventHandler(async (event) => {
    let data;

    try {
        const query = getQuery(event);
        const patientId = Number(query.patientId);
        const encounterId = Number(query.encounterId);
        
        await finishVisit(patientId, encounterId);

        return {
            success: true,
            data: 'Patient encounter has been made.',
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});