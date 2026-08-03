import { pgTable, serial, text, date, timestamp, integer, index, uuid } from 'drizzle-orm/pg-core';
import { patients } from './patients';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { organizations } from './organizations';

export const medicalHistories = pgTable('medical_histories', {
    id: serial('id').primaryKey(),
    orgId: uuid('org_id').references(() => organizations.id).notNull(),
    patientId: integer('patient_id').references(() => patients.id).notNull(),
    condition: text('condition').notNull(),
    diagnosedOn: date('diagnosed_on'),
    notes: text('notes'),
    createdBy: uuid('created_by').references(() => users.supabaseId).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
}, (table) => ({
    orgIdx: index('medical_histories_org_id_idx').on(table.orgId, table.deletedAt),
})).enableRLS();
