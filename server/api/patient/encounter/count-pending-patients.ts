import { countPendingPatients } from '@/src/db/queries/encounters'

export default defineEventHandler(async (event) => {
    let data;

    try {
        const query = getQuery(event);
        const doctor_id = String(query.doctor_id) ?? null;
        
        data = await countPendingPatients(doctor_id);

        return {
            success: true,
            data: data,
            error: null
        }
    } catch (error) {
        return {
            success: false,
            data: data,
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
})