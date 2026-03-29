"use client";

import { ComparisonPage } from "@/components/compare/ComparisonTable";

export default function CompareGCPPage() {
  return (
    <ComparisonPage
      competitorName="Google Cloud"
      competitorDescription="Google Cloud Platform offers GPU instances via Compute Engine and Vertex AI. Wollnut provides a focused, cost-effective alternative for AI workloads with Indian data residency."
      tagline="Purpose-built for AI — without the cloud complexity or hyperscaler pricing."
      features={[
        {
          category: "Pricing & Billing",
          features: [
            { name: "Per-minute billing", wollnut: true, competitor: "Per-second" },
            { name: "INR billing", wollnut: true, competitor: false },
            { name: "Transparent pricing", wollnut: true, competitor: "Complex tiers" },
            { name: "Free credits on signup", wollnut: "₹500 free", competitor: "$300 trial" },
            { name: "No egress fees", wollnut: true, competitor: false },
          ],
        },
        {
          category: "GPU Infrastructure",
          features: [
            { name: "H100 available", wollnut: true, competitor: true },
            { name: "H200 available", wollnut: true, competitor: "Limited" },
            { name: "India-based GPUs", wollnut: "GIFT City", competitor: "Mumbai (limited SKUs)" },
            { name: "InfiniBand", wollnut: true, competitor: true },
            { name: "Multi-GPU clusters", wollnut: true, competitor: true },
          ],
        },
        {
          category: "Developer Experience",
          features: [
            { name: "CLI tool", wollnut: true, competitor: true },
            { name: "Pre-built ML templates", wollnut: true, competitor: "Vertex AI" },
            { name: "One-click model serving", wollnut: true, competitor: "Vertex AI Endpoints" },
            { name: "OpenAI-compatible API", wollnut: true, competitor: false },
            { name: "LLM Playground", wollnut: true, competitor: "AI Studio" },
            { name: "Setup complexity", wollnut: "Minutes", competitor: "Hours/days" },
          ],
        },
        {
          category: "Compliance",
          features: [
            { name: "GIFT City IFSC", wollnut: true, competitor: false },
            { name: "0% GST (IFSC)", wollnut: true, competitor: false },
            { name: "DPDP Act compliance", wollnut: true, competitor: "Partial" },
            { name: "RBI data localization", wollnut: true, competitor: "Mumbai region only" },
          ],
        },
      ]}
      pricingExample={{
        workload: "Fine-tuning Llama 3.1 70B — 8x H100 for 10 hours",
        wollnutCost: "₹18,000",
        competitorCost: "₹30,000",
        savings: "₹12,000 (40%)",
      }}
      advantages={[
        "Up to 40% cheaper for GPU workloads",
        "Zero complexity — launch in minutes, not hours",
        "GIFT City IFSC — 0% GST",
        "No egress fees on data transfer",
        "INR billing with Indian support",
        "OpenAI-compatible model endpoints",
        "Pre-built templates for instant start",
        "No cloud architecture knowledge required",
      ]}
    />
  );
}
