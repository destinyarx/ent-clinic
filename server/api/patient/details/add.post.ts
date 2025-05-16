import { addPatient } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    let patientsInfo = null;

    try {
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
            occupation: patientData.occupation
        }

        const response = await addPatient(patientsInfo);

        return response;

    } catch (error) {
        return {
            success: false,
            message: error.message || "Unknown error",
            data: patientsInfo,
        }
    }
})