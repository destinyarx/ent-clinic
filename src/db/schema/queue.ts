import { pgTable, timestamp, varchar, serial, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { users } from "./users"

export const queue = pgTable("queue", {
    id: serial("id").primaryKey().notNull(),
    patientId: varchar("patient_id", { length: 100 }).references(() => users.supabaseId).notNull().unique(),
    type: varchar({ length: 50 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        patientIdx: index().using("btree", table.patientId.asc().nullsLast()),
    }
});

export type queueType = typeof queue.$inferInsert;