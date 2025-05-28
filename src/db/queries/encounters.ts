import { desc, and, between, count, eq, isNull, sql } from 'drizzle-orm';
import { db } from '../index';

import type { EncounterType } from '../schema/encounter';
import { patients } from '../schema/patients';
import { users } from '../schema/users';
import { encounters } from '../schema/encounter';

type Status = 'open'|'closed'|'in_progress';


export async function store(data: EncounterType) {
    return await db
        .insert(encounters)
        .values({
            ...data,
        })
        .returning({ insertedId: encounters.id });
}

export async function destroy(id: number) {
    return await db
        .update(encounters)
        .set({ deletedAt: sql`NOW()` })
        .where(eq(encounters.id, id));
}

export async function updateEncounterStatus(id: number, status: Status, ) {
    if (status === 'in_progress') {
        return await db
            .update(encounters)
            .set({
              status,
              startedAt: sql`NOW()`,
            })
            .where(eq(encounters.id, id));
    } else if (status === 'closed') {
        return await db
        .update(encounters)
        .set({
          status,
          endedAt: sql`NOW()`,
        })
        .where(eq(encounters.id, id));
    }
}

export async function fetchPatients(limit: number, offset: number, doctor_id: string|null, status: Status|null) {
    return await db
        .select({
            status: encounters.status,
            visitType: encounters.visitType,
            remarks: encounters.remarks,
            startedAt: encounters.startedAt,
            endedAt: encounters.endedAt,
            doctorsId: encounters.doctorId,
            doctorsFullName: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`.as('doctorsFullName'),
            patientsFullName: sql`CONCAT_WS(' ', ${patients.firstName}, ${patients.middleName}, ${patients.lastName})`.as('doctorsFullName'),
            birthdate: patients.birthdate
        })
        .from(encounters)
        .leftJoin(patients, eq(encounters.patientId, patients.id))
        .leftJoin(users, eq(encounters.doctorId, users.supabaseId))
        .where(
            and(
                isNull(encounters.deletedAt),
                doctor_id ? eq(encounters.doctorId, doctor_id) : undefined,
                status ? eq(encounters.status, status) : undefined
            )
        )
        .orderBy(desc(encounters.createdAt))
        .limit(limit) 
        .offset(offset); 
}

export async function countPendingPatients(doctorId: string) {
    const [result] = await db
        .select({ total: count() })
        .from(encounters)
        .where(
            and(
            eq(encounters.status, 'open'),
            eq(encounters.doctorId, doctorId),
            )
        )
        .execute();

    return result?.total ?? 0;
}