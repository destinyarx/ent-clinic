import { pgTable, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { patients } from "./patients";
import { doctors } from "./doctors";

export const admissions = pgTable("admissions", {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").references(() => patients.id).notNull(),
    admitBy: integer("admit_by").references(() => users.id).notNull(),
    doctorId: integer("doctor_id").references(() => doctors.id),
    remarks: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        doctorIdIdx: index().using("btree", table.doctorId.asc().nullsLast()),
    }
});

export type InsertAdmission = typeof admissions.$inferInsert;