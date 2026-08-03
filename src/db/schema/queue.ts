import { pgTable, timestamp, varchar, bigint, serial, index, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { patients } from './patients';
import { categoryEnum } from './encounter';
import { organizations } from './organizations';

export const queue = pgTable('queue', {
    id: serial('id').primaryKey().notNull(),
    orgId: uuid('org_id').references(() => organizations.id).notNull(),
    patientId: bigint('patient_id', { mode: 'number' }).references(() => patients.id).notNull(),
    visitType: varchar('visit_type', { length: 50 }), 
    doctorId: uuid('doctor_id').references(() => users.supabaseId).notNull(),
    remarks: varchar({ length: 100 }), 
    companion: varchar({ length: 50 }),
    category: categoryEnum(),
    createdBy: uuid('created_by').references(() => users.supabaseId).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
}, (table) => {
    return {
        patientIdx: index().using('btree', table.patientId.asc().nullsLast()),
        orgIdx: index('queue_org_id_idx').on(table.orgId, table.deletedAt),
    }
}).enableRLS();

export type queueType = typeof queue.$inferInsert;
