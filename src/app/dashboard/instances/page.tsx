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
import { Server, Plus, MoreVertical } from "lucide-react";

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
          <EmptyState
            icon={<Server className="h-12 w-12" />}
            title="No instances yet"
            description="Launch your first GPU instance to get started with AI/ML workloads."
            actionLabel="Launch your first GPU instance"
            actionHref="/dashboard/instances/new"
          />
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
