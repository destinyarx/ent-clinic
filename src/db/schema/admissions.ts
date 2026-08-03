import { pgTable, timestamp, integer, index, serial, uuid, varchar } from 'drizzle-orm/pg-core';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { patients } from './patients';
import { organizations } from './organizations';

export const admissions = pgTable('admissions', {
    id: serial('id').primaryKey().notNull(),
    orgId: uuid('org_id').references(() => organizations.id).notNull(),
    patientId: integer('patient_id').references((): PgColumn => patients.id).notNull(),
    admittedUserId: uuid('admitted_user_id').references((): PgColumn => users.supabaseId),
    remarks: varchar({ length: 255 }),
    createdBy: uuid('created_by').references((): PgColumn => users.supabaseId).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
}, (table) => {
    return {
        admittedUserIdIdx: index().using('btree', table.admittedUserId.asc().nullsLast()),
        orgIdx: index('admissions_org_id_idx').on(table.orgId, table.deletedAt),
    }
}).enableRLS();

export type InsertAdmission = typeof admissions.$inferInsert;
