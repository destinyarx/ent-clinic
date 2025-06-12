import { pgTable, serial, text, date, timestamp, bigint, varchar } from 'drizzle-orm/pg-core';
import { patients } from './patients';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const medicalHistories = pgTable('medical_histories', {
    id: serial('id').primaryKey(),
    patient_id: bigint('id', { mode: 'number' }).references(() => patients.id).notNull(),
    condition: text('condition').notNull(),
    diagnosedOn: date('diagnosed_on'),
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 100 }).references(() => users.supabaseId).notNull(), 
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});