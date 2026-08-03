import { addVitals } from '@/src/db/queries/patients/vitals';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
  try {
    const tenant = await requireTenantContext(event);
    const body = await readBody(event);
    const { data, patient } = body;

    const vitals = {
      orgId: tenant.orgId,
      patientId: patient.id,
      encounterId: patient.encounterId,
      diatolic: data.diatolic,
      systolic: data.systolic,
      heartRate: data.heartRate,
      respiratoryRate:data.respiratoryRate,
      temperature: data.temperature,
      saturation: data.saturation,
      remarks: data.remarks,
      createdBy: tenant.supabaseId
    }

    const response = await addVitals(vitals);

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
