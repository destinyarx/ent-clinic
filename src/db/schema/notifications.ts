import { pgTable, uuid, serial, text, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core'
import { sql } from "drizzle-orm"
import { users } from "./users"


export const notifications = pgTable('notifications',
  {
    id: serial('id').primaryKey().notNull(),
    source: text('source'),
    userId:  varchar('user_id', { length: 100 }).references(() => users.supabaseId).notNull(),
    title: text('title').notNull(),
    body: text('body'),
    readAt: timestamp('read_at', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    sourceIdx: index('source_idx').on(table.source),
  })
)
