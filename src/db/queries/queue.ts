import { asc, desc, between, count, eq, getTableColumns, isNull, sql } from 'drizzle-orm';
import { db } from '../index';
import type { InsertPatient } from '../schema/patients';
import { patients } from '../schema/patients';
import type { queueType } from '../schema/queue';
import { queue } from '../schema/queue';

export async function getAllQueue(offset: number, limit: number) {
    return await db
        .select()
        .from(queue)
        .where(isNull(queue.deletedAt))
        .orderBy(asc(queue.createdAt))
        .limit(limit)
        .offset(offset);  
}

export async function store(data: queueType) {
    return await db
        .insert(queue)
        .values(data)
        .returning({ insertedId: queue.id });
}

export async function destroy(id: number) {
    return await db
        .update(queue)
        .set({ deletedAt: sql`NOW()` })
        .where(eq(queue.id, id));
}

export async function updateStatus(id: number, type: string) {
    return await db
        .update(queue)
        .set({ 
            type: type,
            updatedAt: sql`NOW()`           
        })
        .where(eq(queue.id, id));
}