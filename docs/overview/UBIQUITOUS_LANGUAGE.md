# Ubiquitous Language

| Term | Canonical meaning |
| --- | --- |
| Organization | One ENT clinic and the tenant boundary for clinical data. |
| Member | A user with an approved, non-deleted `organization_members` record. A user may be a member of at most one clinic. |
| Membership | The approved relationship between one user and one organization, including the user's role in that organization. A clinic has many memberships, but a user has at most one active membership. |
| Active organization | The organization currently selected for the user's clinical work. It is a preference and must always be validated against membership. |
| Organization role | One of `owner`, `admin`, `attendant`, or `doctor`, stored on a membership. |
| Owner | The member who created or owns a clinic. Owner currently receives the same permissions as admin. |
| Admin | A clinic member allowed to administer clinic workflows and, in the future, approve join requests. |
| Invite code | A server-generated, unique seven-character uppercase alphanumeric clinic code beginning with `ENT`. It identifies a clinic for a join request but never grants membership directly. |
| Join request | A request to join one clinic as a doctor or attendant. Approval creates the membership; rejection returns the user to onboarding. A user may have only one pending request. |
| Pending user | An authenticated user with an unresolved join request and no approved membership. The user is restricted to the waiting experience until approval or rejection. |
| Tenant-owned record | A clinical record with a required `org_id` whose access is restricted to active organization members. |
| Global record | Identity or permission-catalog data that is not owned by one organization. |
| Legacy ENT Clinic | The organization created during migration to retain ownership of pre-multi-tenant records. |
