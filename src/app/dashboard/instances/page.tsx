"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useInstances, useInstanceAction, useDestroyInstance } from "@/lib/hooks/use-instances";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CopyButton } from "@/components/shared/CopyButton";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonRow } from "@/components/shared/Skeleton";
import type { InstanceStatus } from "@/types/instance.types";
import { Server, Plus, MoreVertical, Zap, ArrowRight, Monitor, KeyRound, Rocket } from "lucide-react";
import { motion } from "framer-motion";

function formatUptime(startedAt: string | null, status: string): string {
  if (!startedAt || status !== "RUNNING") return "-";
  const ms = Date.now() - new Date(startedAt).getTime();
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  return `${hours}h ${minutes}m`;
}

interface InstanceRow {
  id: string;
  name: string;
  status: InstanceStatus;
  gpuType: string;
  gpuCount: number;
  ipAddress: string | null;
  pricePerHour: number;
  totalBilledAmount: number;
  startedAt: string | null;
  e2eNodeId: string | null;
  sshPort: number | null;
}

function ActionsDropdown({ instance }: { instance: InstanceRow }) {
  const [open, setOpen] = useState(false);
  const [confirmDestroy, setConfirmDestroy] = useState(false);
  const action = useInstanceAction(instance.id);
  const destroy = useDestroyInstance();

  const handleAction = async (type: "start" | "stop" | "reboot") => {
    setOpen(false);
    action.mutate(type, {
      onSuccess: () => toast.success(`Instance ${type} initiated`),
    });
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-surface-700 bg-surface-800 py-1 shadow-xl">
              {instance.status === "STOPPED" && (
                <button
                  onClick={() => handleAction("start")}
                  className="block w-full px-3 py-2 text-left text-sm text-surface-200 hover:bg-surface-700"
                >
                  Start
                </button>
              )}
              {instance.status === "RUNNING" && (
                <>
                  <button
                    onClick={() => handleAction("stop")}
                    className="block w-full px-3 py-2 text-left text-sm text-surface-200 hover:bg-surface-700"
                  >
                    Stop
                  </button>
                  <button
                    onClick={() => handleAction("reboot")}
                    className="block w-full px-3 py-2 text-left text-sm text-surface-200 hover:bg-surface-700"
                  >
                    Reboot
                  </button>
                </>
              )}
              {instance.ipAddress && instance.status === "RUNNING" && (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigator.clipboard.writeText(
                      `ssh root@${instance.ipAddress} -p ${instance.sshPort || 22}`
                    );
                    toast.success("SSH command copied");
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-surface-200 hover:bg-surface-700"
                >
                  Copy SSH Command
                </button>
              )}
              <Link
                href={`/dashboard/instances/${instance.id}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-surface-200 hover:bg-surface-700"
              >
                View Details
              </Link>
              <hr className="my-1 border-surface-700" />
              <button
                onClick={() => {
                  setOpen(false);
                  setConfirmDestroy(true);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-accent-red hover:bg-surface-700"
              >
                Destroy
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={confirmDestroy}
        title="Destroy Instance"
        message={`Are you sure you want to destroy "${instance.name}"? This action cannot be undone.`}
        confirmLabel="Destroy"
        confirmVariant="danger"
        isLoading={destroy.isPending}
        onConfirm={() => {
          destroy.mutate(instance.id, {
            onSuccess: () => {
              setConfirmDestroy(false);
              toast.success("Instance destroyed");
            },
          });
        }}
        onCancel={() => setConfirmDestroy(false)}
      />
    </>
  );
}

export default function InstancesPage() {
  const { data: instances, isLoading } = useInstances();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Instances</h1>
        <Link
          href="/dashboard/instances/new"
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New Instance
        </Link>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : !instances || instances.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 py-8"
          >
            {/* Hero empty state */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="relative"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-green/10 ring-1 ring-surface-800">
                  <Server className="h-10 w-10 text-brand-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface-900 ring-2 ring-surface-800">
                  <Zap className="h-4 w-4 text-accent-amber" />
                </div>
              </motion.div>

              <h2 className="mt-6 text-xl font-bold text-white">
                No instances yet
              </h2>
              <p className="mt-2 max-w-md text-sm text-surface-400">
                Launch your first GPU instance in under 60 seconds. Choose from
                the latest NVIDIA GPUs and start training or inferencing right
                away.
              </p>
              <Link
                href="/dashboard/instances/new"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" />
                Launch Your First Instance
              </Link>
            </div>

            {/* Quick launch GPUs */}
            <div>
              <h3 className="mb-3 text-center text-sm font-semibold text-surface-300">
                Popular Configurations
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    gpu: "H100",
                    spec: "80GB SXM · 1x GPU",
                    price: "$2.49/hr",
                    color: "text-accent-green",
                    bg: "bg-accent-green/10",
                    borderHover: "hover:border-accent-green/40",
                  },
                  {
                    gpu: "H200",
                    spec: "141GB SXM · 1x GPU",
                    price: "$3.99/hr",
                    color: "text-brand-400",
                    bg: "bg-brand-400/10",
                    borderHover: "hover:border-brand-400/40",
                  },
                  {
                    gpu: "B200",
                    spec: "192GB SXM · 1x GPU",
                    price: "$4.99/hr",
                    color: "text-accent-purple",
                    bg: "bg-accent-purple/10",
                    borderHover: "hover:border-accent-purple/40",
                  },
                ].map((cfg) => (
                  <Link
                    key={cfg.gpu}
                    href={`/dashboard/instances/new?gpu=${cfg.gpu}`}
                    className={`group flex items-center gap-4 rounded-xl border border-surface-800 bg-surface-900 p-4 transition-all ${cfg.borderHover}`}
                  >
                    <div className={`rounded-lg p-3 ${cfg.bg}`}>
                      <Zap className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">
                        NVIDIA {cfg.gpu}
                      </p>
                      <p className="text-xs text-surface-500">{cfg.spec}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-surface-300">
                        {cfg.price}
                      </p>
                      <ArrowRight className="ml-auto mt-1 h-3.5 w-3.5 text-surface-600 transition-colors group-hover:text-brand-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
              <h3 className="text-sm font-semibold text-white">
                How it works
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                  {
                    icon: KeyRound,
                    title: "1. Add your SSH key",
                    desc: "Upload your public key in Settings for secure access to your instances.",
                    color: "text-brand-400",
                    bg: "bg-brand-400/10",
                  },
                  {
                    icon: Monitor,
                    title: "2. Pick a GPU",
                    desc: "Select from H100, H200, B200, and more. Choose the right fit for your workload.",
                    color: "text-accent-amber",
                    bg: "bg-accent-amber/10",
                  },
                  {
                    icon: Rocket,
                    title: "3. Launch & connect",
                    desc: "Your instance spins up in seconds. SSH in and start working immediately.",
                    color: "text-accent-green",
                    bg: "bg-accent-green/10",
                  },
                ].map((step) => (
                  <div key={step.title} className="flex gap-3">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${step.bg}`}
                    >
                      <step.icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-xs text-surface-500">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="hidden items-center gap-4 px-4 text-xs font-medium uppercase tracking-wider text-surface-500 md:grid md:grid-cols-7">
              <span className="col-span-2">Name</span>
              <span>Status</span>
              <span>IP Address</span>
              <span>Uptime</span>
              <span>Cost</span>
              <span />
            </div>

            {(instances as unknown as InstanceRow[]).map((instance) => (
              <div
                key={instance.id}
                className="rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-3 transition-colors hover:border-surface-700"
              >
                <div className="grid items-center gap-4 md:grid-cols-7">
                  <div className="col-span-2">
                    <Link
                      href={`/dashboard/instances/${instance.id}`}
                      className="font-medium text-white hover:text-brand-400"
                    >
                      {instance.name}
                    </Link>
                    <p className="text-xs text-surface-500">
                      {instance.gpuType} {instance.gpuCount > 1 ? `x${instance.gpuCount}` : ""} &middot; ${instance.pricePerHour.toFixed(2)}/hr
                    </p>
                  </div>

                  <div>
                    <StatusBadge status={instance.status} />
                  </div>

                  <div className="flex items-center gap-1">
                    {instance.ipAddress ? (
                      <>
                        <span className="font-mono text-xs text-surface-300">
                          {instance.ipAddress}
                        </span>
                        <CopyButton text={instance.ipAddress} label="" className="text-xs" />
                      </>
                    ) : (
                      <span className="text-xs text-surface-600">-</span>
                    )}
                  </div>

                  <div className="text-sm text-surface-300">
                    {formatUptime(instance.startedAt, instance.status)}
                  </div>

                  <div className="text-sm font-medium text-surface-200">
                    ${instance.totalBilledAmount.toFixed(2)}
                  </div>

                  <div className="flex justify-end">
                    <ActionsDropdown instance={instance} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
