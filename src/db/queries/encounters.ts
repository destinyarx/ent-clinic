import { desc, and, between, count, eq, isNull, isNotNull, ilike, inArray, or, sql } from 'drizzle-orm';
import { db } from '../index';

import type { EncounterType } from '../schema/encounter';
import { patients } from '../schema/patients';
import { users } from '../schema/users';
import { encounters } from '../schema/encounter';
import { queue } from '../schema/queue';

type Status = 'open'|'closed'|'in_progress'|'rejected';


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

export async function updateEncounterStatus(id: number, patientId: number, status: string, ) {
    // update status in patients table
    await db.update(patients)
        .set({ status: status })
        .where(eq(patients.id, patientId));

    if (status === 'in_progress') {
        await db.update(patients)
        .set({ latestVisit: sql`NOW()` })
        .where(eq(patients.id, patientId));
    }

    if (status === 'in_progress' || status === 'rejected') {
        return await db
            .update(encounters)
            .set({
              status,
              startedAt: status === 'in_progress' ? sql`NOW()` : null,
              updatedAt: sql`NOW()`,
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

export async function finishVisit(patientId: number, encounterId: number) {
    await db.transaction( async (tx) => {
        await tx.update(patients)
            .set({ 
                status: null,
                encounterId: null 
            })
            .where(eq(patients.id, patientId));

        await tx.update(encounters)
        .set({
          status: 'completed',
          endedAt: sql`NOW()`,
          updatedAt: sql`NOW()`,
        })
        .where(eq(encounters.id, encounterId));
    })
}

type FilterByVisitType = string|string[]|null

export async function fetchPatients(limit: number, offset: number, doctor_id: string|null, status: Status|null, searchValue?: string|null, filterByVisitType?: FilterByVisitType) {
    let filterVisits: string[] = [];

    if (typeof filterByVisitType === 'string') {
        filterVisits.push(filterByVisitType)
    } else if (Array.isArray(filterByVisitType)){
        filterVisits = filterByVisitType
    }

    return await db
        .select({
            id: encounters.id,
            status: encounters.status,
            visitType: encounters.visitType,
            category: encounters.category,
            remarks: encounters.remarks,
            startedAt: encounters.startedAt,
            endedAt: encounters.endedAt,
            patientId: patients.id,
            patientsFullName: sql`CONCAT_WS(' ', ${patients.firstName}, ${patients.middleName}, ${patients.lastName})`.as('doctorsFullName'),
            doctorsId: encounters.doctorId,
            doctorsFullName: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`.as('doctorsFullName'),
            birthdate: patients.birthdate
        })
        .from(encounters)
        .leftJoin(patients, eq(encounters.patientId, patients.id))
        .leftJoin(users, eq(encounters.doctorId, users.supabaseId))
        .where(
            and(
                isNull(encounters.deletedAt),
                isNull(encounters.endedAt),
                doctor_id ? eq(encounters.doctorId, doctor_id) : undefined,
                status ? eq(encounters.status, status) : undefined,

                searchValue ? 
                or(
                    ilike(patients.firstName, `%${searchValue}%`),
                    ilike(patients.middleName, `%${searchValue}%`),
                    ilike(patients.lastName, `%${searchValue}%`)
                )
                : undefined,
                
                filterVisits?.length
                    ? inArray(encounters.visitType, filterVisits)
                    : undefined
            )
        )
        .orderBy(desc(encounters.createdAt))
        .limit(limit) 
        .offset(offset); 
}

export async function getEncounterHistory(id: number, limit: number, offset: number) {
    return await db
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
            doctorsFullName: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`.as('doctorsFullName'),
        })
        .from(encounters)
        .leftJoin(users, eq(encounters.doctorId, users.supabaseId))
        .where(
            and(
                eq(encounters.patientId, id),
                isNull(encounters.deletedAt),
                isNotNull(encounters.startedAt),
                isNotNull(encounters.endedAt)
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