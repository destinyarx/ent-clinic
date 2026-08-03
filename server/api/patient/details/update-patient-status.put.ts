import { updatePatientStatus } from '@/src/db/queries/patients';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
    let data = null;
    
    try {
        const tenant = await requireTenantContext(event);
        const body = await readBody(event);
        const { id, status } = body;

        const response = await updatePatientStatus(tenant.orgId, id, status);

        return response;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});
