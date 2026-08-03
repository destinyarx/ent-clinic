DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('ear', 'nose', 'throat', 'eye', 'mixed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('open', 'closed', 'in_progress', 'rejected', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."organization_role" AS ENUM('owner', 'admin', 'attendant', 'doctor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"patient_id" integer NOT NULL,
	"admitted_user_id" uuid,
	"remarks" varchar(255),
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "admissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"patient_id" integer NOT NULL,
	"appointment_date_time" timestamp NOT NULL,
	"doctor_status" varchar(20),
	"patient_status" varchar(20),
	"doctor_id" uuid NOT NULL,
	"reason_for_visit" varchar(255),
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "appointments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "encounters" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"patient_id" integer NOT NULL,
	"visitType" varchar(20),
	"status" "status" DEFAULT 'open',
	"category" "category",
	"doctor_id" uuid NOT NULL,
	"remarks" varchar(255),
	"started_at" timestamp,
	"ended_at" timestamp,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "encounters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_histories" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"patient_id" integer NOT NULL,
	"condition" text NOT NULL,
	"diagnosed_on" date,
	"notes" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "medical_histories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"source" text,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" integer NOT NULL,
	"role" "organization_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "organization_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"invite_code" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"middle_name" varchar(50),
	"last_name" varchar(50),
	"gender" varchar(10) NOT NULL,
	"birthdate" date NOT NULL,
	"address" varchar,
	"contact_number" varchar(20),
	"allergies" text[],
	"status" varchar(30),
	"occupation" varchar(50),
	"encounter_id" bigint,
	"created_by" uuid NOT NULL,
	"latest_visit" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "patients" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "permissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"patient_id" bigint NOT NULL,
	"visit_type" varchar(50),
	"doctor_id" uuid NOT NULL,
	"remarks" varchar(100),
	"companion" varchar(50),
	"category" "category",
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "queue" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "organization_role" NOT NULL,
	"permissionId" smallint NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "role_permissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"supabase_id" uuid NOT NULL,
	"active_org_id" uuid,
	"first_name" varchar(30),
	"middle_name" varchar(30),
	"last_name" varchar(30),
	"contact_number" bigint,
	"designation_area" varchar(50),
	"license_number" varchar(30),
	"email" varchar(255),
	"position" varchar(50),
	"birthdate" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vitals" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"patient_id" bigint NOT NULL,
	"encounter_id" bigint NOT NULL,
	"systolic" smallint,
	"diatolic" smallint,
	"heart_rate" smallint,
	"respiratory_rate" smallint,
	"temperature" numeric(10, 2),
	"saturation" smallint,
	"remarks" varchar(100),
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "vitals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DO $$
DECLARE
 constraint_record record;
BEGIN
 FOR constraint_record IN
  SELECT conrelid::regclass AS table_name, conname
  FROM pg_constraint
  WHERE contype = 'f'
    AND connamespace = 'public'::regnamespace
    AND conrelid::regclass::text = ANY (ARRAY[
      'admissions', 'appointments', 'encounters', 'medical_histories', 'notifications',
      'organization_members', 'patients', 'queue', 'role_permissions', 'users', 'vitals'
    ])
 LOOP
  EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', constraint_record.table_name, constraint_record.conname);
 END LOOP;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'updated_at'
 ) AND NOT EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'appointment_date_time'
 ) THEN
  ALTER TABLE "appointments" RENAME COLUMN "updated_at" TO "appointment_date_time";
 END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'admissions' AND column_name = 'supabase_id'
 ) AND NOT EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'admissions' AND column_name = 'created_by'
 ) THEN
  ALTER TABLE "admissions" RENAME COLUMN "supabase_id" TO "created_by";
 END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'supabase_id'
 ) AND NOT EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'created_by'
 ) THEN
  ALTER TABLE "patients" RENAME COLUMN "supabase_id" TO "created_by";
 END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "active_org_id" uuid;--> statement-breakpoint
