# 🩺 ENTCare — An EMR System for ENT Clinics

![VS Code](https://img.shields.io/badge/built%20with-VS%20Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)
![Medical](https://img.shields.io/badge/focus-ENT%20Clinic%20EMR-lightblue?style=flat-square&logo=medrt)

### 🧠 Overview

**ENTCare** is a specialized Electronic Medical Record (EMR) system tailored for **Ear, Nose, and Throat (ENT)** clinics. Built with a focus on simplicity, security, and speed, it helps clinicians manage patient data, streamline consultations, and ensure continuity of care — all in one modern interface.

---

### 🏥 What It Does

- 📋 Organizes patient visits by type (appointment, emergency, surgical case, etc.)
- 🦻 Focused modules for ENT cases: hearing assessments, throat exams, sinus records
- 📅 Tracks appointments, follow-ups, and referrals efficiently
- 👨‍⚕️ Built to support real clinical workflows in small to mid-size ENT practices
- 🔐 Includes secure login for medical personnel using Supabase Auth

---

### 💡 Why ENTCare?

Most generic EMR systems are bloated with unnecessary features. **ENTCare** was designed to be:

- ✅ Fast & intuitive
- ✅ Optimized for ENT workflows
- ✅ Privacy-focused
- ✅ Easy to deploy and maintain

---

### 🚑 Who Is It For?

This system is ideal for:

- ENT specialists in private practice
- Small ENT clinics looking to digitize records
- Medical students or interns building EMR prototypes
- Clinics in resource-limited settings needing a lightweight solution

---

### 📌 Status

ENTCare is currently under active development and will soon support advanced reporting, billing integration, and patient self-registration.

---




### Nuxt 3 + Drizzle + Supabase Starter (Project Tech Stack)

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

---


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
