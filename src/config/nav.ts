// src/config/nav.ts
// Navigation links and menu structure

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// ── Main site navigation ───────────────────
export const mainNav: NavItem[] = [
  { title: "Pricing", href: "/pricing" },
  { title: "Models", href: "/models", badge: "New" },
  { title: "Templates", href: "/templates" },
  { title: "Docs", href: "/docs" },
  { title: "Blog", href: "/blog" },
  { title: "API", href: "/developers" },
];

// ── Dashboard sidebar navigation ───────────
export const dashboardNav: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
    ],
  },
  {
    title: "Compute",
    items: [
      { title: "Instances", href: "/dashboard/instances", icon: "server" },
      {
        title: "New Instance",
        href: "/dashboard/instances/new",
        icon: "plus-circle",
      },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Billing", href: "/dashboard/billing", icon: "credit-card" },
      { title: "Settings", href: "/dashboard/settings", icon: "settings" },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: "bell",
      },
    ],
  },
];

// ── Admin sidebar navigation ───────────────
export const adminNav: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Admin Dashboard", href: "/admin", icon: "shield" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", href: "/admin/users", icon: "users" },
      { title: "All Instances", href: "/admin/instances", icon: "server" },
      { title: "GPU Plans", href: "/admin/plans", icon: "cpu" },
      { title: "Templates", href: "/admin/templates", icon: "layers" },
      { title: "AI Models", href: "/admin/models", icon: "brain" },
    ],
  },
  {
    title: "Finance",
    items: [
      { title: "Revenue", href: "/admin/revenue", icon: "trending-up" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", href: "/admin/settings", icon: "wrench" },
    ],
  },
];

// ── Footer links ───────────────────────────
export const footerNav = {
  product: [
    { title: "Pricing", href: "/pricing" },
    { title: "GPU Instances", href: "/dashboard/instances/new" },
    { title: "Models Hub", href: "/models" },
    { title: "Templates", href: "/templates" },
  ],
  developers: [
    { title: "Documentation", href: "/docs" },
    { title: "API Reference", href: "/developers" },
    { title: "Blog", href: "/blog" },
    { title: "Status", href: "/status" },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
  ],
} as const;

// ── Route constants ────────────────────────
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth/signin",
  SIGN_UP: "/auth/signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  DASHBOARD: "/dashboard",
  INSTANCES: "/dashboard/instances",
  NEW_INSTANCE: "/dashboard/instances/new",
  BILLING: "/dashboard/billing",
  SETTINGS: "/dashboard/settings",
  PRICING: "/pricing",
  MODELS: "/models",
  TEMPLATES: "/templates",
  DOCS: "/docs",
  BLOG: "/blog",
  DEVELOPERS: "/developers",
  ADMIN: "/admin",
} as const;
