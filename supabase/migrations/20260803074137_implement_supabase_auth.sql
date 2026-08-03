CREATE TYPE "public"."organization_join_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_join_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" integer NOT NULL,
	"requested_role" "organization_role" NOT NULL,
	"status" "organization_join_request_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "organization_join_requests_staff_role_check" CHECK ("organization_join_requests"."requested_role" in ('doctor', 'attendant'))
);
--> statement-breakpoint
ALTER TABLE "organization_join_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP INDEX IF EXISTS "organization_members_active_unique";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_join_requests" ADD CONSTRAINT "organization_join_requests_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_join_requests" ADD CONSTRAINT "organization_join_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_join_requests" ADD CONSTRAINT "organization_join_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organization_join_requests_pending_user_unique" ON "organization_join_requests" USING btree ("user_id") WHERE "organization_join_requests"."status" = 'pending' and "organization_join_requests"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_join_requests_org_status_idx" ON "organization_join_requests" USING btree ("org_id","status","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_join_requests_user_idx" ON "organization_join_requests" USING btree ("user_id","created_at");--> statement-breakpoint
WITH ranked_memberships AS (
	SELECT
		membership.id,
		row_number() OVER (
			PARTITION BY membership.user_id
			ORDER BY
				(membership.org_id = application_user.active_org_id) DESC,
				membership.created_at ASC,
				membership.id ASC
		) AS membership_rank
	FROM organization_members membership
	INNER JOIN users application_user ON application_user.id = membership.user_id
	WHERE membership.deleted_at IS NULL
)
UPDATE organization_members membership
SET deleted_at = now(), updated_at = now()
FROM ranked_memberships ranked
WHERE membership.id = ranked.id AND ranked.membership_rank > 1;--> statement-breakpoint
WITH retained_memberships AS (
	SELECT DISTINCT ON (membership.user_id)
		membership.user_id,
		membership.org_id
	FROM organization_members membership
	WHERE membership.deleted_at IS NULL
	ORDER BY membership.user_id, membership.created_at ASC, membership.id ASC
)
UPDATE users application_user
SET active_org_id = retained.org_id, updated_at = now()
FROM retained_memberships retained
WHERE application_user.id = retained.user_id
	AND application_user.active_org_id IS DISTINCT FROM retained.org_id;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organization_members_active_user_unique" ON "organization_members" USING btree ("user_id") WHERE "organization_members"."deleted_at" is null;
