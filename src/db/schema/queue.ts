import { pgTable, timestamp, varchar, smallint, bigint, serial, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { patients } from './patients';

export const queue = pgTable('queue', {
    id: serial('id').primaryKey().notNull(),
    patientId: bigint('patient_id', { mode: 'number' }).references(() => patients.id).notNull(),
    visitType: varchar('visit_type', { length: 50 }), 
    doctorId: smallint('doctor_id').references(() => users.id).notNull(),
    remarks: varchar({ length: 100 }), 
    companion: varchar({ length: 50 }), 
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
}, (table) => {
    return {
        patientIdx: index().using("btree", table.patientId.asc().nullsLast()),
    }
});

export type queueType = typeof queue.$inferInsert;