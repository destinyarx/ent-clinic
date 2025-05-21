import { getAllQueue } from '@/src/db/queries/queue';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const offset = Number(query.offset) || 0;
    const limit = Number(query.itemsPerPage) || 10;

    const data = await getAllQueue(offset, limit);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error fetching queue data:', error);

    return {
      success: false,
      error: (error instanceof Error) ? error.message : 'Unknown error',
    };
  }
});
