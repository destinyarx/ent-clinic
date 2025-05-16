import { pgTable, uniqueIndex, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core"
import { sql, SQL  } from "drizzle-orm"

export const users = pgTable(
    "users", 
    {
        id: serial("id").primaryKey().notNull(),
        permissions: varchar(),
        role: varchar({ length: 30 }),
        firstName: varchar("first_name", { length: 30 }),
        middleName: varchar("middle_name", { length: 30 }),
        lastName: varchar("last_name", { length: 30 }),
        supabaseId: varchar("supabase_id", { length: 100 }).notNull().unique(),
        contactNumber: bigint("contact_number", { mode: 'number' }),
    }
);

export type InsertUser = typeof users.$inferInsert;
