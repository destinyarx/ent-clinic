import { sql } from 'drizzle-orm'
import { bigint, index, pgTable, serial, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey().notNull(),
    supabaseId: uuid('supabase_id').notNull(),
    activeOrgId: uuid('active_org_id').references(() => organizations.id),
    firstName: varchar('first_name', { length: 30 }),
    middleName: varchar('middle_name', { length: 30 }),
    lastName: varchar('last_name', { length: 30 }),
    contactNumber: bigint('contact_number', { mode: 'number' }),
    designationArea: varchar('designation_area', { length: 50 }),
    licenseNumber: varchar('license_number', { length: 30 }),
    email: varchar('email', { length: 255 }),
    position: varchar('position', { length: 50 }),
    birthdate: timestamp('birthdate', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  (table) => ({
    supabaseIdUnique: uniqueIndex('users_supabase_id_unique').on(table.supabaseId),
    activeOrgIdx: index('users_active_org_id_idx').on(table.activeOrgId),
  }),
).enableRLS()

export type UserType = typeof users.$inferInsert
