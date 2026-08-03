import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: varchar('name', { length: 120 }).notNull(),
    inviteCode: varchar('invite_code', { length: 32 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  (table) => ({
    inviteCodeUnique: uniqueIndex('organizations_invite_code_unique').on(table.inviteCode),
    activeOrganizationsIdx: index('organizations_deleted_at_idx').on(table.deletedAt),
  }),
).enableRLS()

export type Organization = typeof organizations.$inferSelect
