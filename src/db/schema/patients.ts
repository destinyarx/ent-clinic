import { pgTable, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const patients = pgTable("patients", {
    id: serial("id").primaryKey().notNull(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    middleName: varchar("middle_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    gender: varchar({ length: 10 }).notNull(),
    birthdate: date().notNull(),
    address: varchar(),
    contactNumber: smallint("contact_number"),
    allergies: varchar(),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export type InsertPatient = typeof patients.$inferInsert;