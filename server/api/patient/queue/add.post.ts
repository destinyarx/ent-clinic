import { store } from "~/src/db/queries/queue";

export default defineEventHandler(async (event) => {
    let data;

    try {
        const body = await readBody(event);
        data = body.data;

        const queueData = {
            patientId: data.id,
            visitType: data.visitType.name,
            doctorId: data.doctor.id,
            reason: data.reason,
            companion: data.companion,
            createdBy: data.createdBy
        };

        await store(queueData);

        return {
            success: true,
            data: 'Patient has been successfully added to queue.',
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});