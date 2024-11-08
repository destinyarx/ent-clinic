import { getAllPatients } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    const patients = await getAllPatients();

    return patients;
})

