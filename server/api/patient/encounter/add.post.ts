import { store } from "~/src/db/queries/encounters";
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
    let data;

    try {
        const tenant = await requireTenantContext(event);
        const body = await readBody(event);
        const { data } = body;

        const encounterData = {
            patientId: data.patientId,
            orgId: tenant.orgId,
            doctorId: data.doctorId,
            createdBy: tenant.supabaseId,
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
