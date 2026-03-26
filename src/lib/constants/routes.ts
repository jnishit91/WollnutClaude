// src/lib/constants/routes.ts
// API route constants for consistent URL references

export const API_ROUTES = {
  // Auth
  AUTH: {
    SIGNUP: "/api/auth/signup",
    SIGNIN: "/api/auth/signin",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    SESSION: "/api/auth/session",
  },

  // Instances
  INSTANCES: {
    LIST: "/api/v1/instances",
    CREATE: "/api/v1/instances",
    DETAIL: (id: string) => `/api/v1/instances/${id}`,
    START: (id: string) => `/api/v1/instances/${id}/start`,
    STOP: (id: string) => `/api/v1/instances/${id}/stop`,
    REBOOT: (id: string) => `/api/v1/instances/${id}/reboot`,
    DELETE: (id: string) => `/api/v1/instances/${id}`,
    LOGS: (id: string) => `/api/v1/instances/${id}/logs`,
  },

  // Plans
  PLANS: {
    LIST: "/api/v1/plans",
  },

  // Templates
  TEMPLATES: {
    LIST: "/api/v1/templates",
    DETAIL: (slug: string) => `/api/v1/templates/${slug}`,
  },

  // Models
  MODELS: {
    LIST: "/api/v1/models",
    DETAIL: (slug: string) => `/api/v1/models/${slug}`,
  },

  // SSH Keys
  SSH_KEYS: {
    LIST: "/api/v1/ssh-keys",
    CREATE: "/api/v1/ssh-keys",
    DELETE: (id: string) => `/api/v1/ssh-keys/${id}`,
  },

  // Volumes
  VOLUMES: {
    LIST: "/api/v1/volumes",
    CREATE: "/api/v1/volumes",
    ATTACH: (id: string) => `/api/v1/volumes/${id}/attach`,
    DETACH: (id: string) => `/api/v1/volumes/${id}/detach`,
    DELETE: (id: string) => `/api/v1/volumes/${id}`,
  },

  // Billing
  BILLING: {
    BALANCE: "/api/v1/billing/balance",
    ADD_CREDITS: "/api/v1/billing/add-credits",
    USAGE: "/api/v1/billing/usage",
    TRANSACTIONS: "/api/v1/billing/transactions",
    INVOICES: "/api/v1/billing/invoices",
    VERIFY_PAYMENT: "/api/v1/billing/verify-payment",
    WEBHOOK: "/api/v1/billing/webhook",
  },

  // API Keys
  API_KEYS: {
    LIST: "/api/v1/api-keys",
    CREATE: "/api/v1/api-keys",
    DELETE: (id: string) => `/api/v1/api-keys/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/api/v1/notifications",
    MARK_READ: (id: string) => `/api/v1/notifications/${id}/read`,
  },

  // Real-time Events
  EVENTS: {
    STREAM: "/api/v1/events/stream",
    INSTANCE_STATUS: "/api/v1/instances/status-stream",
  },

  // Admin
  ADMIN: {
    USERS: "/api/v1/admin/users",
    INSTANCES: "/api/v1/admin/instances",
    PLANS_SYNC: "/api/v1/admin/plans/sync",
    PLAN_UPDATE: (id: string) => `/api/v1/admin/plans/${id}`,
    REVENUE: "/api/v1/admin/revenue",
    CREDIT_ADJUST: (userId: string) => `/api/v1/admin/credits/${userId}`,
  },
} as const;
