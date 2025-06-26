import { and, desc, eq, ne, isNull, or, ilike, sql } from 'drizzle-orm'
import { db } from '../../index'
import type { VitalsType } from '../../schema/vitals'
import { vitals } from '../../schema/vitals'
import { patients } from '../../schema/patients'
import { users } from '../../schema/users'

export async function getVitals(patientId: number, encounterId: number|null, type: string, offset: number, limit: number) {
    return await db
        .select({
            id: vitals.id,
            systolic: vitals.systolic,
            diatolic: vitals.diatolic,
            heartRate: vitals.heartRate,
            respiratoryRate: vitals.respiratoryRate,
            temperature: vitals.temperature,
            saturation: vitals.saturation,
            remarks: vitals.remarks,
            patientId: patients.id,
            patientsFullName: sql`CONCAT_WS(' ', ${patients.firstName}, ${patients.middleName}, ${patients.lastName})`.as('doctorsFullName'),
            doctorsId: users.id,
            doctorsFullName: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`.as('doctorsFullName'),
        })
        .from(vitals)
        .leftJoin(patients, eq(vitals.patientId, patients.id))
        .leftJoin(users, eq(vitals.createdBy, users.supabaseId))
        .where(and(
            isNull(vitals.deletedAt),
            encounterId && type === 'default' ? eq(vitals.encounterId, encounterId) : undefined,
            encounterId && type === 'history' ? ne(vitals.encounterId, encounterId  ) : undefined,
        ))
        .orderBy(desc(vitals.createdAt))
        .limit(limit) 
        .offset(offset); 
}

export async function addVitals(data: VitalsType) {
    return await db
        .insert(vitals)
        .values(data)    
        .returning({ insertedId: vitals.id });
}

export async function deleteVitals(id: number) {
    return await db
        .update(vitals)
        .set({ deletedAt: sql`NOW()` })
        .where(eq(vitals.id, id));
}
export async function updateVitals(data: Partial<VitalsType>) {
    return await db
        .update(vitals)
        .set({ 
            systolic: data.systolic,
            diatolic: data.diatolic,
            heartRate: data.heartRate,
            respiratoryRate: data.respiratoryRate,
            temperature: data.temperature,
            saturation: data.saturation,
            remarks: data.remarks,
            updatedAt: sql`NOW()`,
        })
        .where(eq(vitals.id, data.id));
}