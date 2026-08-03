import { pgTable, smallint, timestamp, serial, uniqueIndex } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm';
import { permissions } from './permissions';
import { organizationRoleEnum } from './organizationMembers';

export const rolePermissions = pgTable('role_permissions', {
    id: serial('id').primaryKey().notNull(),
    role: organizationRoleEnum('role').notNull(),
    permissionId: smallint().references(() => permissions.id).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
}, (table) => ({
    rolePermissionUnique: uniqueIndex('role_permissions_role_permission_unique')
      .on(table.role, table.permissionId)
      .where(sql`${table.deletedAt} is null`),
})).enableRLS()

export type InsertPermissions = typeof permissions.$inferInsert;
