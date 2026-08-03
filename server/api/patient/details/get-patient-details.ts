import { getPatientDetails } from '@/src/db/queries/patients';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = Number(query.id);
    const tenant = await requireTenantContext(event);
    const data = await getPatientDetails(tenant.orgId, id);

    return {
        status: 'success',
        data: data[0],
    };
});

