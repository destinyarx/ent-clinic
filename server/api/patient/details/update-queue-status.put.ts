import { updateQueueStatus } from '@/src/db/queries/patients';

export default defineEventHandler(async (event) => {
    let data = null;
    
    try {
        const body = await readBody(event);
        const { id, queueStatus } = body;

        const response = await updateQueueStatus(id, queueStatus);

        return response;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});