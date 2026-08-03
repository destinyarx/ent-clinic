import { sql } from 'drizzle-orm'
import { check, index, integer, pgEnum, pgTable, serial, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { organizationRoleEnum } from './organizationMembers'
import { organizations } from './organizations'
import { users } from './users'

export const organizationJoinRequestStatusEnum = pgEnum('organization_join_request_status', [
  'pending',
  'approved',
  'rejected',
])

export const organizationJoinRequests = pgTable(
  'organization_join_requests',
  {
    id: serial('id').primaryKey().notNull(),
    orgId: uuid('org_id').references(() => organizations.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    requestedRole: organizationRoleEnum('requested_role').notNull(),
    status: organizationJoinRequestStatusEnum('status').default('pending').notNull(),
    reviewedBy: integer('reviewed_by').references(() => users.id),
    reviewedAt: timestamp('reviewed_at', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  (table) => ({
    staffRoleOnly: check(
      'organization_join_requests_staff_role_check',
      sql`${table.requestedRole} in ('doctor', 'attendant')`,
    ),
    onePendingRequestPerUser: uniqueIndex('organization_join_requests_pending_user_unique')
      .on(table.userId)
      .where(sql`${table.status} = 'pending' and ${table.deletedAt} is null`),
    organizationStatusIdx: index('organization_join_requests_org_status_idx').on(
      table.orgId,
      table.status,
      table.deletedAt,
    ),
    userHistoryIdx: index('organization_join_requests_user_idx').on(table.userId, table.createdAt),
  }),
).enableRLS()

export type OrganizationJoinRequest = typeof organizationJoinRequests.$inferSelect
