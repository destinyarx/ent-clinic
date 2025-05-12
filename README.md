# 🩺 Nuxt 3 + Drizzle + Supabase Starter (EMR Project)

This is a full-stack Nuxt 3 project using:

- 🧬 **Nuxt.js** — Frontend framework
- 🌿 **Drizzle ORM** — Type-safe database queries
- 🐘 **Supabase** — PostgreSQL database + Auth
- 🔐 **Supabase Auth** — Email/password user authentication

## ⚡ Features

- Supabase user login with email and password
- Secure, client-based querying with Drizzle
- Role-based access & protected routes (coming soon)
- Scalable Nuxt 3 app with composables and plugins
- Edge Function ready (for future API logic)

---

## 🧱 Tech Stack

| Tool       | Purpose                   |
|------------|----------------------------|
| Nuxt 3     | Frontend Framework         |
| Supabase   | PostgreSQL + Auth + Edge   |
| Drizzle    | Type-safe DB Querying      |
| Vercel/Netlify | Deployment (frontend) |

---

## 🛠️ Installation

### 1. Clone the Repo

```bash
git clone https://github.com/destinyarx/ent-clinic.git
cd your-folder-name
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Supabase
```bash
    1. Go to https://app.supabase.com
    2. Create a new project
    3. Get the following:
        - Project URL
        - Anon public key
```

### 4. Configure Environment Variables
#### <i>Create a .env file in your root:</i>
```bash
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_ANON_KEY=your-anon-key
```

#### <i>Then in your nuxt.config.ts:</i>
```bash
    export default defineNuxtConfig({
        runtimeConfig: {
            public: {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseAnonKey: process.env.SUPABASE_ANON_KEY
            }
        }
    })
```

### 5. Migrate the database
```bash
   npx drizzle-kit push
```

---------------------------------------------------------------------------------------------------------------------------------------------


# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
