"use client";

import { ComparisonPage } from "@/components/compare/ComparisonTable";

export default function CompareAWSPage() {
  return (
    <ComparisonPage
      competitorName="AWS"
      competitorDescription="Amazon Web Services is the world's largest cloud provider. Wollnut offers a specialized GPU cloud alternative with significant cost savings for AI workloads in India."
      tagline="Enterprise GPUs at a fraction of the cost — with Indian data residency."
      features={[
        {
          category: "Pricing & Billing",
          features: [
            { name: "Per-minute billing", wollnut: true, competitor: false },
            { name: "INR billing", wollnut: true, competitor: false },
            { name: "No upfront commitment", wollnut: true, competitor: true },
            { name: "Free credits on signup", wollnut: "₹500 free", competitor: "Free tier (limited)" },
            { name: "Transparent pricing", wollnut: true, competitor: false },
          ],
        },
        {
          category: "GPU Infrastructure",
          features: [
            { name: "H100 SXM available", wollnut: true, competitor: true },
            { name: "H200 available", wollnut: true, competitor: true },
            { name: "InfiniBand networking", wollnut: true, competitor: true },
            { name: "Multi-GPU clusters (8x)", wollnut: true, competitor: true },
            { name: "India-based GPUs", wollnut: "GIFT City", competitor: "Mumbai (limited)" },
          ],
        },
        {
          category: "Developer Experience",
          features: [
            { name: "CLI tool", wollnut: true, competitor: true },
            { name: "Pre-built ML templates", wollnut: true, competitor: false },
            { name: "One-click model deployment", wollnut: true, competitor: false },
            { name: "Persistent storage", wollnut: true, competitor: true },
            { name: "API endpoints for models", wollnut: "OpenAI-compatible", competitor: "SageMaker" },
          ],
        },
        {
          category: "Compliance & Location",
          features: [
            { name: "GIFT City IFSC benefits", wollnut: true, competitor: false },
            { name: "DPDP Act compliance", wollnut: true, competitor: "Partial" },
            { name: "RBI data localization", wollnut: true, competitor: "Mumbai only" },
            { name: "0% GST (IFSC)", wollnut: true, competitor: false },
          ],
        },
        {
          category: "Team & Organization",
          features: [
            { name: "Team management", wollnut: true, competitor: true },
            { name: "Per-team GPU budgets", wollnut: true, competitor: "Via AWS Budgets" },
            { name: "Audit logs", wollnut: true, competitor: true },
            { name: "SSO (Google Workspace)", wollnut: true, competitor: true },
          ],
        },
      ]}
      pricingExample={{
        workload: "Fine-tuning Llama 3.1 70B — 8x H100 for 10 hours",
        wollnutCost: "₹18,000",
        competitorCost: "₹32,000",
        savings: "₹14,000 (44%)",
      }}
      advantages={[
        "Up to 44% cheaper than AWS for GPU workloads",
        "GIFT City IFSC — 0% GST on services",
        "Per-minute billing stops waste",
        "INR billing — no forex headaches",
        "Pre-built ML templates for instant start",
        "OpenAI-compatible model endpoints",
        "DPDP Act compliant by default",
        "Dedicated support for Indian teams",
      ]}
    />
  );
}
