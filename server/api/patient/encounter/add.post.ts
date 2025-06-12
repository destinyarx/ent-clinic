import { store } from "~/src/db/queries/encounters";

export default defineEventHandler(async (event) => {
    let data;

    try {
        const body = await readBody(event);
        const { data, createdBy} = body;

        const encounterData = {
            patientId: data.patientId,
            doctorId: data.doctorId,
            createdBy: data.createdBy,
            visitType: data.visitType,
            category: data.category,
            remarks: data.remarks,
        };

        await store(encounterData);

        return {
            success: true,
            data: 'Patient encounter has been made.',
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: data,
        }
    }
});