"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  ArrowRight,
  Zap,
  Clock,
  Shield,
  Code,
  Server,
  CreditCard,
  Terminal,
  ChevronRight,
  Cpu,
  Layers,
  HardDrive,
  Rocket,
  MonitorSmartphone,
  Star,
  Quote,
  Users,
  Activity,
  Timer,
  Globe,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────── */

const TYPING_USE_CASES = [
  "Train LLMs",
  "Fine-tune models",
  "Run inference",
  "Deploy AI apps",
];

const STATS = [
  { label: "Developers", value: 10000, suffix: "+", icon: Users },
  { label: "GPU Hours", value: 1000000, suffix: "+", prefix: "", icon: Activity },
  { label: "Uptime", value: 99.9, suffix: "%", icon: Globe, decimals: 1 },
  { label: "Deploy Time", value: 60, suffix: "s", prefix: "<", icon: Timer },
];

const TERMINAL_LINES = [
  { text: '$ curl -X POST https://api.wollnutlabs.com/v1/instances \\', delay: 0 },
  { text: '  -H "Authorization: Bearer wn_sk_..." \\', delay: 600 },
  { text: '  -d \'{"gpu": "H100", "template": "pytorch-2.3"}\'', delay: 1200 },
  { text: '', delay: 1800 },
  { text: '{"id": "inst_8x7k2m", "status": "provisioning", "gpu": "H100 SXM 80GB"}', delay: 2200, isResponse: true },
  { text: '', delay: 2800 },
  { text: '# Instance ready in 47 seconds', delay: 3200, isComment: true },
  { text: '$ ssh root@gpu-inst-8x7k2m.wollnutlabs.com', delay: 3800 },
  { text: 'Welcome to Wollnut Labs GPU Instance (H100 SXM 80GB)', delay: 4400, isResponse: true },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Deploy in Under 60 Seconds",
    description:
      "No sales calls, no procurement. Sign up, add credits, and launch a GPU instance instantly.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-accent-amber",
  },
  {
    icon: Clock,
    title: "Per-Minute Billing",
    description:
      "Pay only for what you use. No hourly minimums, no long-term commitments. Stop anytime.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-brand-400",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Hardware",
    description:
      "NVIDIA H100, H200, and B200 GPUs with InfiniBand networking. The same hardware powering frontier AI labs.",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-accent-green",
  },
  {
    icon: Code,
    title: "Full REST API",
    description:
      "Manage instances programmatically. Create, start, stop, and destroy GPUs via our comprehensive API.",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Server,
    title: "Pre-Configured Templates",
    description:
      "Launch with PyTorch, TensorFlow, vLLM, or Ollama pre-installed. Ready for work in seconds.",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
  {
    icon: CreditCard,
    title: "Simple Credit System",
    description:
      "Add credits via Razorpay. Auto-recharge when your balance runs low. Full billing transparency.",
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-400",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Choose Your GPU",
    description: "Pick from NVIDIA H100, H200, or B200 GPUs based on your workload requirements.",
    icon: Cpu,
    detail: "H100 / H200 / B200",
  },
  {
    step: "02",
    title: "Select a Template",
    description: "Start with PyTorch, TensorFlow, vLLM, or Ollama pre-configured and ready to go.",
    icon: Layers,
    detail: "PyTorch / TensorFlow / vLLM",
  },
  {
    step: "03",
    title: "Configure Resources",
    description: "Set up storage, SSH keys, and choose your preferred region for optimal latency.",
    icon: HardDrive,
    detail: "Storage / SSH / Region",
  },
  {
    step: "04",
    title: "Launch in Seconds",
    description: "One-click deploy. Your GPU instance provisions in under 60 seconds.",
    icon: Rocket,
    detail: "One-click deploy",
  },
  {
    step: "05",
    title: "Access Your Instance",
    description: "Connect via JupyterLab, SSH, or API. Start training and inferencing immediately.",
    icon: MonitorSmartphone,
    detail: "Jupyter / SSH / API",
  },
];

