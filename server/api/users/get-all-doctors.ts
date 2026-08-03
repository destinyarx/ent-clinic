import { getAllDoctors } from '@/src/db/queries/users';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
    try {
        const tenant = await requireTenantContext(event);
        const data = await getAllDoctors(tenant.orgId);

        return {
            success: true,
            data: data,
            error: null
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Unexpected error occurs when fetching doctors: ${error}`,
        });
    }
})
