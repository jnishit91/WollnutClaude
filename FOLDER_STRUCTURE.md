# Wollnut Labs — Complete Folder Structure

```
wollnut-labs/
├── prisma/
│   ├── schema.prisma                    # Full DB schema
│   └── seed/
│       ├── index.ts                     # Main seed runner
│       ├── gpu-plans.ts                 # GPU plan seed data
│       ├── templates.ts                 # Template seed data
│       └── models.ts                    # AI model seed data
│
├── public/
│   ├── images/
│   │   ├── gpus/                        # GPU card images (h100.webp, etc.)
│   │   ├── templates/                   # Template icons
│   │   └── models/                      # Model provider logos
│   ├── icons/                           # Favicon, app icons
│   └── fonts/                           # Self-hosted fonts
│
├── scripts/
│   ├── sync-e2e-plans.ts                # CLI script to sync GPU plans from E2E
│   └── generate-invoice.ts              # Invoice PDF generation
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout (fonts, providers)
│   │   ├── page.tsx                     # Landing page (existing design)
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   ├── signup/route.ts
│   │   │   │   ├── signin/route.ts
│   │   │   │   ├── forgot-password/route.ts
│   │   │   │   ├── reset-password/route.ts
│   │   │   │   └── session/route.ts
│   │   │   │
│   │   │   └── v1/
│   │   │       ├── instances/
│   │   │       │   ├── route.ts                # POST create, GET list
│   │   │       │   └── [id]/
│   │   │       │       ├── route.ts            # GET detail, DELETE destroy
│   │   │       │       ├── start/route.ts
│   │   │       │       ├── stop/route.ts
│   │   │       │       ├── reboot/route.ts
│   │   │       │       └── logs/route.ts
│   │   │       │
│   │   │       ├── plans/route.ts
│   │   │       │
│   │   │       ├── templates/
│   │   │       │   ├── route.ts
│   │   │       │   └── [slug]/route.ts
│   │   │       │
│   │   │       ├── models/
│   │   │       │   ├── route.ts
│   │   │       │   └── [slug]/route.ts
│   │   │       │
│   │   │       ├── ssh-keys/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       │
│   │   │       ├── volumes/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       ├── route.ts
│   │   │       │       ├── attach/route.ts
│   │   │       │       └── detach/route.ts
│   │   │       │
│   │   │       ├── billing/
│   │   │       │   ├── balance/route.ts
│   │   │       │   ├── add-credits/route.ts
│   │   │       │   ├── usage/route.ts
│   │   │       │   ├── transactions/route.ts
│   │   │       │   ├── invoices/route.ts
│   │   │       │   └── webhook/route.ts
│   │   │       │
│   │   │       ├── api-keys/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       │
│   │   │       ├── notifications/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/
│   │   │       │       └── read/route.ts
│   │   │       │
│   │   │       └── admin/
│   │   │           ├── users/route.ts
│   │   │           ├── instances/route.ts
│   │   │           ├── plans/
│   │   │           │   ├── sync/route.ts
│   │   │           │   └── [id]/route.ts
│   │   │           ├── revenue/route.ts
│   │   │           └── credits/
│   │   │               └── [userId]/route.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── layout.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── signin/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   └── verify-email/page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx               # Dashboard shell (sidebar, header)
│   │   │   ├── page.tsx                 # Dashboard overview
│   │   │   ├── instances/
│   │   │   │   ├── page.tsx             # Instance list
│   │   │   │   ├── new/page.tsx         # Multi-step create flow
│   │   │   │   └── [id]/page.tsx        # Instance detail
│   │   │   ├── billing/page.tsx
│   │   │   ├── settings/page.tsx        # Profile, SSH keys, API keys
│   │   │   └── notifications/page.tsx
│   │   │
│   │   ├── templates/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   │
│   │   ├── models/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   │
│   │   ├── pricing/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── developers/page.tsx
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Admin dashboard
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── instances/page.tsx
│   │   │   ├── plans/page.tsx
│   │   │   ├── templates/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── models/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── revenue/page.tsx
│   │   │   └── settings/page.tsx
│   │   │
│   │   └── (marketing)/
│   │       ├── about/page.tsx
│   │       ├── contact/page.tsx
│   │       ├── status/page.tsx
│   │       ├── terms/page.tsx
│   │       └── privacy/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                          # Primitives (Button, Input, Card, Modal...)
│   │   ├── layout/                      # Navbar, Footer, Sidebar, DashboardShell
│   │   ├── dashboard/                   # StatsCards, UsageChart, ActivityFeed
│   │   ├── instances/                   # InstanceCard, CreateWizard, StatusBadge
│   │   ├── billing/                     # CreditDisplay, AddCreditsModal, UsageChart
│   │   ├── auth/                        # LoginForm, SignupForm, OAuthButtons
│   │   ├── admin/                       # AdminTable, PlanEditor, UserManager
│   │   ├── models/                      # ModelCard, ModelGrid, DeployButton
│   │   ├── templates/                   # TemplateCard, TemplateGrid
│   │   └── shared/                      # CopyButton, StatusDot, Spinner, EmptyState
│   │
│   ├── lib/
│   │   ├── services/
│   │   │   ├── e2e-networks.ts          # ★ E2E Networks API service (CORE)
│   │   │   ├── billing.service.ts       # Credits, usage calculation
│   │   │   ├── instance.service.ts      # Instance lifecycle orchestration
│   │   │   ├── notification.service.ts  # Push notifications
│   │   │   ├── stripe.service.ts        # Stripe checkout, webhooks
│   │   │   └── email.service.ts         # Transactional emails
│   │   │
│   │   ├── utils/
│   │   │   ├── api-response.ts          # Standardized API responses
│   │   │   ├── errors.ts                # Custom error classes
│   │   │   ├── logger.ts                # Structured logging
│   │   │   ├── rate-limiter.ts          # API rate limiting
│   │   │   └── crypto.ts                # API key hashing, etc.
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-instances.ts
│   │   │   ├── use-billing.ts
│   │   │   ├── use-websocket.ts
│   │   │   └── use-notifications.ts
│   │   │
│   │   ├── validators/
│   │   │   ├── instance.schema.ts       # Zod schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── billing.schema.ts
│   │   │   └── ssh-key.schema.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── gpu-plans.ts
│   │   │   └── routes.ts
│   │   │
│   │   ├── jobs/
│   │   │   ├── queue.ts                 # BullMQ queue setup
│   │   │   ├── billing-cron.ts          # Per-minute billing
│   │   │   ├── status-sync.ts           # E2E status polling
│   │   │   ├── auto-shutdown.ts         # Instance auto-stop
│   │   │   ├── plan-sync.ts             # Daily plan sync
│   │   │   └── invoice-generator.ts     # Monthly invoices
│   │   │
│   │   ├── websocket/
│   │   │   └── server.ts                # WebSocket server for real-time
│   │   │
│   │   ├── auth.ts                      # NextAuth config
│   │   ├── prisma.ts                    # Prisma client singleton
│   │   └── stripe.ts                    # Stripe client
│   │
│   ├── types/
│   │   ├── e2e.types.ts                 # E2E API request/response types
│   │   ├── instance.types.ts
│   │   ├── billing.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts                 # Generic API types
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── config/
│       ├── site.ts                      # Site metadata
│       └── nav.ts                       # Navigation config
│
├── docs/
│   └── content/                         # MDX documentation files
│
├── .env.example
├── .env.local                           # Git-ignored
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
