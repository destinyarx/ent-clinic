import { asc, desc, between, count, eq, getTableColumns, isNull, sql, fn } from 'drizzle-orm';
import { db } from '../index';

import type { EncounterType } from '../schema/encounter';
import { patients } from '../schema/patients';
import { users } from '../schema/users';
import { encounters } from '../schema/encounter';


export async function store(data: EncounterType) {
    return await db
        .insert(encounters)
        .values({
            ...data,
            startedAt: new Date().toISOString(),
        })
        .returning({ insertedId: encounters.id });
}

export async function destroy(id: number) {
    return await db
        .update(encounters)
        .set({ deletedAt: sql`NOW()` })
        .where(eq(encounters.id, id));
}