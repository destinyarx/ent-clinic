import { and, desc, eq, isNull, or, ilike, sql } from 'drizzle-orm';
import { db } from '../index';
import type { InsertPatient } from '../schema/patients';
import { patients } from '../schema/patients';
import { encounters } from '../schema/encounter';

export async function getAllPatients(offset: number, limit: number, searchValue: string|null) {
    return await db
        .select()
        .from(patients)
        .where(
            and(
                isNull(patients.deletedAt),
                searchValue ? 
                or(
                    ilike(patients.firstName, `%${searchValue}%`),
                    ilike(patients.middleName, `%${searchValue}%`),
                    ilike(patients.lastName, `%${searchValue}%`)
                )
                : undefined,
            )
        )
        .orderBy(desc(patients.createdAt))
        .limit(limit) 
        .offset(offset); 
};

export async function getPatientDetails(id: Number) {
    const result = db
      .select({
        patient: patients,             // ↪︎ all patient columns
        encounterId: encounters.id
      })
      .from(patients)
      .leftJoin(encounters, eq(encounters.patientId, patients.id))
      .where(eq(patients.id, id));

      return result;
};

export async function addPatient(patientsInfo: InsertPatient) {
    return await db
        .insert(patients)
        .values(patientsInfo)
        .returning({ insertedId: patients.id });
};

export async function deletePatient(id: Number) {
    return db
        .update(patients)
        .set({ deletedAt: sql`NOW()` })
        .where(eq(patients.id, id));
};

export async function updatePatient(patientsInfo: InsertPatient) {    
    return db
        .update(patients)
        .set({ 
            firstName: patientsInfo.firstName,
            middleName: patientsInfo.middleName,
            lastName: patientsInfo.lastName,
            gender: patientsInfo.gender,
            birthdate: patientsInfo.birthdate,
            contactNumber: patientsInfo.contactNumber,
            address: patientsInfo.address,            
            allergies: patientsInfo.allergies,            
            occupation: patientsInfo.occupation,            
            updatedAt: sql`NOW()`,
        })
        .where(eq(patients.id, patientsInfo.id));
};

export async function updatePatientStatus(id: number, status: string) {
    return await db
        .update(patients)
        .set({ status: status })
        .where(eq(patients.id, id));
}
