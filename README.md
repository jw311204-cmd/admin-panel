# To The Top Now — Admin Panel

Next.js admin UI for **promo codes / influencers**, **referral links**, **revenue events**, and related operations. It talks to **`backend-api`** only (no direct DB access from the browser).

## Requirements

- Node.js 18+
- Running **`backend-api`** with migrations applied and CORS allowing this app’s origin

## Setup

1. **Environment**

   ```bash
   cp .env.example .env.local
   ```

   Set:

   - **`NEXT_PUBLIC_API_URL`** — API base URL (no trailing slash), e.g. `https://your-api.onrender.com` or `http://localhost:3001`

2. **First admin user** (run from **`backend-api`** on a machine that can reach the DB):

   ```bash
   cd ../backend-api
   ADMIN_SEED_EMAIL=you@company.com ADMIN_SEED_PASSWORD='secure-password' npm run seed:admin
   ```

3. **Install & run**

   ```bash
   npm install
   npm run dev
   ```

   Open the URL shown (usually `http://localhost:3000`).

## Deploy (e.g. Vercel)

- Connect the repo / subdirectory `admin-panel`
- Set **`NEXT_PUBLIC_API_URL`** to production **`backend-api`**
- Ensure production API **CORS** includes the Vercel domain

## Backend expectations

- Admin auth uses **`backend-api`** admin routes + JWT (`ADMIN_JWT_SECRET` / shared secret as documented in API)
- Migrations must include admin tables; use **`npm run seed:admin`** (or reset scripts) from `backend-api` as needed

## Project layout

- `app/` — Next.js App Router pages
- `lib/` — API client helpers, auth storage
- Public env vars must be prefixed with **`NEXT_PUBLIC_`**
