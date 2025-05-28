import { asc, desc, between, count, eq, getTableColumns, isNull, sql, fn } from 'drizzle-orm';
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