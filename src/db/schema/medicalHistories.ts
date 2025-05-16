import { pgTable, serial, text, date, timestamp, bigint } from "drizzle-orm/pg-core";
import { patients } from "./patients";
import { sql } from "drizzle-orm"

export const medicalHistories = pgTable("medical_histories", {
    id: serial("id").primaryKey(),
    patient_id: bigint("id", { mode: 'number' }).references(() => patients.id).notNull(),
    condition: text("condition").notNull(),
    diagnosedOn: date("diagnosed_on"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});