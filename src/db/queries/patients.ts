import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { patients, InsertPatient } from '../schema';

export async function getAllPatients() {
    return db
      .select()
      .from(patients)
}

export async function addPatient(patientsInfo: InsertPatient) {
    const result = await db.insert(patients)
        .values(patientsInfo)
        .returning({ insertedId: patients.id });

    return result;
}