const GPU_TIERS = [
  {
    gpu: "H100 SXM",
    vram: "80 GB",
    price: "$2.49",
    gradient: "from-blue-500 to-indigo-600",
    useCases: ["LLM fine-tuning", "Inference at scale", "Distributed training"],
  },
  {
    gpu: "H200 SXM",
    vram: "141 GB",
    price: "$3.99",
    gradient: "from-violet-500 to-purple-600",
    popular: true,
    useCases: [
      "Large LLM training",
      "High-throughput inference",
      "Multi-modal models",
    ],
  },
  {
    gpu: "B200 SXM",
    vram: "192 GB",
    price: "$5.49",
    gradient: "from-emerald-500 to-teal-600",
    useCases: [
      "Frontier model training",
      "Trillion-parameter models",
      "Massive-scale inference",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "We switched from AWS and cut our GPU costs by 60%. The per-minute billing alone has saved us thousands each month.",
    name: "Priya S.",
    role: "ML Engineer",
    company: "Series B Startup",
  },
  {
    quote: "The per-minute billing is a game-changer for experimentation. We can spin up an H100, run a quick test, and tear it down without worrying about hourly overages.",
    name: "Arjun K.",
    role: "AI Researcher",
    company: "IIT Delhi",
  },
  {
    quote: "Deploy to production in under a minute. Nothing else comes close. Our team went from waiting days for GPU access to deploying in seconds.",
    name: "Sarah L.",
    role: "CTO",
    company: "AI Infrastructure Co.",
  },
  {
    quote: "Finally a GPU cloud that doesn't require enterprise contracts. Perfect for our research lab where grant budgets are unpredictable.",
    name: "Rahul M.",
    role: "Data Scientist",
    company: "IISC Bangalore",
  },
  {
    quote: "The API is clean and the templates save us hours of setup. We integrated Wollnut Labs into our CI/CD pipeline in a single afternoon.",
    name: "Mike T.",
    role: "DevOps Lead",
    company: "MLOps Platform",
  },
  {
    quote: "Best H100 pricing we've found. The team uses it daily for fine-tuning and inference workloads. Support has been incredibly responsive.",
    name: "Anika P.",
    role: "Research Lead",
    company: "NLP Startup",
  },
];

const TRUSTED_BY = [
  "IIT Delhi",
  "IIT Bombay",
  "IISC Bangalore",
  "Zoho",
  "Flipkart",
  "Razorpay",
  "Postman",
  "Freshworks",
];

/* ─── Animated Counter Component ────────────────────────── */

function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    const num = Math.round(latest);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}K`;
    }
    return num.toLocaleString();
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, {
        duration,
        ease: "easeOut",
      });
    }
  }, [isInView, motionValue, value, duration]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest}${suffix}`;
      }
    });
    return unsubscribe;
  }, [rounded, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

/* ─── Typing Effect Component ───────────────────────────── */

function TypingEffect({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && currentText === word) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setCurrentText(
            isDeleting
              ? word.substring(0, currentText.length - 1)
              : word.substring(0, currentText.length + 1)
          );
        },
        isDeleting ? 40 : 80
      );
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
      {currentText}
      <span className="animate-pulse text-brand-400">|</span>
    </span>
  );
}

/* ─── Terminal Demo Component ───────────────────────────── */

