import { pgTable, pgEnum, timestamp,varchar, integer, index, serial } from "drizzle-orm/pg-core";
import type { PgColumn } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { patients } from "./patients";
import { doctors } from "./doctors";

export const statusEnum = pgEnum("status", ["open", "closed", "in_progress"]);

export const encounters = pgTable("encounters", {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").references((): PgColumn => patients.id).notNull(),
    admitBy: integer("admit_by").references((): PgColumn => users.id).notNull(),
    visitType: varchar({ length: 20 }),
    status: statusEnum().default('open'),
    doctorId:  integer("doctor_id").references((): PgColumn => users.id).notNull(),
    remarks: varchar({ length: 255 }),
    startedAt: timestamp("started_at", { mode: 'string' }),
    endedAt: timestamp("ended_at", { mode: 'string' }),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        patientIdIndex: index().using("btree", table.patientId.asc().nullsLast()),
        assignToIndex: index().using("btree", table.doctorId.asc().nullsLast()),
    }
});

export type EncounterType = typeof encounters.$inferInsert;