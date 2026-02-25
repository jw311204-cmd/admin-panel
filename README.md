# To The Top Now — Admin Panel

Minimal admin panel for influencer/promo/revenue management.

## Setup

1. Copy env:
   ```bash
   cp .env.example .env.local
   ```

2. Set `NEXT_PUBLIC_API_URL` to your backend (e.g. `https://everest-backend-qquj.onrender.com`)

3. Create first admin (run on backend server):
   ```bash
   ADMIN_SEED_EMAIL=admin@example.com ADMIN_SEED_PASSWORD=yourpassword node scripts/seed-admin.js
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

5. Deploy to Vercel — connect repo, set `NEXT_PUBLIC_API_URL`, deploy.

## Backend requirements

- Backend must have CORS allowed for admin panel origin (or `*` in dev)
- `JWT_SECRET` or `ADMIN_JWT_SECRET` must be set
- Run migrations (includes `admins` table)
- Seed first admin via `scripts/seed-admin.js`
