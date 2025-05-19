import { asc, between, count, eq, getTableColumns, isNull, sql } from 'drizzle-orm';
import { db } from '../index';
import type { InsertPatient } from '../schema/patients';
import { patients } from '../schema/patients';

export async function getAllPatients() {
    return db
      .select()
      .from(patients)
      .where(isNull(patients.deletedAt));
};

export async function addPatient(patientsInfo: InsertPatient) {
    return await db
        .insert(patients)
        .values(patientsInfo)
        .returning({ insertedId: patients.id });
};

export async function updateQueueStatus(id: number, status: boolean) {
    return await db
        .update(patients)
        .set({ boolean: status })
        .where(eq(patients.id, id));
}

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
            updatedAt: sql`NOW()`,
        })
        .where(eq(patients.id, patientsInfo.id));
};
