import { updateVitals } from '@/src/db/queries/patients/vitals';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { data, updatedBy } = body;

    const vitals = {
        id: data.id,
        diatolic: data.diatolic,
        systolic: data.systolic,
        heartRate: data.heartRate,
        respiratoryRate:data.respiratoryRate,
        temperature: data.temperature,
        saturation: data.saturation,
        remarks: data.remarks,
        updatedBy: updatedBy
    }

    const response = await updateVitals(vitals);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    throw createError({
        statusCode: 500,
        statusMessage: 'Unexpected error occurs when inserting vital signs',
        data: error?.message ?? null
    });
  }
});
