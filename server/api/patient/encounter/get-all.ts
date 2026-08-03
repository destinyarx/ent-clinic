import { fetchPatients } from '@/src/db/queries/encounters'
import { requireTenantContext } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
    type Status = 'open'|'closed'|'in_progress'|'rejected';

    let data = null;

    try {
        const tenant = await requireTenantContext(event);
        const query = getQuery(event);
        const offset = Number(query.offset) || 0;
        const limit = Number(query.itemsPerPage) || 10;
        const doctor_id = String(query.doctor_id) ?? null;
        const status = (String(query.status) as Status) ?? null;  
        const searchValue = query?.searchValue ? (String(query.searchValue) ?? null) : null;  
        const filterByVisitType = Array.isArray(query.filterByVisitType)
            ? query.filterByVisitType.map(String)
            : query.filterByVisitType
              ? String(query.filterByVisitType)
              : null;

        data = await fetchPatients(tenant.orgId, limit, offset, doctor_id, status, searchValue, filterByVisitType);

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
