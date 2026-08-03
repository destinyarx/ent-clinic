import { sql } from 'drizzle-orm'
import { index, integer, pgEnum, pgTable, serial, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { users } from './users'

export const organizationRoleEnum = pgEnum('organization_role', [
  'owner',
  'admin',
  'attendant',
  'doctor',
])

export const organizationMembers = pgTable(
  'organization_members',
  {
    id: serial('id').primaryKey().notNull(),
    orgId: uuid('org_id')
      .references(() => organizations.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    role: organizationRoleEnum('role').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  (table) => ({
    oneActiveMembershipPerUser: uniqueIndex('organization_members_active_user_unique')
      .on(table.userId)
      .where(sql`${table.deletedAt} is null`),
    userMembershipsIdx: index('organization_members_user_id_idx').on(table.userId, table.deletedAt),
    organizationMembershipsIdx: index('organization_members_org_id_idx').on(table.orgId, table.deletedAt),
  }),
).enableRLS()

export type OrganizationMember = typeof organizationMembers.$inferSelect
