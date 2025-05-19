import { pgTable, timestamp, varchar, integer, index, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm";
import { patients } from "./patients";
import { doctors } from "./doctors";

export const appointments = pgTable("appointments", {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").references(() => patients.id).notNull(),
    appointmentDateTime: timestamp("updated_at", { mode: 'string' }).notNull(),
    doctorStatus: varchar("doctor_status", { length: 20 }),
    patientStatus: varchar("patient_status", { length: 20 }),
    supabaseId: varchar("supabase_id", { length: 100 }).references(() => doctors.supabaseId).notNull().unique(),
    reasonForVisit: varchar("reason_for_visit", { length: 255 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        doctorSupabaseIdIdx: index().using("btree", table.supabaseId.asc().nullsLast()),
    }
});

const insertAppointment = typeof appointments.$inferInsert;