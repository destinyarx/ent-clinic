# Project Overview

## Purpose and audience

ENTCare is a multi-tenant electronic medical record system for small to mid-sized ENT outpatient clinics. Each organization represents one clinic, and clinical records are isolated by organization membership. There is no patient portal, billing workflow, or completed admission workflow.

The README describes future ENT-specific records, reporting, billing, and patient self-registration. Those claims should be treated as product direction, not implemented behavior.

## Users and roles

| Role | Evidence | Current capabilities | Enforcement status |
| --- | --- | --- | --- |
| Owner | `organization_members`, permission seed | Own a clinic; currently receives the same permissions as admin | Membership and tenant access enforced; detailed action permissions remain server work |
| Admin | `organization_members`, permission seed | Administer clinic workflows | Membership and tenant access enforced; detailed action permissions remain server work |
| Doctor | `organization_members`, queue assignment UI | View assigned encounters, complete visits, and record vitals | Membership and tenant access enforced |
| Attendant | `organization_members`, permission seed | Manage patients, appointments, vitals, and queue | Membership and tenant access enforced |
| Unauthenticated visitor | Public route list in `middleware/auth.global.ts` | Landing, Google/Facebook or password login/signup, email confirmation, contact | Implemented |
| Pending user | `organization_join_requests`, `/auth/pending` | Wait for an owner/admin decision; automatically recheck request status | Enforced by route middleware and server state |

Roles belong to `organization_members`, not `users`. The permission seed defines `viewAllPatient`, `managePatientInfo`, `manageAppointments`, `manageVitals`, `manageQueue`, and `manageDiagnosis`. Tenant membership is enforced server-side and through RLS; endpoint-specific permission checks remain incomplete.

## Feature inventory

| Feature | Main users | Routes/modules | Data | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Landing page | Visitor | `/`, `pages/index.vue`, `layouts/guestLayout.vue` | Static assets | Complete | Desktop-first hero with public navigation |
| Contact page | Visitor | `/contact-us`, `pages/contact-us.vue` | Static | Complete | External LinkedIn link |
| Organizations | Staff | Authenticated layout, `/api/organizations`, `/clinic-requests` | `organizations`, `organization_members`, `organization_join_requests`, `users.active_org_id` | Complete foundation | One clinic per user; owners/admins manage requests and `ENTXXXX` invite codes |
| Login/logout | Staff | `/auth/login`, `/auth/callback`, `layouts/authenticatedLayout.vue` | Supabase Auth, `users`, `role_permissions`, `permissions` | Implemented | Password, Google, and Facebook login; password recovery remains absent |
| Signup and onboarding | Visitor/new user | `/auth/signup`, `/auth/check-email`, `/auth/onboarding`, `/auth/pending` | Supabase Auth, `users`, `organizations`, `organization_members`, `organization_join_requests` | Implemented | Owner creates a clinic; doctor/attendant submits one pending join request |
| Dashboard | Staff | `/new-dashboard`, `pages/new-dashboard.vue` | Hardcoded arrays and metrics | Visual demo | Explicitly labels chart as hardcoded |
| Patient registry | Attendant/staff | `/all-patients`, `pages/all-patients.vue`, `PatientForm.vue` | `patients` | Partial | Add/update/soft-delete/search/pagination; tenant membership enforced, runtime input schema still absent |
| Queue intake | Attendant/staff | `/all-patients`, `QueueForm.vue`, `/Queue`, `QueueDT.vue` | `queue`, `patients` | Partial | Add/remove/accept; update action unfinished; non-atomic state changes |
| Doctor encounter list | Doctor | `/Patients`, `pages/Patients.vue`, `PendingPatientsDT.vue` | `encounters`, `patients`, `users` | Partial | Pending, accept/reject, in-progress, complete; pagination and route-ID defects |
| Patient chart shell | Staff | `/patient/:id`, `pages/patient/[id]/index.vue`, `PatientNavbar.vue`, `PatientTabs.vue` | `patients`, `encounters` | Partial | Current encounter selection is ambiguous |
| Vital signs | Staff | Patient chart, `Vitals.vue`, `VitalSignForm.vue`, `VitalSignsDT.vue` | `vitals` | Partial | CRUD exists; query fails to scope by patient; validation is a stub |
| Diagnosis | Doctor | Patient chart, `Diagnosis.vue`, `DiagnosisDT.vue` | No active schema/query/endpoint | Placeholder | Add and fetch handlers are empty |
| Medication | Doctor | Patient chart, `Medications.vue`, `MedicationDT.vue` | No active schema/query/endpoint | Placeholder | Add and fetch handlers are empty |
| Medical history | Staff | Patient chart and `/patient/:id/medical-history` | `medical_histories` schema only | Broken placeholder | The chart's medical-history module renders `MedicationDT` |
| Encounter history | Staff | Patient chart, `EncounterHistory.vue` | `encounters`, `users` | Partial | Read-only history; pagination offset is wrong; contains hardcoded remarks text |
| Profile | Staff | `/profile`, `pages/profile.vue`, `UserProfileForm.vue` | `users` | Partial | Server derives the target identity; role belongs to membership and is not profile-editable |
| Schedule | Staff | `/schedule`, `/schedule/:id` | `appointments` schema only | Placeholder | Missing named middleware on detail route |
| Accounts/users/reporting | Unknown | `/accounts`, `/users`, `/Summary` | None | Placeholder | `/users` references missing named middleware |
| Webhook | External integration | `POST /api/webhook` | Logs request body | Placeholder / unsafe | No signature verification or event handling |

