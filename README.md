# Wollnut Labs — AI GPU Cloud Platform

> Enterprise GPU cloud built on E2E Networks. Deploy H100, H200, and B200 GPUs on-demand.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in your credentials
cp .env.example .env.local
# Edit .env.local with your E2E Networks, Stripe, and database credentials

# 3. Start PostgreSQL and Redis (Docker example)
docker run -d --name wollnut-db -p 5432:5432 \
  -e POSTGRES_USER=wollnut -e POSTGRES_PASSWORD=wollnut \
  -e POSTGRES_DB=wollnut_dev postgres:16

docker run -d --name wollnut-redis -p 6379:6379 redis:7-alpine

# 4. Run database migrations and seed
npx prisma migrate dev --name init
npm run db:seed

# 5. Start development server
npm run dev

# 6. (Optional) Start background worker for billing/status jobs
npm run worker
```

## Architecture

```
User → Wollnut Labs (Next.js) → E2E Networks API
                ↓
        PostgreSQL (state)
        Redis (job queues)
        Stripe (payments)
```

Wollnut Labs acts as a reseller/abstraction layer on top of E2E Networks:
- Users see Wollnut pricing (with markup), not E2E pricing
- All GPU provisioning goes through E2E Networks API
- Billing is handled via Wollnut credits (Stripe-funded wallet)
- Per-minute billing with auto-stop on zero credits

## E2E Networks Setup

1. Create an account at [e2enetworks.com](https://e2enetworks.com)
2. Generate a Personal Access Token from the API section
3. Note your Project ID and Contact Person ID
4. Add these to `.env.local`:
   ```
   E2E_API_TOKEN=your_token_here
   E2E_PROJECT_ID=your_project_id
   E2E_CONTACT_PERSON_ID=your_contact_person_id
   ```

## Project Structure

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for the complete file tree.

Key directories:
- `src/lib/services/e2e-networks.ts` — Single interface to E2E Networks API
- `src/lib/services/` — Business logic services (billing, instances, etc.)
- `src/lib/jobs/` — Background jobs (billing CRON, status sync, etc.)
- `src/app/api/v1/` — REST API routes
- `src/app/dashboard/` — Dashboard pages
- `prisma/` — Database schema and seeds

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes + service layer
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js (Google, GitHub, email/password)
- **Payments**: Stripe (wallet top-up, credits system)
- **Job Queue**: BullMQ + Redis
- **State**: Zustand + TanStack Query

## Build Parts

This project is built in 10 parts:
1. ✅ Project setup, folder structure, DB schema, E2E service layer
2. Auth system, user profile
3. Dashboard, instance management
4. Billing (Stripe, credits, CRON jobs)
5. Templates, Models Hub, Pricing page
6. API docs, Developer page
7. Admin panel
8. Docs site, Blog
9. WebSockets, real-time updates
10. Final polish, SEO, deployment

## License

Proprietary — Wollnut Labs
