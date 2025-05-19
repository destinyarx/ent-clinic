import { updateStatus } from "~/src/db/queries/queue";

export default defineEventHandler(async (event) => {
    let data = null;

    try {
        const body = await readBody(event);
        data = body.data;

        updateStatus(data.id, data.type);
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});