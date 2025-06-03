import { updateEncounterStatus } from '@/src/db/queries/encounters'

export default defineEventHandler(async (event) => {
    let data;

    try {
        const query = getQuery(event);
        const id = Number(query.id);
        const status = String(query.status);
        
        await updateEncounterStatus(id, status);

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