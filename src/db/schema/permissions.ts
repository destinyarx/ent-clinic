import { pgTable, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const permissions = pgTable("permissions", {
    id: serial("id").primaryKey().notNull(),
    permissionName: varchar("permission_name", { length: 50 }).notNull(),
    description: varchar(),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
})

export type InsertPermissions = typeof permissions.$inferInsert;