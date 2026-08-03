import { countPendingPatients } from '@/src/db/queries/encounters'
import { requireTenantContext } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
    let data;

    try {
        const tenant = await requireTenantContext(event);
        const query = getQuery(event);
        const doctor_id = String(query.doctor_id) ?? null;
        
        data = await countPendingPatients(tenant.orgId, doctor_id);

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