ALTER TABLE "admissions" ADD COLUMN IF NOT EXISTS "org_id" uuid;--> statement-breakpoint
ALTER TABLE "admissions" ADD COLUMN IF NOT EXISTS "admitted_user_id" uuid;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "org_id" uuid;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "appointment_date_time" timestamp;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "encounters" ADD COLUMN IF NOT EXISTS "org_id" uuid;--> statement-breakpoint
ALTER TABLE "medical_histories" ADD COLUMN IF NOT EXISTS "org_id" uuid;--> statement-breakpoint
ALTER TABLE "medical_histories" ADD COLUMN IF NOT EXISTS "patient_id" integer;--> statement-breakpoint
ALTER TABLE "medical_histories" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "medical_histories" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "org_id" uuid;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "org_id" uuid;--> statement-breakpoint
ALTER TABLE "queue" ADD COLUMN IF NOT EXISTS "org_id" uuid;--> statement-breakpoint
ALTER TABLE "vitals" ADD COLUMN IF NOT EXISTS "org_id" uuid;--> statement-breakpoint
UPDATE "medical_histories" SET "patient_id" = "id" WHERE "patient_id" IS NULL;--> statement-breakpoint
ALTER TABLE "medical_histories" ALTER COLUMN "id" TYPE integer USING "id"::integer;--> statement-breakpoint
CREATE SEQUENCE IF NOT EXISTS "medical_histories_id_seq" OWNED BY "medical_histories"."id";--> statement-breakpoint
ALTER TABLE "medical_histories" ALTER COLUMN "id" SET DEFAULT nextval('medical_histories_id_seq');--> statement-breakpoint
SELECT setval('medical_histories_id_seq', GREATEST(COALESCE((SELECT MAX("id") FROM "medical_histories"), 1), 1));--> statement-breakpoint
CREATE TEMP TABLE "auth_id_migration_map" (
 "old_id" text PRIMARY KEY,
 "new_id" uuid NOT NULL
) ON COMMIT DROP;--> statement-breakpoint
INSERT INTO "auth_id_migration_map" ("old_id", "new_id")
SELECT
 "supabase_id"::text,
 CASE
  WHEN "supabase_id"::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
   THEN "supabase_id"::text::uuid
  ELSE gen_random_uuid()
 END
FROM "users";--> statement-breakpoint
DO $$
DECLARE
 reference_column record;
BEGIN
 FOR reference_column IN
  SELECT * FROM (VALUES
   ('admissions', 'created_by'),
   ('appointments', 'doctor_id'),
   ('appointments', 'created_by'),
   ('encounters', 'doctor_id'),
   ('encounters', 'created_by'),
   ('medical_histories', 'created_by'),
   ('notifications', 'user_id'),
   ('patients', 'created_by'),
   ('queue', 'doctor_id'),
   ('queue', 'created_by'),
   ('vitals', 'created_by')
  ) AS columns_to_update(table_name, column_name)
 LOOP
  IF EXISTS (
   SELECT 1
   FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name = reference_column.table_name
     AND column_name = reference_column.column_name
     AND data_type IN ('character varying', 'text')
  ) THEN
   EXECUTE format(
    'UPDATE %I target SET %I = mapping.new_id::text FROM auth_id_migration_map mapping WHERE target.%I = mapping.old_id',
    reference_column.table_name,
    reference_column.column_name,
    reference_column.column_name
   );
  END IF;
 END LOOP;
 IF EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'supabase_id'
    AND data_type IN ('character varying', 'text')
 ) THEN
  EXECUTE 'UPDATE users target SET supabase_id = mapping.new_id::text FROM auth_id_migration_map mapping WHERE target.supabase_id = mapping.old_id';
 ELSE
  UPDATE "users" target
  SET "supabase_id" = mapping."new_id"
  FROM "auth_id_migration_map" mapping
  WHERE target."supabase_id"::text = mapping."old_id";
 END IF;
