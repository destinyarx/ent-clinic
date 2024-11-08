import { pgTable, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const patients = pgTable("patients", {
    id: serial("id").primaryKey().notNull(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    middleName: varchar("middle_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    gender: varchar({ length: 10 }).notNull(),
    birthdate: date().notNull(),
    address: varchar({ length: 255 }),
    contactNumber: smallint("contact_number"),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export type InsertPatient = typeof patients.$inferInsert;

export const users = pgTable("users", {
    id: serial("id").primaryKey().notNull(),
    role: integer().notNull(),
    firstName: varchar({ length: 30 }),
    middleName: varchar({ length: 30 }),
    lastName: varchar({ length: 30 }),
    supabaseId: varchar("supabase_id", { length: 100 }).notNull(),
});

export type InsertUser = typeof users.$inferInsert;

export const doctors = pgTable("doctors", {
    id: serial("id").primaryKey().notNull(),
    usersId: integer("users_id").references(() => users.id).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    licenseNumber: varchar("license_number", { length: 30 }),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

const insertDoctor = typeof users.$inferInsert;

export const appointments = pgTable("appointments", {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").references(() => patients.id).notNull(),
    appointmentDateTime: timestamp("updated_at", { mode: 'string' }).notNull(),
    doctorsId: integer("doctors_id").references(()=> doctors.id),
    remarks: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

const insertAppointment = typeof appointments.$inferInsert;

export const admissions = pgTable("admissions", {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").references(() => patients.id).notNull(),
    admitBy: integer("admit_by").references(() => users.id).notNull(),
    remarks: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export type InsertAdmission = typeof admissions.$inferInsert;


