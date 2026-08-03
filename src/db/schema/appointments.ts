import { pgTable, timestamp, varchar, integer, index, serial, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm';
import { patients } from './patients';
import { users } from './users';
import { organizations } from './organizations';

export const appointments = pgTable('appointments', {
    id: serial('id').primaryKey().notNull(),
    orgId: uuid('org_id').references(() => organizations.id).notNull(),
    patientId: integer('patient_id').references(() => patients.id).notNull(),
    appointmentDateTime: timestamp('appointment_date_time', { mode: 'string' }).notNull(),
    doctorStatus: varchar('doctor_status', { length: 20 }),
    patientStatus: varchar('patient_status', { length: 20 }),
    doctorId: uuid('doctor_id').references(() => users.supabaseId).notNull(),
    reasonForVisit: varchar('reason_for_visit', { length: 255 }),
    createdBy: uuid('created_by').references(() => users.supabaseId).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
}, (table) => {
    return {
        doctorSupabaseIdIdx: index().using('btree', table.doctorId.asc().nullsLast()),
        orgIdx: index('appointments_org_id_idx').on(table.orgId, table.deletedAt),
    }
}).enableRLS();

const insertAppointment = typeof appointments.$inferInsert;
