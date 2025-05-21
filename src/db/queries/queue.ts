import { asc, desc, between, count, eq, getTableColumns, isNull, sql } from 'drizzle-orm';
import { db } from '../index';

import type { queueType } from '../schema/queue';
import { patients } from '../schema/patients';
import { users } from '../schema/users';
import { queue } from '../schema/queue';

export async function getAllQueueDummy(offset: number, limit: number) {
    return await db
        .select()
        .from(queue)
        .where(isNull(queue.deletedAt))
        .orderBy(asc(queue.createdAt))
        .limit(limit)
        .offset(offset);  
}

export async function getAllQueue(offset: number, limit: number) {
    return await db
      .select({
        id: queue.id,
        patientId: queue.patientId,
        visitType: queue.visitType,        
        reason: queue.reason,        
        companion: queue.companion,        
        createdAt: queue.createdAt,        
        patientFullName: sql<string>`concat_ws(' ', patients.first_name, patients.middle_name, patients.last_name)`,
        doctorsFullName: sql<string>`concat_ws(' ', users.first_name, users.middle_name, users.last_name)`,
      })
      .from(queue)
      .leftJoin(patients, eq(patients.id, queue.patientId))
      .leftJoin(users, eq(users.id, queue.doctorId))
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

export async function updateQueueStatus(id: number, type: string) {
    return await db
        .update(queue)
        .set({ 
            visitType: type,
            updatedAt: sql`NOW()`           
        })
        .where(eq(queue.id, id));
}