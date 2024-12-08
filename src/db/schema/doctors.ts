import { pgTable, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { users } from "./users"

export const doctors = pgTable("doctors", {
    id: serial("id").primaryKey().notNull(),
    supabaseId: varchar("supabase_id", { length: 100 }).references(() => users.supabaseId).notNull().unique(),
    licenseNumber: varchar("license_number", { length: 30 }).unique(),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        supabaseIdIdx: index().using("btree", table.supabaseId.asc().nullsLast()),
    }
});

const insertDoctor = typeof users.$inferInsert;