## Confirmed business workflows

### Authentication and profile load

```text
User authenticates with password, Google, or Facebook
→ Supabase Auth stores/restores the session in SSR-compatible cookies
→ middleware/auth.global.ts requests the server-derived onboarding state
→ a user without membership enters clinic onboarding
→ a pending user is restricted to the waiting page
→ an approved member loads role and permissions from the organization membership
→ the router sends the member to /new-dashboard
```

The global route middleware repeats profile loading when a Supabase user exists but the Pinia profile does not. Clinical endpoints independently verify the session and active membership; they do not trust the persisted client profile.

### Clinic onboarding and join approval

```text
Authenticated user without membership
→ create clinic as owner OR submit doctor/attendant request with ENTXXXX code
→ owner creation atomically creates organization, owner membership, and active organization
→ staff request remains outside organization_members while pending
→ owner/admin approves or rejects on /clinic-requests
→ approval atomically creates the sole membership and active organization
→ rejection returns the applicant to onboarding
```

Invite codes are generated and regenerated server-side. A user may have only one active membership and one pending request. Clinic names do not need to be globally unique.

### Patient registration and maintenance

```text
Staff opens the patient dialog
→ PatientForm mutates the parent form object
→ POST /api/patient/details/add or PUT /api/patient/details/update
→ Nitro handler maps the body without schema validation
→ src/db/queries/patients.ts inserts or updates through Drizzle
→ page closes the dialog and refreshes the patient list
```

Delete is a soft delete (`deleted_at = NOW()`). There is no confirmation in `pages/all-patients.vue` before the delete request.

### Add patient to queue

```text
Staff selects visit type, category, and doctor
→ QueueForm POSTs /api/patient/queue/add
→ queue row is inserted
→ QueueForm separately PUTs patient status = in_queue
→ the page refreshes
```

These writes are not transactional. The queue endpoint now maps the form's reason field to the database `remarks` column.

### Accept queue entry and start a visit

```text
Staff accepts a queue entry
→ POST /api/patient/encounter/add creates an open encounter
→ PUT /api/patient/queue/delete soft-deletes the queue row
→ PUT /api/patient/details/update-patient-status sets patient status = open
→ assigned doctor views the pending encounter
→ POST /api/patient/encounter/update-status sets patient and encounter to in_progress
```

The first transition spans three requests; the second performs separate database writes without a transaction. Partial failure can leave the queue, patient, and encounter out of sync.

### Record vital signs

```text
Staff opens the vitals tab
→ VitalSignsDT GETs /api/patient/vitals/get
→ handler calls getVitals(patientId, encounterId, type, offset, limit)
→ query joins vitals, patients, and users
→ add/update/delete use separate Nitro endpoints
→ the table refreshes after the mutation
```

The query applies both `patientId` and the active `org_id`.

### Complete a visit

```text
Doctor confirms completion
→ POST /api/patient/encounter/finish-visit
→ one Drizzle transaction clears patient status and encounterId
→ the same transaction sets encounter status = completed and timestamps its end
→ the in-progress list refreshes
```

Encounter status changes and visit completion update the patient and encounter atomically.

## Explicitly absent or unverified

- Password recovery and MFA are absent. Email confirmation UI, Google/Facebook OAuth, clinic onboarding, pending requests, and approval are implemented.
- No billing, prescriptions, file upload, Supabase Storage, realtime subscription, RPC, Edge Function, background job, or notification delivery implementation was found.
- Tenant RLS policies are defined in the organization migration; deployment target and production behavior still require environment-specific verification.
