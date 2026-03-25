// src/config/site.ts
// Site-wide metadata and configuration

export const siteConfig = {
  name: "Wollnut Labs",
  description:
    "Enterprise GPU cloud for AI/ML workloads. Deploy H100, H200, and B200 GPUs on-demand. Fine-tune LLMs, train models, and run inference at scale.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://wollnutlabs.com",
  ogImage: "/images/og-default.png",
  creator: "Wollnut Labs",
  keywords: [
    "GPU cloud",
    "AI infrastructure",
    "H100",
    "H200",
    "B200",
    "machine learning",
    "LLM inference",
    "fine-tuning",
    "deep learning",
    "cloud GPU",
  ],
  links: {
    github: "https://github.com/jnishit91/WollnutLabs",
    docs: "/docs",
    blog: "/blog",
    pricing: "/pricing",
    status: "/status",
    terms: "/terms",
    privacy: "/privacy",
  },
  support: {
    email: "support@wollnutlabs.com",
    discord: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
