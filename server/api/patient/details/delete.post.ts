import { deletePatient } from '@/src/db/queries/patients';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
    try {
        const tenant = await requireTenantContext(event);
        const body = await readBody(event);
        const { id } = body;

        const response = await deletePatient(tenant.orgId, id);

        return response;

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        }
    }
})
