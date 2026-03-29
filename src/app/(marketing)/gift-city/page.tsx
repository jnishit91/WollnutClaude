"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Shield,
  Globe,
  Landmark,
  Scale,
  Server,
  Lock,
  DollarSign,
  ArrowRight,
  Sparkles,
  Check,
  Cpu,
  Zap,
  BarChart3,
  FileText,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const TAX_ADVANTAGES = [
  {
    icon: DollarSign,
    title: "0% GST on IFSC Services",
    description:
      "Services provided from GIFT City IFSC are exempt from GST, reducing your total cost of GPU compute significantly.",
  },
  {
    icon: Scale,
    title: "No Stamp Duty",
    description:
      "Transactions executed within IFSC are exempt from stamp duty, lowering operational overhead for financial AI workloads.",
  },
  {
    icon: Landmark,
    title: "10-Year Tax Holiday",
    description:
      "IFSC units enjoy a 100% tax deduction on profits for any 10 consecutive years out of the first 15 years of operation.",
  },
  {
    icon: Globe,
    title: "Competitive Cross-Border Pricing",
    description:
      "Operate in foreign currency, avoid double taxation, and price your AI services competitively for global clients.",
  },
];

const DATA_SOVEREIGNTY_POINTS = [
  {
    icon: Shield,
    title: "DPDP Act Compliance by Default",
    description:
      "All data processed on Wollnut GIFT City infrastructure is compliant with the Digital Personal Data Protection Act, 2023.",
  },
  {
    icon: Lock,
    title: "Data Stays in India",
    description:
      "Your data never leaves Indian borders. Process, train, and infer entirely within sovereign infrastructure.",
  },
  {
    icon: Landmark,
    title: "IFSC Regulatory Framework",
    description:
      "Benefit from the unified regulatory authority (IFSCA) that simplifies compliance across banking, insurance, and capital markets.",
  },
  {
    icon: Building2,
    title: "RBI Data Localization",
    description:
      "Meet RBI's data localization mandate for payment systems and financial data storage without additional infrastructure.",
  },
];

const BFSI_FEATURES = [
  {
    icon: Lock,
    title: "RBI Data Localization Compliance",
    description:
      "Run AI/ML workloads on financial data while staying fully compliant with RBI's storage and processing mandates.",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description:
      "Deploy real-time fraud detection models on GPU-accelerated infrastructure purpose-built for regulated environments.",
  },
  {
    icon: BarChart3,
    title: "Credit Scoring",
    description:
      "Train and serve ML models for credit scoring, risk assessment, and underwriting at scale with low latency.",
  },
  {
    icon: FileText,
    title: "Document AI",
    description:
      "Process KYC documents, loan applications, and insurance claims with GPU-powered OCR and NLP pipelines.",
  },
  {
    icon: TrendingUp,
    title: "Algorithmic Trading",
    description:
      "Run quantitative models and backtesting on GPUs co-located in GIFT City for minimal latency to IFSC exchanges.",
  },
  {
    icon: CreditCard,
    title: "Payment Intelligence",
    description:
      "Build smart routing, reconciliation, and anomaly detection for payment processors operating under IFSC regulations.",
  },
];

const INFRA_STATS = [
  {
    label: "Data Center",
    value: "Yotta G1",
    detail: "Tier IV certified facility",
  },
  {
    label: "Power",
    value: "Dual Feed",
    detail: "Redundant power with on-site backup",
  },
  {
    label: "Uptime SLA",
    value: "99.99%",
    detail: "Enterprise-grade availability",
  },
  {
    label: "Security",
    value: "24/7",
    detail: "Biometric access, CCTV, mantraps",
  },
];

