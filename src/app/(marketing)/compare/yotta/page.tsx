"use client";

import { ComparisonPage } from "@/components/compare/ComparisonTable";

export default function CompareYottaPage() {
  return (
    <ComparisonPage
      competitorName="Yotta Shakti Cloud"
      competitorDescription="Yotta operates one of India's largest GPU clusters (16,000+ H100s) from the same G1 data center in Gandhinagar. Wollnut differentiates with self-serve access, developer tools, and per-minute billing."
      tagline="Same data center, radically different experience — self-serve, developer-first."
      features={[
        {
          category: "Access & Onboarding",
          features: [
            { name: "Self-serve signup", wollnut: true, competitor: false },
            { name: "Instant GPU launch", wollnut: "Under 60 seconds", competitor: "Sales-driven" },
            { name: "Free credits on signup", wollnut: "₹500 free", competitor: false },
            { name: "No minimum commitment", wollnut: true, competitor: "Enterprise contracts" },
            { name: "Individual developer access", wollnut: true, competitor: false },
          ],
        },
        {
          category: "Pricing & Billing",
          features: [
            { name: "Per-minute billing", wollnut: true, competitor: false },
            { name: "Transparent public pricing", wollnut: true, competitor: "Contact sales" },
            { name: "Startup credits program", wollnut: "Up to ₹5L", competitor: false },
            { name: "Pay-as-you-go", wollnut: true, competitor: "Contracts" },
          ],
        },
        {
          category: "Developer Experience",
          features: [
            { name: "CLI tool", wollnut: true, competitor: false },
            { name: "REST API", wollnut: true, competitor: "Limited" },
            { name: "Pre-built ML templates", wollnut: true, competitor: false },
            { name: "One-click model serving", wollnut: true, competitor: false },
            { name: "OpenAI-compatible endpoints", wollnut: true, competitor: false },
            { name: "LLM Playground", wollnut: true, competitor: false },
          ],
        },
        {
          category: "Team Features",
          features: [
            { name: "Team management", wollnut: true, competitor: "Enterprise only" },
            { name: "RBAC", wollnut: "5 roles", competitor: "Custom" },
            { name: "Per-team budgets", wollnut: true, competitor: false },
            { name: "Audit logs", wollnut: true, competitor: "Enterprise" },
          ],
        },
        {
          category: "Infrastructure",
          features: [
            { name: "Data center", wollnut: "Yotta G1 (same)", competitor: "Yotta G1" },
            { name: "GIFT City IFSC", wollnut: true, competitor: "Yotta is in G1, not IFSC" },
            { name: "0% GST (IFSC)", wollnut: true, competitor: false },
            { name: "InfiniBand", wollnut: true, competitor: true },
          ],
        },
      ]}
      pricingExample={{
        workload: "Training run — 4x H100 for 48 hours",
        wollnutCost: "₹43,200",
        competitorCost: "Contact sales",
        savings: "Transparent pricing vs opaque quotes",
      }}
      advantages={[
        "Self-serve — no sales calls needed",
        "Launch GPUs in under 60 seconds",
        "Per-minute billing",
        "CLI and full REST API",
        "GIFT City IFSC — 0% GST",
        "Individual developer friendly",
        "Startup credits program",
        "OpenAI-compatible model endpoints",
      ]}
    />
  );
}
