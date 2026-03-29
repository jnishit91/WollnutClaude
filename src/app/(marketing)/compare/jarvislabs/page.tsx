"use client";

import { ComparisonPage } from "@/components/compare/ComparisonTable";

export default function CompareJarvisLabsPage() {
  return (
    <ComparisonPage
      competitorName="JarvisLabs"
      competitorDescription="JarvisLabs is a developer-loved Indian GPU cloud known for simplicity and per-minute billing. Wollnut matches this simplicity while adding enterprise features, multi-GPU clusters, and GIFT City advantages."
      tagline="Developer-friendly like Jarvis — with enterprise scale and GIFT City IFSC."
      features={[
        {
          category: "Pricing & Billing",
          features: [
            { name: "Per-minute billing", wollnut: true, competitor: true },
            { name: "Free credits on signup", wollnut: "₹500 free", competitor: "Limited" },
            { name: "Startup credits program", wollnut: "Up to ₹5L", competitor: false },
            { name: "INR billing", wollnut: true, competitor: true },
          ],
        },
        {
          category: "GPU Infrastructure",
          features: [
            { name: "H100 SXM available", wollnut: true, competitor: false },
            { name: "H200 available", wollnut: true, competitor: false },
            { name: "Multi-GPU clusters (8x)", wollnut: true, competitor: false },
            { name: "InfiniBand networking", wollnut: true, competitor: false },
            { name: "A100 available", wollnut: true, competitor: true },
          ],
        },
        {
          category: "Developer Experience",
          features: [
            { name: "CLI tool", wollnut: true, competitor: false },
            { name: "Pre-built ML templates", wollnut: true, competitor: true },
            { name: "One-click model deployment", wollnut: true, competitor: false },
            { name: "OpenAI-compatible endpoints", wollnut: true, competitor: false },
            { name: "LLM Playground", wollnut: true, competitor: false },
            { name: "REST API", wollnut: true, competitor: "Limited" },
            { name: "Persistent storage", wollnut: true, competitor: true },
          ],
        },
        {
          category: "Team & Enterprise",
          features: [
            { name: "Team management", wollnut: true, competitor: false },
            { name: "Role-based access control", wollnut: true, competitor: false },
            { name: "Audit logs", wollnut: true, competitor: false },
            { name: "SSO", wollnut: true, competitor: false },
            { name: "Per-team GPU budgets", wollnut: true, competitor: false },
          ],
        },
        {
          category: "Compliance",
          features: [
            { name: "GIFT City IFSC", wollnut: true, competitor: false },
            { name: "0% GST (IFSC)", wollnut: true, competitor: false },
            { name: "Tier IV data center", wollnut: true, competitor: false },
            { name: "DPDP Act compliance", wollnut: true, competitor: true },
          ],
        },
      ]}
      pricingExample={{
        workload: "Running inference on Llama 3.1 8B — single GPU for 30 days",
        wollnutCost: "₹39,600",
        competitorCost: "N/A (no H100)",
        savings: "H100/H200 unavailable on JarvisLabs",
      }}
      advantages={[
        "H100 & H200 GPUs (not available on Jarvis)",
        "Multi-GPU clusters up to 8x",
        "InfiniBand for distributed training",
        "CLI for scriptable workflows",
        "Team management & RBAC",
        "GIFT City IFSC — 0% GST",
        "OpenAI-compatible model endpoints",
        "Startup credits up to ₹5L",
      ]}
    />
  );
}
