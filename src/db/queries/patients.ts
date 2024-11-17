import { asc, between, count, eq, getTableColumns, isNull, sql } from 'drizzle-orm';
import { db } from '../index';
import type { InsertPatient } from '../schema/patients';
import { patients } from '../schema/patients';

export async function getAllPatients() {
    return db
      .select()
      .from(patients)
      .where(isNull(patients.deletedAt));
}

export async function addPatient(patientsInfo: InsertPatient) {
    return await db.insert(patients)
        .values(patientsInfo)
        .returning({ insertedId: patients.id });
}

export async function deletePatient(id: Number) {
    return db.update(patients)
        .set({ deletedAt: sql`NOW()` })
        .where(eq(patients.id, id));
}