function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (!isInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
        }, line.delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-surface-800 bg-surface-950 shadow-2xl">
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 border-b border-surface-800 bg-surface-900 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-surface-500 font-mono">
          wollnut-labs ~ api
        </span>
      </div>

      {/* Terminal content */}
      <div className="overflow-x-auto p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed min-h-[280px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`whitespace-pre-wrap break-all ${
              line.isResponse
                ? "text-accent-green"
                : line.isComment
                ? "text-surface-500"
                : "text-surface-300"
            }`}
          >
            {line.text || "\u00A0"}
          </motion.div>
        ))}
        {visibleLines > 0 && visibleLines < TERMINAL_LINES.length && (
          <span className="inline-block h-4 w-2 animate-pulse bg-surface-300" />
        )}
      </div>
    </div>
  );
}

/* ─── Fade-up animation variant ─────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

/* ─── Page ──────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ───────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-600/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-brand-600/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-32">
            <motion.div
              className="mx-auto max-w-4xl text-center"
              {...fadeUp}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                <span className="text-xs font-medium text-brand-400">
                  All systems operational
                </span>
                <ChevronRight className="h-3 w-3 text-brand-400" />
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Enterprise GPUs to{" "}
                <br className="hidden sm:inline" />
                <TypingEffect words={TYPING_USE_CASES} />
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-400 leading-relaxed">
                Deploy NVIDIA H100, H200, and B200 GPUs in under a minute.
                Per-minute billing. No contracts. Full API access. Built for
                teams that ship.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="group flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-700 hover:shadow-glow-lg hover:scale-[1.02]"
                >
                  Start Free — $5 Credit
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/docs"
                  className="flex items-center gap-2 rounded-lg border border-surface-700 px-8 py-3.5 text-sm font-medium text-surface-300 transition-all hover:border-surface-600 hover:text-white hover:bg-surface-900"
                >
                  <Terminal className="h-4 w-4" />
                  View API Docs
                </Link>
              </div>

              {/* Trust bar */}
              <motion.div
                className="mt-12 flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-surface-950 bg-gradient-to-br from-brand-400/60 to-brand-600/60 flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-accent-amber text-accent-amber"
                    />
                  ))}
                </div>
                <p className="text-sm text-surface-400">
                  Trusted by{" "}
                  <span className="font-semibold text-surface-300">
                    10,000+
                  </span>{" "}
                  AI developers
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats / Metrics Bar ────────────────────── */}
        <section className="border-y border-surface-800/50 bg-surface-900/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10 border border-brand-500/20">
                    <stat.icon className="h-5 w-5 text-brand-400" />
                  </div>
                  <div className="text-3xl font-bold text-white sm:text-4xl">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix || ""}
                      decimals={stat.decimals || 0}
                    />
                  </div>
                  <span className="mt-1 text-sm text-surface-400 font-medium">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Terminal / CLI Demo ────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Launch a GPU with{" "}
                  <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                    one API call
                  </span>
                </h2>
                <p className="mt-4 text-lg text-surface-400 leading-relaxed">
                  Our REST API makes it trivial to provision GPU instances
                  programmatically. Pick a GPU, choose a template, and your
                  instance is ready in under a minute.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Full REST API with OpenAPI spec",
                    "Pre-configured ML templates",
                    "SSH, JupyterLab, and API access",
                    "Auto-scaling and spot instances",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-surface-300"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-green/10">
                        <ChevronRight className="h-3 w-3 text-accent-green" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/developers"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
                >
                  Explore the API
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TerminalDemo />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Features Grid ─────────────────────────── */}
        <section className="border-t border-surface-800/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Everything you need to train and deploy
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-surface-400">
                From solo researchers to enterprise teams, Wollnut Labs gives
                you frictionless access to the best AI hardware.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="group relative overflow-hidden rounded-xl border border-surface-800 bg-surface-900 p-6 transition-all duration-300 hover:border-surface-700 hover:bg-surface-900/80 hover:shadow-lg hover:shadow-brand-600/5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10 border border-brand-500/10 transition-transform duration-300 group-hover:scale-110">
                      <f.icon
                        className={`h-6 w-6 ${f.iconColor}`}
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-surface-400">
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────── */}
        <section className="border-t border-surface-800/50 bg-surface-900/20 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Up and running in 5 steps
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-surface-400">
                From sign-up to running your first training job in under 5
                minutes.
              </p>
            </motion.div>

            <div className="relative mt-16">
              {/* Vertical connecting line (desktop) */}
              <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-brand-600/50 via-brand-600/20 to-transparent lg:block" />

              <div className="space-y-12 lg:space-y-16">
                {STEPS.map((s, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <motion.div
                      key={s.step}
                      className={`relative flex flex-col items-center gap-6 lg:flex-row ${
                        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                      }`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Content side */}
                      <div
                        className={`flex-1 ${
                          isEven ? "lg:text-right" : "lg:text-left"
                        } text-center`}
                      >
                        <span className="text-xs font-bold text-brand-400 tracking-wider uppercase">
                          Step {s.step}
                        </span>
                        <h3 className="mt-2 text-xl font-bold text-white">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-sm text-surface-400 max-w-sm mx-auto lg:mx-0 lg:ml-auto">
                          {s.description}
                        </p>
                        <span className="mt-3 inline-block rounded-full bg-surface-800 px-3 py-1 text-xs font-medium text-surface-300">
                          {s.detail}
                        </span>
                      </div>

                      {/* Center node */}
                      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-500/30 bg-surface-900 shadow-glow shrink-0">
                        <s.icon className="h-7 w-7 text-brand-400" />
                      </div>

                      {/* Spacer for the other side */}
                      <div className="hidden flex-1 lg:block" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── GPU Pricing Preview ────────────────────── */}
        <section className="border-t border-surface-800/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-surface-400">
                Per-hour pricing with per-minute billing granularity. No hidden
                fees. No commitments.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {GPU_TIERS.map((tier, i) => (
                <motion.div
                  key={tier.gpu}
                  className={`group relative overflow-hidden rounded-2xl border bg-surface-900 p-8 transition-all duration-300 hover:scale-[1.02] ${
                    tier.popular
                      ? "border-brand-500/40 shadow-glow"
                      : "border-surface-800 hover:border-surface-700"
                  }`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {tier.popular && (
                    <span className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                  )}
                  {tier.popular && (
                    <span className="absolute top-4 right-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  )}

                  <div
                    className={`inline-flex rounded-lg bg-gradient-to-r ${tier.gradient} px-3 py-1.5 text-xs font-bold text-white`}
                  >
                    {tier.gpu}
                  </div>

                  <div className="mt-1 text-xs text-surface-500 font-medium">
                    Starting from
                  </div>

                  <div className="mt-3">
                    <span className="text-4xl font-bold text-white">
                      {tier.price}
                    </span>
                    <span className="text-surface-400 ml-1">/hr per GPU</span>
                  </div>

                  <p className="mt-1 text-sm text-surface-500">
                    {tier.vram} HBM3e VRAM
                  </p>

                  <div className="mt-6 h-px bg-surface-800" />

                  <ul className="mt-6 space-y-3">
                    {tier.useCases.map((uc) => (
                      <li
                        key={uc}
                        className="flex items-center gap-3 text-sm text-surface-300"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600/10">
                          <ChevronRight className="h-3 w-3 text-brand-400" />
                        </span>
                        {uc}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/pricing"
                    className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                      tier.popular
                        ? "bg-brand-600 text-white hover:bg-brand-700 shadow-glow"
                        : "border border-surface-700 text-surface-300 hover:border-surface-600 hover:text-white hover:bg-surface-800"
                    }`}
                  >
                    View All Plans
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────── */}
        <section className="border-t border-surface-800/50 bg-surface-900/20 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Loved by AI teams worldwide
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-surface-400">
                See why thousands of developers and researchers choose Wollnut
                Labs for their GPU infrastructure.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="relative rounded-xl border border-surface-800 bg-surface-900 p-6 transition-all duration-300 hover:border-surface-700 hover:shadow-lg hover:shadow-brand-600/5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Quote className="mb-4 h-6 w-6 text-brand-600/40" />

                  <p className="text-sm leading-relaxed text-surface-300">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400/40 to-brand-600/40 text-xs font-bold text-white">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {t.name}
                      </div>
                      <div className="text-xs text-surface-500">
                        {t.role}, {t.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trusted By / Partner Logos ─────────────── */}
        <section className="border-t border-surface-800/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.p
              className="mb-10 text-center text-sm font-medium uppercase tracking-wider text-surface-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Trusted by teams at leading organizations
            </motion.p>

            {/* Scrolling marquee */}
            <div className="relative overflow-hidden">
              {/* Fade edges */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface-950 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface-950 to-transparent" />

              <div className="flex animate-marquee gap-12 whitespace-nowrap">
                {[...TRUSTED_BY, ...TRUSTED_BY].map((name, i) => (
                  <div
                    key={`${name}-${i}`}
                    className="flex shrink-0 items-center gap-2 px-4 py-3"
                  >
                    <span className="text-lg font-bold bg-gradient-to-r from-surface-400 to-surface-500 bg-clip-text text-transparent transition-all hover:from-brand-400 hover:to-brand-600">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ───────────────────────────── */}
        <section className="relative overflow-hidden border-t border-surface-800/50 py-24">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-600/5 via-brand-600/10 to-brand-600/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand-600/10 blur-3xl" />
          <div className="bg-grid absolute inset-0 opacity-20" />

          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5">
                <Rocket className="h-3.5 w-3.5 text-brand-400" />
                <span className="text-xs font-medium text-brand-400">
                  Get started in minutes
                </span>
              </div>

              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Ready to{" "}
                <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                  supercharge
                </span>{" "}
                your AI?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-surface-400 leading-relaxed">
                Sign up for free and get $5 in GPU credits. No credit card
                required to create an account. Start training in under a minute.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="group flex items-center gap-2 rounded-lg bg-brand-600 px-10 py-4 text-base font-semibold text-white shadow-glow transition-all hover:bg-brand-700 hover:shadow-glow-lg hover:scale-[1.02]"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border border-surface-700 px-10 py-4 text-base font-medium text-surface-300 transition-all hover:border-surface-600 hover:text-white hover:bg-surface-800/50"
                >
                  Contact Sales
                </Link>
              </div>

              <p className="mt-6 text-xs text-surface-500">
                No credit card required. Free $5 credit on signup. Cancel
                anytime.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Marquee animation keyframes */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
