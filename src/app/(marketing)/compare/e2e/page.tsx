"use client";

import { ComparisonPage } from "@/components/compare/ComparisonTable";

export default function CompareE2EPage() {
  return (
    <ComparisonPage
      competitorName="E2E Networks"
      competitorDescription="E2E Networks is India's largest GPU cloud provider with 3,000+ GPUs. Wollnut differentiates with developer tools, CLI, model endpoints, and GIFT City IFSC advantages."
      tagline="Same GPUs, better developer experience — plus GIFT City benefits."
      features={[
        {
          category: "Pricing & Billing",
          features: [
            { name: "Per-minute billing", wollnut: true, competitor: false },
            { name: "Starting price (H100)", wollnut: "₹225/hr", competitor: "₹280/hr" },
            { name: "Free credits on signup", wollnut: "₹500 free", competitor: false },
            { name: "Startup credits program", wollnut: "Up to ₹5L", competitor: false },
          ],
        },
        {
          category: "Developer Experience",
          features: [
            { name: "CLI tool", wollnut: true, competitor: false },
            { name: "Pre-built ML templates", wollnut: true, competitor: "Limited" },
            { name: "One-click model deployment", wollnut: true, competitor: false },
            { name: "OpenAI-compatible endpoints", wollnut: true, competitor: false },
            { name: "LLM Playground", wollnut: true, competitor: false },
            { name: "REST API", wollnut: true, competitor: true },
          ],
        },
        {
          category: "Storage",
          features: [
            { name: "Persistent volumes", wollnut: true, competitor: true },
            { name: "Free storage included", wollnut: "50GB free", competitor: false },
            { name: "NVMe SSD option", wollnut: true, competitor: true },
            { name: "Snapshots", wollnut: true, competitor: "Manual" },
          ],
        },
        {
          category: "Team & Organization",
          features: [
            { name: "Team management", wollnut: true, competitor: false },
            { name: "Role-based access control", wollnut: "5 roles", competitor: false },
            { name: "Per-team GPU budgets", wollnut: true, competitor: false },
            { name: "Audit logs", wollnut: true, competitor: false },
            { name: "SSO", wollnut: true, competitor: false },
          ],
        },
        {
          category: "Compliance & Location",
          features: [
            { name: "GIFT City IFSC", wollnut: true, competitor: false },
            { name: "0% GST (IFSC)", wollnut: true, competitor: false },
            { name: "DPDP Act compliance", wollnut: true, competitor: true },
            { name: "Data center tier", wollnut: "Tier IV (Yotta G1)", competitor: "Tier III+" },
          ],
        },
      ]}
      pricingExample={{
        workload: "Fine-tuning Llama 3.1 70B — 8x H100 for 10 hours",
        wollnutCost: "₹18,000",
        competitorCost: "₹22,400",
        savings: "₹4,400 (20%) + 0% GST",
      }}
      advantages={[
        "CLI for scriptable GPU management",
        "One-click model serving endpoints",
        "Team management with RBAC",
        "GIFT City IFSC — 0% GST",
        "Per-minute billing",
        "LLM Playground for testing models",
        "Startup credits program (up to ₹5L)",
        "50GB free persistent storage",
      ]}
    />
  );
}
