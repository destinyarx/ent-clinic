import { getAllPatients } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const offset = Number(query.offset); 
    const limit = Number(query.itemsPerPage); // add 1 items to check if there is next page for the table

    // // sample throw erro
    // throw createError({
    //     statusCode: 500,
    //     statusMessage: `Forced Debug Error`,
    //     data: { limit, offset },
    // });
    
    return await getAllPatients(offset, limit);
})

