import { pgTable, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core";
import type { PgTableWithColumns, PgColumn } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { patients } from "./patients";
import { doctors } from "./doctors";

export const admissions = pgTable("admissions", {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").references((): PgColumn => patients.id).notNull(),
    admitBy: integer("admit_by").references((): PgColumn => users.id).notNull(),
    supabaseId: varchar("supabase_id", { length: 100 }).references((): PgColumn => doctors.supabaseId).notNull().unique(),
    remarks: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        supabaseIdIdx: index().using("btree", table.supabaseId.asc().nullsLast()),
    }
});

export type InsertAdmission = typeof admissions.$inferInsert;