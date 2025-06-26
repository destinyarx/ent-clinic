import { pgTable, timestamp, varchar, smallint, decimal, bigint, serial, index, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { patients } from './patients';
import { encounters } from './encounter';

export const vitals = pgTable('vitals', {
    id: serial('id').primaryKey().notNull(),
    patientId: bigint('patient_id', { mode: 'number' }).references(() => patients.id).notNull(),
    encounterId: bigint('encounter_id', { mode: 'number' }).references(() => encounters.id).notNull(),
    
    systolic: smallint(),
    diatolic: smallint(),
    heartRate: smallint('heart_rate'),
    respiratoryRate: smallint('respiratory_rate'),
    temperature: decimal('temperature', { precision: 10, scale: 2 }),
    saturation: smallint(),
    remarks: varchar({ length: 100 }), 

    createdBy: varchar('created_by', { length: 100 }).references(() => users.supabaseId).notNull(), 
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
}, (table) => {
    return {
        patientIdx: index('patient_idx').on(table.patientId),
        encounterIdx: index('encounter_idx').on(table.encounterId),
        createdByIdx: index('created_by_idx').on(table.createdBy),
    }
});

export type VitalsType = typeof vitals.$inferInsert;