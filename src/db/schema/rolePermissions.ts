import { pgTable, smallint, timestamp, varchar, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm";
import { permissions } from "./permissions";

export const rolePermissions = pgTable("role_permissions", {
    id: serial("id").primaryKey().notNull(),
    role: varchar({ length: 50 }).notNull(),
    permissionId: smallint().references(() => permissions.id).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
})

export type InsertPermissions = typeof permissions.$inferInsert;