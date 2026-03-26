"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

const SERVICES = [
  { name: "Web Dashboard", status: "operational" as const },
  { name: "REST API", status: "operational" as const },
  { name: "Instance Provisioning", status: "operational" as const },
  { name: "Billing & Payments (Stripe)", status: "operational" as const },
  { name: "Authentication (OAuth)", status: "operational" as const },
  { name: "E2E Networks Integration", status: "operational" as const },
  { name: "Background Jobs (BullMQ)", status: "operational" as const },
  { name: "Database (PostgreSQL)", status: "operational" as const },
];

const STATUS_CONFIG = {
  operational: {
    icon: CheckCircle,
    label: "Operational",
    color: "text-accent-green",
    dot: "bg-accent-green",
  },
  degraded: {
    icon: AlertCircle,
    label: "Degraded",
    color: "text-accent-amber",
    dot: "bg-accent-amber",
  },
  outage: {
    icon: AlertCircle,
    label: "Outage",
    color: "text-accent-red",
    dot: "bg-accent-red",
  },
};

export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-surface-800/50">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              System Status
            </h1>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent-green/20 bg-accent-green/5 px-4 py-2">
              {allOperational ? (
                <>
                  <CheckCircle className="h-5 w-5 text-accent-green" />
                  <span className="text-sm font-medium text-accent-green">
                    All Systems Operational
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-accent-amber" />
                  <span className="text-sm font-medium text-accent-amber">
                    Some Systems Degraded
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Services list */}
        <div className="rounded-xl border border-surface-800 bg-surface-900">
          {SERVICES.map((service, i) => {
            const config = STATUS_CONFIG[service.status];
            const Icon = config.icon;
            return (
              <div
                key={service.name}
                className={`flex items-center justify-between px-5 py-4 ${
                  i < SERVICES.length - 1 ? "border-b border-surface-800" : ""
                }`}
              >
                <span className="text-sm font-medium text-white">
                  {service.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${config.color}`}>
                    {config.label}
                  </span>
                  <div className={`h-2 w-2 rounded-full ${config.dot}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Uptime bar (visual) */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white">
            90-Day Uptime
          </h2>
          <p className="mt-1 text-sm text-surface-400">
            Overall platform availability
          </p>
          <div className="mt-4 flex gap-0.5">
            {Array.from({ length: 90 }, (_, i) => (
              <div
                key={i}
                className="h-8 flex-1 rounded-sm bg-accent-green/80 transition-colors hover:bg-accent-green"
                title={`Day ${90 - i}: Operational`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-surface-500">
            <span>90 days ago</span>
            <span className="font-medium text-accent-green">99.9% uptime</span>
            <span>Today</span>
          </div>
        </div>

        {/* Last updated */}
        <div className="mt-10 flex items-center gap-2 text-xs text-surface-500">
          <Clock className="h-3.5 w-3.5" />
          Last updated: {new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
