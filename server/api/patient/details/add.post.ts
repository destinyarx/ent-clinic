import { addPatient } from '@/src/db/queries/patients';
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
    let patientsInfo = null;

    try {
        const tenant = await requireTenantContext(event);
        const body = await readBody(event);
        const { patientData } = body;


        const patientsInfo = {
            firstName: patientData.firstName,
            middleName: patientData.middleName,
            lastName: patientData.lastName,
            address: patientData.address,
            birthdate: patientData.birthdate,
            gender: patientData.gender,
            contactNumber: patientData.contactNumber,
            allergies: patientData.allergies,
            occupation: patientData.occupation,
            orgId: tenant.orgId,
            createdBy: tenant.supabaseId
        }

        const response = await addPatient(patientsInfo);

        return response;

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: patientsInfo,
        }
    }
})
