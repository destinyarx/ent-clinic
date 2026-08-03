import { getAllQueue } from '@/src/db/queries/queue';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
  try {
    const tenant = await requireTenantContext(event);
    const query = getQuery(event);
    const offset = Number(query.offset) || 0;
    const limit = Number(query.itemsPerPage) || 10;

    const data = await getAllQueue(tenant.orgId, offset, limit);

    return {
      success: true,
      data: data,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching queue data:', error);

    return {
      success: false,
      data: null,
      error: (error instanceof Error) ? error.message : 'Unknown error',
    };
  }
});
