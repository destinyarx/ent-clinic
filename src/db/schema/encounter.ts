import { pgTable, pgEnum, timestamp, varchar, integer, index, serial, uuid } from "drizzle-orm/pg-core";
import type { PgColumn } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { patients } from "./patients";
import { organizations } from './organizations';

export const statusEnum = pgEnum('status', ['open', 'closed', 'in_progress', 'rejected', 'completed']);
export const categoryEnum = pgEnum('category', ['ear', 'nose', 'throat', 'eye', 'mixed']);

export const encounters = pgTable("encounters", {
    id: serial("id").primaryKey().notNull(),
    orgId: uuid('org_id').references(() => organizations.id).notNull(),
    patientId: integer("patient_id").references((): PgColumn => patients.id).notNull(),
    visitType: varchar({ length: 20 }),
    status: statusEnum().default('open'),
    category: categoryEnum(),
    doctorId: uuid("doctor_id").references(() => users.supabaseId).notNull(),
    remarks: varchar({ length: 255 }),
    startedAt: timestamp("started_at", { mode: 'string' }),
    endedAt: timestamp("ended_at", { mode: 'string' }),
    createdBy: uuid("created_by").references(() => users.supabaseId).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }),
    deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
    return {
        patientIdIndex: index().using("btree", table.patientId.asc().nullsLast()),
        assignToIndex: index().using("btree", table.doctorId.asc().nullsLast()),
        orgIndex: index('encounters_org_id_idx').on(table.orgId, table.deletedAt),
    }
}).enableRLS();

export type EncounterType = typeof encounters.$inferInsert;
