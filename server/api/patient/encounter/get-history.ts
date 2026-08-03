import { getEncounterHistory } from '@/src/db/queries/encounters'
import { requireTenantContext } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
    let data;

    try {
        const tenant = await requireTenantContext(event);
        const query = getQuery(event);
        const id = Number(query.id);
        const offset = Number(query.offset) || 0;
        const limit = Number(query.itemsPerPage) || 10;
        
        data = await getEncounterHistory(tenant.orgId, id, limit, offset);

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
