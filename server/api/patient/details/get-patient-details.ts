import { getPatientDetails } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = Number(query.id);
    const data = await getPatientDetails(id);

    return {
        status: 'success',
        data: data[0],
    };
});

