import { getVitals } from '@/src/db/queries/patients/vitals';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const patientId = Number(query.patientId);
    const encounterId = query.encounterId ? Number(query.encounterId) : null;
    const type = String(query.type);
    const offset = Number(query.offset) || 0;
    const limit = Number(query.itemsPerPage) || 10;

    const data = await getVitals(patientId, encounterId, type, offset, limit);

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
