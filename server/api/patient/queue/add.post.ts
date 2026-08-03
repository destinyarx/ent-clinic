import { store } from "~/src/db/queries/queue";
import { requireTenantContext } from '@/server/utils/tenantContext';

export default defineEventHandler(async (event) => {
    let data;

    try {
        const tenant = await requireTenantContext(event);
        const body = await readBody(event);
        data = body.data;

        const queueData = {
            patientId: data.id,
            orgId: tenant.orgId,
            visitType: data.visitType.name,
            category: data.caseCategory.value,
            doctorId: data.doctor.id,
            remarks: data.reason,
            companion: data.companion,
            createdBy: tenant.supabaseId
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
