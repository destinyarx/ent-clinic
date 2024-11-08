import { addPatient } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { firstName, middleName, lastName, address } = body;
        const patientsInfo = {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            address: address,
            birthdate: "2012-09-29",
        }

        const response = await addPatient(patientsInfo);

        return response;

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
})