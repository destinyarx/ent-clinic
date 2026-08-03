# ADR 001: Multi-tenant organization boundary

## Status

Accepted on 2026-08-03.

The decision that a user may belong to multiple clinics is superseded by ADR 002. The organization boundary, membership-owned roles, and tenant-isolation decisions remain accepted.

## Context

ENTCare previously stored all clinical records in one shared namespace. The next authentication task will provision users through Supabase OAuth and must support clinic owners as well as staff joining an existing clinic.

The domain interview established that a user may work in more than one clinic. A role can therefore differ between clinics and cannot remain a property of the global user profile.

## Decision

- `organizations` represents ENT clinics.
- `organization_members` is the source of truth for approved membership and organization-specific roles.
- Supported membership roles are `owner`, `admin`, `attendant`, and `doctor`.
- `users.active_org_id` is a nullable preference, not proof of membership.
- Clinical tables require `org_id` and are isolated by server-side membership checks and PostgreSQL RLS.
- `users`, `organizations`, `permissions`, and `role_permissions` are global tables.
- Join requests are deferred to the authentication and onboarding task. Only approved users belong in `organization_members`.
- Existing records are assigned to one generated legacy clinic during migration, with the first existing user becoming its owner.

## Consequences

- Every clinical request resolves a verified Supabase user, active organization, and active membership before querying data.
- Roles and permissions are resolved from the active membership.
- Switching clinics changes `users.active_org_id` only after membership validation.
- OAuth onboarding can create an organization and owner membership or create a pending join request without changing the tenant model.
- Tenant-owned tables must include `org_id` in new indexes, queries, mutations, and RLS policies.