export default function GiftCityPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="border-b border-white/10 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl px-4"
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            <Landmark className="h-3 w-3" /> GIFT City IFSC
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            India&apos;s Only GPU Cloud in GIFT City
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Wollnut is the first GPU cloud infrastructure provider operating
            from GIFT City IFSC. Get 0% GST, tax holidays, and full data
            sovereignty — purpose-built for regulated and cross-border AI
            workloads.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Talk to Us About Regulated Workloads{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* What is GIFT City IFSC */}
      <section className="border-t border-white/10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl px-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">What is GIFT City IFSC?</h2>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Gujarat International Finance Tec-City (GIFT City) is India&apos;s
              first operational smart city and International Financial Services
              Centre (IFSC). Located in Gandhinagar, Gujarat, it is a special
              economic zone regulated by the International Financial Services
              Centres Authority (IFSCA) — a unified regulator for all financial
              services within the zone.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Special Economic Zone",
                desc: "Dedicated zone with its own regulatory framework, tax incentives, and world-class physical infrastructure.",
              },
              {
                icon: Landmark,
                title: "Unified Regulator (IFSCA)",
                desc: "Single-window regulatory authority covering banking, capital markets, insurance, and fund management.",
              },
              {
                icon: Globe,
                title: "Global Gateway",
                desc: "Designed to compete with Singapore, Dubai, and London as a global financial services hub operating in foreign currency.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <item.icon className="h-6 w-6 text-indigo-400" />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tax Advantages */}
      <section className="border-t border-white/10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl px-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">Tax Advantages</h2>
            <p className="mt-3 text-gray-400">
              Operating from GIFT City IFSC unlocks significant cost advantages
              that translate directly into cheaper GPU compute.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {TAX_ADVANTAGES.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10">
                    <item.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Data Sovereignty */}
      <section className="border-t border-white/10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl px-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">Data Sovereignty</h2>
            <p className="mt-3 text-gray-400">
              Your data stays in India. Meet every regulatory requirement for
              data localization without compromising on GPU performance.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {DATA_SOVEREIGNTY_POINTS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10">
                    <item.icon className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* For BFSI / Fintech */}
      <section className="border-t border-white/10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl px-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">Built for BFSI &amp; Fintech</h2>
            <p className="mt-3 text-gray-400">
              GPU-accelerated AI infrastructure designed for the regulatory
              demands of banking, financial services, and insurance.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BFSI_FEATURES.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <item.icon className="h-6 w-6 text-indigo-400" />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* For Cross-Border AI */}
      <section className="border-t border-white/10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl px-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">For Cross-Border AI Companies</h2>
            <p className="mt-3 text-gray-400">
              Indian AI companies serving global clients can operate in foreign
              currency from GIFT City — combining India&apos;s cost advantage
              with a globally competitive regulatory wrapper.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: DollarSign,
                title: "Foreign Currency Operations",
                description:
                  "Invoice global clients in USD, EUR, or GBP directly from GIFT City. No forex conversion overhead on revenue.",
              },
              {
                icon: Globe,
                title: "Global Client Servicing",
                description:
                  "Serve clients in the US, Europe, and Middle East while keeping your AI infrastructure and team in India.",
              },
              {
                icon: Scale,
                title: "Avoid Double Taxation",
                description:
                  "Leverage India's DTAA network and IFSC tax benefits to structure cross-border AI services efficiently.",
              },
              {
                icon: Zap,
                title: "Indian GPU, Global Inference",
                description:
                  "Train and fine-tune on Indian GPUs, deploy inference endpoints that serve globally with CDN-backed delivery.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-6 w-6 text-indigo-400" />
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Infrastructure */}
      <section className="border-t border-white/10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl px-4"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">Infrastructure</h2>
            <p className="mt-3 text-gray-400">
              Enterprise-grade physical infrastructure in GIFT City, powered by
              Yotta&apos;s Tier IV data center.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INFRA_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-indigo-400">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-400">{stat.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "N+1 cooling redundancy",
                "On-site diesel generators",
                "Fire suppression systems",
                "SOC 2 Type II compliant",
                "ISO 27001 certified",
                "CCTV & biometric access",
                "24/7 on-site NOC",
                "Dark fibre connectivity",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl px-4 text-center"
        >
          <Server className="mx-auto h-10 w-10 text-indigo-400" />
          <h2 className="mt-4 text-3xl font-bold">
            Ready to Run AI in GIFT City?
          </h2>
          <p className="mt-3 text-gray-400">
            Whether you need regulated infrastructure for BFSI workloads or a
            tax-efficient base for cross-border AI, Wollnut in GIFT City has you
            covered.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Talk to Us About Regulated Workloads{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-semibold text-gray-300 hover:bg-white/10"
            >
              View Pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
