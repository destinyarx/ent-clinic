import { and, desc, eq, isNull, ne, sql } from 'drizzle-orm'
import { db } from '../../index'
import { patients } from '../../schema/patients'
import { users } from '../../schema/users'
import type { VitalsType } from '../../schema/vitals'
import { vitals } from '../../schema/vitals'

export function getVitals(
  orgId: string,
  patientId: number,
  encounterId: number | null,
  type: string,
  offset: number,
  limit: number,
) {
  return db
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
      patientsFullName: sql`CONCAT_WS(' ', ${patients.firstName}, ${patients.middleName}, ${patients.lastName})`.as(
        'patientsFullName',
      ),
      doctorsId: users.id,
      doctorsFullName: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`.as(
        'doctorsFullName',
      ),
    })
    .from(vitals)
    .leftJoin(patients, and(eq(vitals.patientId, patients.id), eq(patients.orgId, orgId)))
    .leftJoin(users, eq(vitals.createdBy, users.supabaseId))
    .where(
      and(
        eq(vitals.orgId, orgId),
        eq(vitals.patientId, patientId),
        isNull(vitals.deletedAt),
        encounterId && type === 'default' ? eq(vitals.encounterId, encounterId) : undefined,
        encounterId && type === 'history' ? ne(vitals.encounterId, encounterId) : undefined,
      ),
    )
    .orderBy(desc(vitals.createdAt))
    .limit(limit)
    .offset(offset)
}

export function addVitals(data: VitalsType) {
  return db.insert(vitals).values(data).returning({ insertedId: vitals.id })
}

export function deleteVitals(orgId: string, id: number) {
  return db
    .update(vitals)
    .set({ deletedAt: sql`NOW()` })
    .where(and(eq(vitals.id, id), eq(vitals.orgId, orgId)))
}

export function updateVitals(orgId: string, data: Partial<VitalsType>) {
  return db
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
    .where(and(eq(vitals.id, data.id!), eq(vitals.orgId, orgId)))
}