END $$;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "supabase_id" TYPE uuid USING "supabase_id"::uuid;--> statement-breakpoint
ALTER TABLE "admissions" ALTER COLUMN "created_by" TYPE uuid USING "created_by"::uuid;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "doctor_id" TYPE uuid USING "doctor_id"::uuid;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "created_by" TYPE uuid USING "created_by"::uuid;--> statement-breakpoint
ALTER TABLE "encounters" ALTER COLUMN "doctor_id" TYPE uuid USING "doctor_id"::uuid;--> statement-breakpoint
ALTER TABLE "encounters" ALTER COLUMN "created_by" TYPE uuid USING "created_by"::uuid;--> statement-breakpoint
ALTER TABLE "medical_histories" ALTER COLUMN "created_by" TYPE uuid USING "created_by"::uuid;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "user_id" TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "created_by" TYPE uuid USING "created_by"::uuid;--> statement-breakpoint
ALTER TABLE "queue" ALTER COLUMN "doctor_id" TYPE uuid USING "doctor_id"::uuid;--> statement-breakpoint
ALTER TABLE "queue" ALTER COLUMN "created_by" TYPE uuid USING "created_by"::uuid;--> statement-breakpoint
ALTER TABLE "vitals" ALTER COLUMN "created_by" TYPE uuid USING "created_by"::uuid;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'role_permissions' AND column_name = 'role' AND data_type <> 'USER-DEFINED'
 ) THEN
  UPDATE "role_permissions"
  SET "role" = 'admin'
  WHERE lower("role") NOT IN ('owner', 'admin', 'attendant', 'doctor');
  ALTER TABLE "role_permissions"
   ALTER COLUMN "role" TYPE "organization_role" USING lower("role")::"organization_role";
 END IF;
END $$;
--> statement-breakpoint
INSERT INTO "organizations" ("id", "name", "invite_code")
SELECT
 '00000000-0000-4000-8000-000000000001'::uuid,
 'Legacy ENT Clinic',
 upper(substr(md5(random()::text || clock_timestamp()::text), 1, 20))
WHERE EXISTS (SELECT 1 FROM "users")
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role'
 ) THEN
  EXECUTE $membership$
   WITH ranked_users AS (
    SELECT id, role, row_number() OVER (ORDER BY id) AS position
    FROM users
    WHERE deleted_at IS NULL
   )
   INSERT INTO organization_members (org_id, user_id, role)
   SELECT
    '00000000-0000-4000-8000-000000000001'::uuid,
    id,
    CASE
     WHEN position = 1 THEN 'owner'::organization_role
     WHEN lower(role) IN ('owner', 'admin', 'attendant', 'doctor') THEN lower(role)::organization_role
     ELSE 'attendant'::organization_role
    END
   FROM ranked_users
   ON CONFLICT DO NOTHING
  $membership$;
 ELSE
  INSERT INTO "organization_members" ("org_id", "user_id", "role")
  SELECT
   '00000000-0000-4000-8000-000000000001'::uuid,
   "id",
   CASE WHEN row_number() OVER (ORDER BY "id") = 1 THEN 'owner'::"organization_role" ELSE 'attendant'::"organization_role" END
  FROM "users"
  WHERE "deleted_at" IS NULL
  ON CONFLICT DO NOTHING;
 END IF;
END $$;
--> statement-breakpoint
UPDATE "users"
SET "active_org_id" = '00000000-0000-4000-8000-000000000001'::uuid
WHERE "active_org_id" IS NULL
  AND EXISTS (SELECT 1 FROM "organizations" WHERE "id" = '00000000-0000-4000-8000-000000000001'::uuid);--> statement-breakpoint
