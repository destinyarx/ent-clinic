import { deleteVitals } from '@/src/db/queries/patients/vitals';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = body.id;

    const data = await deleteVitals(id)

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
