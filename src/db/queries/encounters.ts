import { and, count, desc, eq, ilike, inArray, isNotNull, isNull, or, sql } from 'drizzle-orm'
import { db } from '../index'
import type { EncounterType } from '../schema/encounter'
import { encounters } from '../schema/encounter'
import { patients } from '../schema/patients'
import { users } from '../schema/users'

type Status = 'open' | 'closed' | 'in_progress' | 'rejected'
type FilterByVisitType = string | string[] | null

export function store(data: EncounterType) {
  return db.insert(encounters).values(data).returning({ insertedId: encounters.id })
}

export function destroy(orgId: string, id: number) {
  return db
    .update(encounters)
    .set({ deletedAt: sql`NOW()` })
    .where(and(eq(encounters.id, id), eq(encounters.orgId, orgId)))
}

export function updateEncounterStatus(orgId: string, id: number, patientId: number, status: Status) {
  return db.transaction(async (tx) => {
    await tx
      .update(patients)
      .set({ status, latestVisit: status === 'in_progress' ? sql`NOW()` : undefined })
      .where(and(eq(patients.id, patientId), eq(patients.orgId, orgId)))

    return tx
      .update(encounters)
      .set({
        status,
        startedAt: status === 'in_progress' ? sql`NOW()` : undefined,
        endedAt: status === 'closed' ? sql`NOW()` : undefined,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(encounters.id, id), eq(encounters.orgId, orgId)))
  })
}

export function finishVisit(orgId: string, patientId: number, encounterId: number) {
  return db.transaction(async (tx) => {
    await tx
      .update(patients)
      .set({ status: null, encounterId: null })
      .where(and(eq(patients.id, patientId), eq(patients.orgId, orgId)))

    await tx
      .update(encounters)
      .set({ status: 'completed', endedAt: sql`NOW()`, updatedAt: sql`NOW()` })
      .where(and(eq(encounters.id, encounterId), eq(encounters.orgId, orgId)))
  })
}

export function fetchPatients(
  orgId: string,
  limit: number,
  offset: number,
  doctorId: string | null,
  status: Status | null,
  searchValue?: string | null,
  filterByVisitType?: FilterByVisitType,
) {
  const filterVisits = typeof filterByVisitType === 'string' ? [filterByVisitType] : (filterByVisitType ?? [])

  return db
    .select({
      id: encounters.id,
      status: encounters.status,
      visitType: encounters.visitType,
      category: encounters.category,
      remarks: encounters.remarks,
      startedAt: encounters.startedAt,
      endedAt: encounters.endedAt,
      patientId: patients.id,
      patientsFullName: sql`CONCAT_WS(' ', ${patients.firstName}, ${patients.middleName}, ${patients.lastName})`.as(
        'patientsFullName',
      ),
      doctorsId: encounters.doctorId,
      doctorsFullName: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`.as(
        'doctorsFullName',
      ),
      birthdate: patients.birthdate,
    })
    .from(encounters)
    .leftJoin(patients, and(eq(encounters.patientId, patients.id), eq(patients.orgId, orgId)))
    .leftJoin(users, eq(encounters.doctorId, users.supabaseId))
    .where(
      and(
        eq(encounters.orgId, orgId),
        isNull(encounters.deletedAt),
        isNull(encounters.endedAt),
        doctorId ? eq(encounters.doctorId, doctorId) : undefined,
        status ? eq(encounters.status, status) : undefined,
        searchValue
          ? or(
              ilike(patients.firstName, `%${searchValue}%`),
              ilike(patients.middleName, `%${searchValue}%`),
              ilike(patients.lastName, `%${searchValue}%`),
            )
          : undefined,
        filterVisits.length ? inArray(encounters.visitType, filterVisits) : undefined,
      ),
    )
    .orderBy(desc(encounters.createdAt))
    .limit(limit)
    .offset(offset)
}

export function getEncounterHistory(orgId: string, patientId: number, limit: number, offset: number) {
  return db
    .select({
      id: encounters.id,
      status: encounters.status,
      visitType: encounters.visitType,
      category: encounters.category,
      remarks: encounters.remarks,
      startedAt: encounters.startedAt,
      endedAt: encounters.endedAt,
      patientId: encounters.patientId,
      doctorsId: encounters.doctorId,
      doctorsFullName: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`.as(
        'doctorsFullName',
      ),
    })
    .from(encounters)
    .leftJoin(users, eq(encounters.doctorId, users.supabaseId))
    .where(
      and(
        eq(encounters.orgId, orgId),
        eq(encounters.patientId, patientId),
        isNull(encounters.deletedAt),
        isNotNull(encounters.startedAt),
        isNotNull(encounters.endedAt),
      ),
    )
    .orderBy(desc(encounters.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function countPendingPatients(orgId: string, doctorId: string) {
  const [result] = await db
    .select({ total: count() })
    .from(encounters)
    .where(and(eq(encounters.orgId, orgId), eq(encounters.status, 'open'), eq(encounters.doctorId, doctorId)))

  return result?.total ?? 0
}
