import { pgTable, uniqueIndex, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from 'drizzle-orm/pg-core'
import { sql, SQL  } from 'drizzle-orm';

export const users = pgTable(
    'users', 
    {
        id: serial('id').primaryKey().notNull(),
        supabaseId: varchar('supabase_id', { length: 100 }).notNull().unique(),
        permissions: varchar(),
        role: varchar({ length: 30 }),
        firstName: varchar('first_name', { length: 30 }),
        middleName: varchar('middle_name', { length: 30 }),
        lastName: varchar('last_name', { length: 30 }),
        contactNumber: bigint('contact_number', { mode: 'number' }),
        designationArea: varchar('designation_area', { length: 50 }),
        licenseNumber: varchar('license_number', { length: 30 }),
        email: varchar('email', { length: 50 }),
        position: varchar('position', { length: 50 }),
        createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp('updated_at', { mode: 'string' }),
        deletedAt: timestamp('deleted_at', { mode: 'string' }),
    }
);

export type UserType = typeof users.$inferInsert;
