import { updateVitals } from '@/src/db/queries/patients/vitals';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
  try {
    const tenant = await requireTenantContext(event);
    const body = await readBody(event);
    const { data } = body;

    const vitals = {
        id: data.id,
        diatolic: data.diatolic,
        systolic: data.systolic,
        heartRate: data.heartRate,
        respiratoryRate:data.respiratoryRate,
        temperature: data.temperature,
        saturation: data.saturation,
        remarks: data.remarks,
    }

    const response = await updateVitals(tenant.orgId, vitals);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    throw createError({
        statusCode: 500,
        statusMessage: 'Unexpected error occurs when inserting vital signs',
        data: error instanceof Error ? error.message : null
    });
  }
});
