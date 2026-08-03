# ADR 002: Authentication and clinic onboarding

## Status

Accepted on 2026-08-03.

## Context

ENTCare needs Google and Facebook OAuth in addition to its existing email/password authentication. A newly authenticated person must either create one ENT clinic as its owner or request access to an existing clinic as a doctor or attendant.

ADR 001 allowed one user to hold memberships in multiple clinics. The product decision for onboarding now limits every user to one approved clinic.

## Decision

- A clinic may have many users, but a user may have at most one active organization membership.
- `organization_members` remains the source of truth for the user's clinic and organization role. A unique active membership constraint on `user_id` enforces the single-clinic rule.
- Google and Facebook are the only OAuth providers. Email/password signup and login remain available.
- Email/password signup requires email confirmation when it is enabled in Supabase. After confirmation and authentication, the user continues to clinic onboarding.
- Signup collects first and last name. There is no application username. OAuth metadata may prefill names but the user can complete or correct them during onboarding.
- A user without a membership chooses one of two onboarding paths:
  - create a clinic and atomically become its owner; or
  - request to join an existing clinic as a doctor or attendant.
- A user may have at most one pending join request. While it is pending, every authenticated navigation redirects to the waiting page.
- Owners and admins review requests on a dedicated clinic-requests page. They approve the requested role without changing it, or reject the request.
- Approval atomically creates the membership, selects it as the user's active organization, and marks the request approved.
- A rejected user returns to onboarding and may submit another request, including a new request to the same clinic.
- Join-request history is retained for audit. Only pending requests restrict onboarding.
- Invite codes are generated server-side, unique, exactly seven uppercase alphanumeric characters, and begin with `ENT` followed by four random characters.
- Owners and admins may view and regenerate their clinic's invite code. Regeneration prevents new submissions with the old code but leaves existing pending requests unchanged.
- The waiting page polls for state changes and also provides a manual refresh action. Approval redirects the user to the dashboard; rejection returns the user to onboarding with an explanation.
- The Supabase publishable key is used for browser OAuth and session handling as intended by Supabase. Database access and any elevated secret or service-role key remain server-only.

## Onboarding states

```text
Unauthenticated
  -> authenticate or confirm email
Authenticated without membership or pending request
  -> create clinic as owner
  -> submit doctor/attendant join request
Pending join request
  -> approved -> organization member -> dashboard
  -> rejected -> onboarding
Organization member
  -> dashboard
```

## Consequences

- The existing many-memberships-per-user schema must gain a unique active membership constraint on `organization_members.user_id`.
- During migration, a user with multiple active memberships keeps the membership matching `users.active_org_id`; if none matches, the oldest membership is kept. Other memberships are soft-deleted and `active_org_id` is aligned with the retained clinic.
- `users.active_org_id` remains a selected-clinic field for compatibility, but the single-clinic rule means it will normally equal the sole approved membership.
- Pending requests must not be inserted into `organization_members`; approval is the boundary that creates membership.
- Route middleware must distinguish unauthenticated, onboarding, pending, rejected, and approved states rather than checking only for a Supabase user.
- Clinic creation, request approval, and request rejection require server-side authorization and transactional writes.
