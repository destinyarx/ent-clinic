import { updateEncounterStatus } from '@/src/db/queries/encounters'
import { requireTenantContext } from '@/server/utils/tenantContext'

export default defineEventHandler(async (event) => {
    let data;

    try {
        const tenant = await requireTenantContext(event);
        const query = getQuery(event);
        const id = Number(query.id);
        const status = String(query.status);
        const patientId = Number(query.patientId);
        
        await updateEncounterStatus(
            tenant.orgId,
            id,
            patientId,
            status as 'open' | 'closed' | 'in_progress' | 'rejected'
        );

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
