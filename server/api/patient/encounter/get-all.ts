import { fetchPatients } from '@/src/db/queries/encounters'

export default defineEventHandler(async (event) => {
    type Status = 'open'|'closed'|'in_progress'|'rejected';

    let data = null;

    try {
        const query = getQuery(event);
        const offset = Number(query.offset) || 0;
        const limit = Number(query.itemsPerPage) || 10;
        const doctor_id = String(query.doctor_id) ?? null;
        const status = (String(query.status) as Status) ?? null;  
        const searchValue = String(query.searchValue) ?? null;  
        const filterByVisitType = query.filterByVisitType;

        data = await fetchPatients(limit, offset, doctor_id, status, searchValue, filterByVisitType);

        return {
            success: true,
            data: data,
            error: null,
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Unexpected error occurs when fetching patients`,
        });
    }
})