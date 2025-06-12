import { pgTable, timestamp, varchar, smallint, bigint, serial, index, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { patients } from './patients';

export const categoryEnum = pgEnum('category', ['ear', 'nose', 'throat', 'eye', 'mixed']);

export const queue = pgTable('queue', {
    id: serial('id').primaryKey().notNull(),
    patientId: bigint('patient_id', { mode: 'number' }).references(() => patients.id).notNull(),
    visitType: varchar('visit_type', { length: 50 }), 
    doctorId: varchar('doctor_id', { length: 100 }).references(() => users.supabaseId).notNull(),
    remarks: varchar({ length: 100 }), 
    companion: varchar({ length: 50 }),
    category: categoryEnum(),
    createdBy: varchar('created_by', { length: 100 }).references(() => users.supabaseId).notNull(), 
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
}, (table) => {
    return {
        patientIdx: index().using('btree', table.patientId.asc().nullsLast()),
    }
});

export type queueType = typeof queue.$inferInsert;