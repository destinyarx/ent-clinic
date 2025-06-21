import { getAllPatients } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const offset = Number(query.offset); 
    const limit = Number(query.itemsPerPage); // add 1 items to check if there is next page for the table
    const searchValue = String(query.searchValue) ?? null; 

    try {
        const data = await getAllPatients(offset, limit, searchValue);

        return {
            success: true,
            data: data,
            error: null
        }
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
})

