import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm'
import { db } from '../index'
import { encounters } from '../schema/encounter'
import type { InsertPatient } from '../schema/patients'
import { patients } from '../schema/patients'

export function getAllPatients(orgId: string, offset: number, limit: number, searchValue: string | null) {
  return db
    .select()
    .from(patients)
    .where(
      and(
        eq(patients.orgId, orgId),
        isNull(patients.deletedAt),
        searchValue
          ? or(
              ilike(patients.firstName, `%${searchValue}%`),
              ilike(patients.middleName, `%${searchValue}%`),
              ilike(patients.lastName, `%${searchValue}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(patients.createdAt))
    .limit(limit)
    .offset(offset)
}

export function getPatientDetails(orgId: string, id: number) {
  return db
    .select({ patient: patients, encounterId: encounters.id })
    .from(patients)
    .leftJoin(encounters, and(eq(encounters.patientId, patients.id), eq(encounters.orgId, orgId)))
    .where(and(eq(patients.id, id), eq(patients.orgId, orgId), isNull(patients.deletedAt)))
}

export function addPatient(patient: InsertPatient) {
  return db.insert(patients).values(patient).returning({ insertedId: patients.id })
}

export function deletePatient(orgId: string, id: number) {
  return db
    .update(patients)
    .set({ deletedAt: sql`NOW()` })
    .where(and(eq(patients.id, id), eq(patients.orgId, orgId)))
}

export function updatePatient(orgId: string, patient: InsertPatient) {
  return db
    .update(patients)
    .set({
      firstName: patient.firstName,
      middleName: patient.middleName,
      lastName: patient.lastName,
      gender: patient.gender,
      birthdate: patient.birthdate,
      contactNumber: patient.contactNumber,
      address: patient.address,
      allergies: patient.allergies,
      occupation: patient.occupation,
      updatedAt: sql`NOW()`,
    })
    .where(and(eq(patients.id, patient.id!), eq(patients.orgId, orgId)))
}

export function updatePatientStatus(orgId: string, id: number, status: string) {
  return db
    .update(patients)
    .set({ status })
    .where(and(eq(patients.id, id), eq(patients.orgId, orgId)))
}
