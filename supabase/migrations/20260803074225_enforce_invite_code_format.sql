DO $$
DECLARE
	organization_record record;
	candidate_code text;
BEGIN
	FOR organization_record IN
		SELECT id FROM organizations WHERE invite_code !~ '^ENT[A-Z0-9]{4}$'
	LOOP
		LOOP
			candidate_code := 'ENT' || upper(substr(md5(random()::text || clock_timestamp()::text || organization_record.id::text), 1, 4));
			EXIT WHEN NOT EXISTS (SELECT 1 FROM organizations WHERE invite_code = candidate_code);
		END LOOP;

		UPDATE organizations SET invite_code = candidate_code, updated_at = now() WHERE id = organization_record.id;
	END LOOP;
END $$;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_invite_code_format_check" CHECK ("organizations"."invite_code" ~ '^ENT[A-Z0-9]{4}$');
