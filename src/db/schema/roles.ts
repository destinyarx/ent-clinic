import { pgTable, json, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const roles = pgTable("roles", {
    id: serial("id").primaryKey().notNull(),
    permissionIds: json('permission_ids').$type<string[]>().notNull().default([]),
    description: varchar(),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
})

export type InsertRoles = typeof roles.$inferInsert;