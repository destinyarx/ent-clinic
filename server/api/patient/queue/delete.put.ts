import { destroy } from '@/src/db/queries/queue';

export default defineEventHandler(async (event) => {
    let id = null;

    try {
        const body = await readBody(event);
        id = body.id;

        await destroy(id);

        return {
            success: true,
            message: 'Patient successfully remove from queue',
            data: id,
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            data: id,
        }
    }
});