UPDATE "admissions" SET "org_id" = '00000000-0000-4000-8000-000000000001'::uuid WHERE "org_id" IS NULL;--> statement-breakpoint
UPDATE "appointments" SET "org_id" = '00000000-0000-4000-8000-000000000001'::uuid WHERE "org_id" IS NULL;--> statement-breakpoint
UPDATE "encounters" SET "org_id" = '00000000-0000-4000-8000-000000000001'::uuid WHERE "org_id" IS NULL;--> statement-breakpoint
UPDATE "medical_histories" SET "org_id" = '00000000-0000-4000-8000-000000000001'::uuid WHERE "org_id" IS NULL;--> statement-breakpoint
UPDATE "notifications" SET "org_id" = '00000000-0000-4000-8000-000000000001'::uuid WHERE "org_id" IS NULL;--> statement-breakpoint
UPDATE "patients" SET "org_id" = '00000000-0000-4000-8000-000000000001'::uuid WHERE "org_id" IS NULL;--> statement-breakpoint
UPDATE "queue" SET "org_id" = '00000000-0000-4000-8000-000000000001'::uuid WHERE "org_id" IS NULL;--> statement-breakpoint
UPDATE "vitals" SET "org_id" = '00000000-0000-4000-8000-000000000001'::uuid WHERE "org_id" IS NULL;--> statement-breakpoint
UPDATE "patients"
SET "created_by" = (SELECT "supabase_id" FROM "users" WHERE "deleted_at" IS NULL ORDER BY "id" LIMIT 1)
WHERE "created_by" IS NULL;--> statement-breakpoint
UPDATE "appointments" SET "appointment_date_time" = CURRENT_TIMESTAMP WHERE "appointment_date_time" IS NULL;--> statement-breakpoint
ALTER TABLE "admissions" ALTER COLUMN "org_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "org_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "appointment_date_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "encounters" ALTER COLUMN "org_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_histories" ALTER COLUMN "org_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_histories" ALTER COLUMN "patient_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "org_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "org_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "queue" ALTER COLUMN "org_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vitals" ALTER COLUMN "org_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "permissions";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admissions" ADD CONSTRAINT "admissions_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admissions" ADD CONSTRAINT "admissions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admissions" ADD CONSTRAINT "admissions_admitted_user_id_users_supabase_id_fk" FOREIGN KEY ("admitted_user_id") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admissions" ADD CONSTRAINT "admissions_created_by_users_supabase_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_users_supabase_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_created_by_users_supabase_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "encounters" ADD CONSTRAINT "encounters_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "encounters" ADD CONSTRAINT "encounters_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "encounters" ADD CONSTRAINT "encounters_doctor_id_users_supabase_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "encounters" ADD CONSTRAINT "encounters_created_by_users_supabase_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical_histories" ADD CONSTRAINT "medical_histories_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical_histories" ADD CONSTRAINT "medical_histories_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical_histories" ADD CONSTRAINT "medical_histories_created_by_users_supabase_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_supabase_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_created_by_users_supabase_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queue" ADD CONSTRAINT "queue_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queue" ADD CONSTRAINT "queue_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queue" ADD CONSTRAINT "queue_doctor_id_users_supabase_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queue" ADD CONSTRAINT "queue_created_by_users_supabase_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_permissions_id_fk" FOREIGN KEY ("permissionId") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_active_org_id_organizations_id_fk" FOREIGN KEY ("active_org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vitals" ADD CONSTRAINT "vitals_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vitals" ADD CONSTRAINT "vitals_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vitals" ADD CONSTRAINT "vitals_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vitals" ADD CONSTRAINT "vitals_created_by_users_supabase_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("supabase_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admissions_admitted_user_id_index" ON "admissions" USING btree ("admitted_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admissions_org_id_idx" ON "admissions" USING btree ("org_id","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointments_doctor_id_index" ON "appointments" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointments_org_id_idx" ON "appointments" USING btree ("org_id","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "encounters_patient_id_index" ON "encounters" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "encounters_doctor_id_index" ON "encounters" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "encounters_org_id_idx" ON "encounters" USING btree ("org_id","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medical_histories_org_id_idx" ON "medical_histories" USING btree ("org_id","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "source_idx" ON "notifications" USING btree ("source");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_org_id_idx" ON "notifications" USING btree ("org_id","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organization_members_active_unique" ON "organization_members" USING btree ("org_id","user_id") WHERE "organization_members"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_members_user_id_idx" ON "organization_members" USING btree ("user_id","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_members_org_id_idx" ON "organization_members" USING btree ("org_id","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_invite_code_unique" ON "organizations" USING btree ("invite_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_deleted_at_idx" ON "organizations" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patients_org_id_idx" ON "patients" USING btree ("org_id","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "queue_patient_id_index" ON "queue" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "queue_org_id_idx" ON "queue" USING btree ("org_id","deleted_at");--> statement-breakpoint
WITH duplicate_permissions AS (
 SELECT
  "id",
  row_number() OVER (PARTITION BY "role", "permissionId" ORDER BY "id") AS duplicate_position
 FROM "role_permissions"
 WHERE "deleted_at" IS NULL
)
UPDATE "role_permissions"
SET "deleted_at" = CURRENT_TIMESTAMP
FROM duplicate_permissions
WHERE "role_permissions"."id" = duplicate_permissions."id"
  AND duplicate_permissions.duplicate_position > 1;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "role_permissions_role_permission_unique" ON "role_permissions" USING btree ("role","permissionId") WHERE "role_permissions"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_supabase_id_unique" ON "users" USING btree ("supabase_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_active_org_id_idx" ON "users" USING btree ("active_org_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_idx" ON "vitals" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "encounter_idx" ON "vitals" USING btree ("encounter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "vitals" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vitals_org_id_idx" ON "vitals" USING btree ("org_id","deleted_at");
--> statement-breakpoint
INSERT INTO "role_permissions" ("role", "permissionId")
SELECT roles.role, permissions.id
FROM (VALUES ('owner'::"organization_role"), ('admin'::"organization_role")) AS roles(role)
CROSS JOIN "permissions"
WHERE "permissions"."deleted_at" IS NULL
ON CONFLICT ("role", "permissionId") WHERE "deleted_at" IS NULL DO NOTHING;
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "private";
--> statement-breakpoint
CREATE OR REPLACE FUNCTION "private"."is_org_member"(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
 SELECT EXISTS (
  SELECT 1
  FROM public.organization_members membership
  INNER JOIN public.users application_user ON application_user.id = membership.user_id
  INNER JOIN public.organizations organization ON organization.id = membership.org_id
  WHERE membership.org_id = target_org_id
    AND application_user.supabase_id = (SELECT auth.uid())
    AND membership.deleted_at IS NULL
    AND application_user.deleted_at IS NULL
    AND organization.deleted_at IS NULL
 );
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION "private"."shares_org_with_user"(target_user_id integer)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
 SELECT EXISTS (
  SELECT 1
  FROM public.organization_members target_membership
  INNER JOIN public.organization_members caller_membership
   ON caller_membership.org_id = target_membership.org_id
  INNER JOIN public.users caller
   ON caller.id = caller_membership.user_id
  WHERE target_membership.user_id = target_user_id
    AND caller.supabase_id = (SELECT auth.uid())
    AND target_membership.deleted_at IS NULL
    AND caller_membership.deleted_at IS NULL
    AND caller.deleted_at IS NULL
 );
$$;
--> statement-breakpoint
REVOKE ALL ON SCHEMA "private" FROM PUBLIC;
--> statement-breakpoint
GRANT USAGE ON SCHEMA "private" TO authenticated;
--> statement-breakpoint
REVOKE ALL ON FUNCTION "private"."is_org_member"(uuid) FROM PUBLIC;
--> statement-breakpoint
REVOKE ALL ON FUNCTION "private"."shares_org_with_user"(integer) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."is_org_member"(uuid) TO authenticated;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."shares_org_with_user"(integer) TO authenticated;
--> statement-breakpoint
DROP POLICY IF EXISTS "members_can_view_organizations" ON "organizations";
--> statement-breakpoint
CREATE POLICY "members_can_view_organizations"
ON "organizations" FOR SELECT TO authenticated
USING ((SELECT private.is_org_member(id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "members_can_view_memberships" ON "organization_members";
--> statement-breakpoint
CREATE POLICY "members_can_view_memberships"
ON "organization_members" FOR SELECT TO authenticated
USING ((SELECT private.is_org_member(org_id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "users_can_view_organization_colleagues" ON "users";
--> statement-breakpoint
CREATE POLICY "users_can_view_organization_colleagues"
ON "users" FOR SELECT TO authenticated
USING (
 (SELECT auth.uid()) = supabase_id
 OR (SELECT private.shares_org_with_user(id))
);
--> statement-breakpoint
DROP POLICY IF EXISTS "users_can_update_own_profile" ON "users";
--> statement-breakpoint
CREATE POLICY "users_can_update_own_profile"
ON "users" FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = supabase_id)
WITH CHECK ((SELECT auth.uid()) = supabase_id);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_can_view_permissions" ON "permissions";
--> statement-breakpoint
CREATE POLICY "authenticated_can_view_permissions"
ON "permissions" FOR SELECT TO authenticated
USING (deleted_at IS NULL);
--> statement-breakpoint
DROP POLICY IF EXISTS "authenticated_can_view_role_permissions" ON "role_permissions";
--> statement-breakpoint
CREATE POLICY "authenticated_can_view_role_permissions"
ON "role_permissions" FOR SELECT TO authenticated
USING (deleted_at IS NULL);
--> statement-breakpoint
DROP POLICY IF EXISTS "tenant_member_access" ON "patients";
--> statement-breakpoint
CREATE POLICY "tenant_member_access"
ON "patients" FOR ALL TO authenticated
USING ((SELECT private.is_org_member(org_id)))
WITH CHECK ((SELECT private.is_org_member(org_id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "tenant_member_access" ON "encounters";
--> statement-breakpoint
CREATE POLICY "tenant_member_access"
ON "encounters" FOR ALL TO authenticated
USING ((SELECT private.is_org_member(org_id)))
WITH CHECK ((SELECT private.is_org_member(org_id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "tenant_member_access" ON "queue";
--> statement-breakpoint
CREATE POLICY "tenant_member_access"
ON "queue" FOR ALL TO authenticated
USING ((SELECT private.is_org_member(org_id)))
WITH CHECK ((SELECT private.is_org_member(org_id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "tenant_member_access" ON "vitals";
--> statement-breakpoint
CREATE POLICY "tenant_member_access"
ON "vitals" FOR ALL TO authenticated
USING ((SELECT private.is_org_member(org_id)))
WITH CHECK ((SELECT private.is_org_member(org_id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "tenant_member_access" ON "appointments";
--> statement-breakpoint
CREATE POLICY "tenant_member_access"
ON "appointments" FOR ALL TO authenticated
USING ((SELECT private.is_org_member(org_id)))
WITH CHECK ((SELECT private.is_org_member(org_id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "tenant_member_access" ON "admissions";
--> statement-breakpoint
CREATE POLICY "tenant_member_access"
ON "admissions" FOR ALL TO authenticated
USING ((SELECT private.is_org_member(org_id)))
WITH CHECK ((SELECT private.is_org_member(org_id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "tenant_member_access" ON "medical_histories";
--> statement-breakpoint
CREATE POLICY "tenant_member_access"
ON "medical_histories" FOR ALL TO authenticated
USING ((SELECT private.is_org_member(org_id)))
WITH CHECK ((SELECT private.is_org_member(org_id)));
--> statement-breakpoint
DROP POLICY IF EXISTS "tenant_member_access" ON "notifications";
--> statement-breakpoint
CREATE POLICY "tenant_member_access"
ON "notifications" FOR ALL TO authenticated
USING ((SELECT private.is_org_member(org_id)))
WITH CHECK ((SELECT private.is_org_member(org_id)));
