import { deleteVitals } from '@/src/db/queries/patients/vitals';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
  try {
    const tenant = await requireTenantContext(event);
    const body = await readBody(event);
    const id = body.id;

    const data = await deleteVitals(tenant.orgId, id)

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    throw createError({
        statusCode: 500,
        statusMessage: 'Unexpected error occurs when fetching vital signs',
    });
  }
});
