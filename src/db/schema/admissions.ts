import { pgTable, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core";
import type { PgTableWithColumns, PgColumn } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { patients } from "./patients";
import { users } from "./users";

export const admissions = pgTable("admissions", {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").references((): PgColumn => patients.id).notNull(),
    supabaseId: varchar("supabase_id", { length: 100 }).references((): PgColumn => users.supabaseId),
    remarks: varchar({ length: 255 }),
    createdBy: varchar("supabase_id", { length: 100 }).references((): PgColumn => users.supabaseId).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        supabaseIdIdx: index().using("btree", table.supabaseId.asc().nullsLast()),
    }
});

export type InsertAdmission = typeof admissions.$inferInsert;