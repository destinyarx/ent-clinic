# OAuth setup instructions

ENTCare supports Google and Facebook OAuth through Supabase Auth. Email/password authentication remains enabled. OAuth sessions use the Nuxt Supabase module's SSR cookies; application data and onboarding writes go through authenticated Nuxt server endpoints.

## 1. Environment variables

Create `.env` from `.env.example`:

```dotenv
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=sb_publishable_replace_me
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
NUXT_APP_ORIGIN=http://localhost:3000
```

`SUPABASE_KEY` must be a Supabase **publishable** key (`sb_publishable_...`) or the legacy `anon` key. These low-privilege keys are designed for browser clients and depend on RLS for data protection. Never put a secret key (`sb_secret_...`) or legacy `service_role` key in `SUPABASE_KEY`; those credentials bypass RLS and must remain server-only.

The application does not require a service-role key for OAuth or onboarding. `DATABASE_URL` is server-only and must never be added to Nuxt public runtime configuration.

## 2. Supabase URL configuration

In Supabase Dashboard, open **Authentication > URL Configuration**:

1. Set **Site URL** to the deployed application origin. For local development use `http://localhost:3000`.
2. Add `http://localhost:3000/auth/callback` to **Redirect URLs**.
3. Add the production callback, for example `https://clinic.example.com/auth/callback`.
4. Add separate explicit callbacks for staging or preview environments that need OAuth. Avoid broad production wildcards where possible.

The callback configured at Google or Facebook is different: those providers redirect to Supabase first at:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

Copy the exact provider callback shown in **Authentication > Providers** in Supabase Dashboard.

## 3. Google provider

1. In Google Auth Platform, create or select a project.
2. Configure Branding, Audience, and Data Access. Supabase requires `openid`, email, and profile scopes.
3. Create a **Web application** OAuth client.
4. Add the application origins, such as `http://localhost:3000` and the production HTTPS origin, under **Authorized JavaScript origins**.
5. Add the Supabase callback URL under **Authorized redirect URIs**:

   ```text
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

6. In Supabase Dashboard, open **Authentication > Providers > Google**, enable it, and enter the Google client ID and client secret.
7. Keep the Google client secret in the provider configuration. Do not add it to the Nuxt client environment.

Official reference: [Supabase Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google).

## 4. Facebook provider

1. Create a Facebook app in Meta for Developers and add the Facebook Login authentication use case.
2. Under Facebook Login settings, add the exact Supabase callback as a **Valid OAuth Redirect URI**:

   ```text
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

3. Ensure both `public_profile` and `email` permissions are ready for testing. Supabase requires the email permission for a complete identity.
4. Copy the App ID and App Secret.
5. In Supabase Dashboard, open **Authentication > Providers > Facebook**, enable it, and enter those credentials.
6. Add test users while the Facebook app is in development mode. Complete Meta's required app details/review and switch it live before production use.
7. Keep the Facebook App Secret in Meta/Supabase provider configuration. Do not add it to the Nuxt client environment.

Official reference: [Supabase Login with Facebook](https://supabase.com/docs/guides/auth/social-login/auth-facebook).

## 5. Email confirmation

Keep **Confirm email** enabled in Supabase if email ownership must be verified. Password signup sends users to `/auth/check-email`; the confirmation then returns to `/auth/callback` and continues onboarding.

If a customized confirmation template ignores the redirect passed by the application, update it to use `{{ .RedirectTo }}` as described in [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## 6. Database and local verification

Apply the checked-in Drizzle migrations:

```bash
npm run db:migrate
```

Then run:

```bash
npm test
npm run dev
```

Verify these flows in both local and production configurations:

- Google and Facebook login return to `/auth/callback`.
- Password signup requires email confirmation and reaches onboarding afterward.
- An owner can create one clinic and receives an `ENTXXXX` invite code.
- A doctor or attendant can submit one request with a valid code.
- Pending users remain on `/auth/pending` until an owner/admin approves or rejects them.
- Owners/admins can review requests and regenerate the invite code on `/clinic-requests`.

## Security notes

- The browser uses only the low-privilege publishable/anon key required by Supabase Auth.
- All onboarding, approval, and invite-code mutations run in `/server` and derive the authenticated identity from the Supabase session cookie.
- The browser never supplies a trusted user ID or organization ID for onboarding decisions.
- Owner/admin checks are repeated by the server; hiding the UI link is not authorization.
- Clinical data remains protected by organization-scoped server queries and PostgreSQL RLS.
