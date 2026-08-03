import { and, asc, eq, isNull, sql } from 'drizzle-orm'
import { db } from '../index'
import { patients } from '../schema/patients'
import type { queueType } from '../schema/queue'
import { queue } from '../schema/queue'
import { users } from '../schema/users'

export function getAllQueue(orgId: string, offset: number, limit: number) {
  return db
    .select({
      id: queue.id,
      patientId: queue.patientId,
      doctorId: queue.doctorId,
      visitType: queue.visitType,
      category: queue.category,
      remarks: queue.remarks,
      companion: queue.companion,
      createdAt: queue.createdAt,
      patientFullName: sql<string>`concat_ws(' ', ${patients.firstName}, ${patients.middleName}, ${patients.lastName})`,
      doctorsFullName: sql<string>`concat_ws(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`,
    })
    .from(queue)
    .leftJoin(patients, and(eq(patients.id, queue.patientId), eq(patients.orgId, orgId)))
    .leftJoin(users, eq(users.supabaseId, queue.doctorId))
    .where(and(eq(queue.orgId, orgId), isNull(queue.deletedAt)))
    .orderBy(asc(queue.createdAt))
    .limit(limit)
    .offset(offset)
}

export function store(data: queueType) {
  return db.insert(queue).values(data).returning({ insertedId: queue.id })
}

export function destroy(orgId: string, id: number) {
  return db
    .update(queue)
    .set({ deletedAt: sql`NOW()` })
    .where(and(eq(queue.id, id), eq(queue.orgId, orgId)))
}

export function updateQueueStatus(orgId: string, id: number, type: string) {
  return db
    .update(queue)
    .set({ visitType: type, updatedAt: sql`NOW()` })
    .where(and(eq(queue.id, id), eq(queue.orgId, orgId)))
}
