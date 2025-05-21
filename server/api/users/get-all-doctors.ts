import { getAllDoctors } from '@/src/db/queries/users';

export default defineEventHandler(async (event) => {
    return await getAllDoctors();
})
