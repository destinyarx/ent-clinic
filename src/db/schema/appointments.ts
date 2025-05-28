import { pgTable, timestamp, varchar, integer, index, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm";
import { patients } from "./patients";
import { users } from "./users";

export const appointments = pgTable("appointments", {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").references(() => patients.id).notNull(),
    appointmentDateTime: timestamp("updated_at", { mode: 'string' }).notNull(),
    doctorStatus: varchar("doctor_status", { length: 20 }),
    patientStatus: varchar("patient_status", { length: 20 }),
    doctorId: varchar("doctor_id", { length: 100 }).references(() => users.supabaseId).notNull(),
    reasonForVisit: varchar("reason_for_visit", { length: 255 }),
    createdBy: varchar("created_by", { length: 100 }).references(() => users.supabaseId).notNull(), 
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        doctorSupabaseIdIdx: index().using("btree", table.doctorId.asc().nullsLast()),
    }
});

const insertAppointment = typeof appointments.$inferInsert;