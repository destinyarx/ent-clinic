import { store } from "~/src/db/queries/encounters";

export default defineEventHandler(async (event) => {
    let data;

    try {
        const body = await readBody(event);
        const { data, admitBy} = body;

        const encounterData = {
            patientId: data.patientId,
            doctorId: data.doctorId,
            admitBy: data.admitBy,
            visitType: data.visitType,
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