import { fetchPatients } from '@/src/db/queries/encounters'

export default defineEventHandler(async (event) => {
    type Status = 'open'|'closed'|'in_progress';

    let data;

    try {
        const query = getQuery(event);
        const offset = Number(query.offset) || 0;
        const limit = Number(query.itemsPerPage) || 10;
        const doctor_id = String(query.doctor_id) ?? null;
        const status = (String(query.status) as Status) ?? null;  
        
        data = await fetchPatients(limit, offset, doctor_id, status);

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