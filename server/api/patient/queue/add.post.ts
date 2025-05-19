import { store } from "~/src/db/queries/queue";

export default defineEventHandler(async (event) => {
    let data;

    try {
        const body = await readBody(event);
        data = body.data;

        store(data);
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});