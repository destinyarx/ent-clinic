import { pgTable, uuid, serial, text, timestamp, index } from 'drizzle-orm/pg-core'
import { sql } from "drizzle-orm"
import { users } from "./users"
import { organizations } from './organizations'


export const notifications = pgTable('notifications',
  {
    id: serial('id').primaryKey().notNull(),
    orgId: uuid('org_id').references(() => organizations.id).notNull(),
    source: text('source'),
    userId: uuid('user_id').references(() => users.supabaseId).notNull(),
    title: text('title').notNull(),
    body: text('body'),
    readAt: timestamp('read_at', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  (table) => ({
    sourceIdx: index('source_idx').on(table.source),
    orgIdx: index('notifications_org_id_idx').on(table.orgId, table.deletedAt),
  })
).enableRLS()
