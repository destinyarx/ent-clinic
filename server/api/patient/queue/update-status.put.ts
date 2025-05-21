import { updateQueueStatus } from "~/src/db/queries/patients";

export default defineEventHandler(async (event) => {
    let data = null;

    try {
        const body = await readBody(event);
        data = body.data;

        await updateQueueStatus(data.id, data.type);

        return {
            success: true,
            data: 'Queue status successfully updated.',
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});