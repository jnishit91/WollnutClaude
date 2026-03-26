"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useInstance, useInstanceAction, useDestroyInstance } from "@/lib/hooks/use-instances";
import { useAuth } from "@/lib/hooks/use-auth";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CopyButton } from "@/components/shared/CopyButton";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Spinner } from "@/components/shared/Spinner";
import { SkeletonCard } from "@/components/shared/Skeleton";
import type { InstanceStatus } from "@/types/instance.types";
import {
  Server,
  Terminal,
  Cpu,
  HardDrive,
  DollarSign,
  Clock,
  Play,
  Square,
  RotateCcw,
  Trash2,
  ExternalLink,
} from "lucide-react";

function formatUptime(startedAt: string | null, status: string): string {
  if (!startedAt || status !== "RUNNING") return "-";
  const ms = Date.now() - new Date(startedAt).getTime();
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h ${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export default function InstanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const { data: instance, isLoading } = useInstance(id);
  const action = useInstanceAction(id);
  const destroy = useDestroyInstance();
  const [confirmDestroy, setConfirmDestroy] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 lg:px-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-surface-500">Instance not found</p>
      </div>
    );
  }

  const inst = instance as Record<string, unknown>;
  const status = inst.status as InstanceStatus;
  const isRunning = status === "RUNNING";
  const isStopped = status === "STOPPED";
  const pricePerHour = inst.pricePerHour as number;
  const pricePerMinute = inst.pricePerMinute as number;
  const totalBilled = inst.totalBilledAmount as number;
  const ipAddress = inst.ipAddress as string | null;
  const sshPort = (inst.sshPort as number) || 22;
  const jupyterUrl = inst.jupyterUrl as string | null;
  const sshKey = inst.sshKey as { id: string; name: string; fingerprint: string } | null;
  const volumes = (inst.volumes as { id: string; name: string; sizeGb: number; status: string }[]) || [];
  const creditsBalance = user?.creditsBalance ?? 0;
  const estimatedHours = pricePerHour > 0 ? creditsBalance / pricePerHour : 0;

  const handleAction = (type: "start" | "stop" | "reboot") => {
    action.mutate(type, {
      onSuccess: () => toast.success(`Instance ${type} initiated`),
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {inst.name as string}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={status} />
            <span className="text-sm text-surface-500">
              {inst.gpuType as string}
              {(inst.gpuCount as number) > 1 ? ` x${inst.gpuCount}` : ""}
            </span>
            <span className="text-sm text-surface-500">
              {inst.e2eRegion as string}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isStopped && (
            <button
              onClick={() => handleAction("start")}
              disabled={action.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-accent-green px-3 py-2 text-sm font-medium text-white hover:bg-accent-green/90 disabled:opacity-50"
            >
              {action.isPending ? <Spinner className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              Start
            </button>
          )}
          {isRunning && (
            <>
              <button
                onClick={() => handleAction("stop")}
                disabled={action.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-surface-800 px-3 py-2 text-sm font-medium text-surface-200 hover:bg-surface-700 disabled:opacity-50"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
              <button
                onClick={() => handleAction("reboot")}
                disabled={action.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-surface-800 px-3 py-2 text-sm font-medium text-surface-200 hover:bg-surface-700 disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reboot
              </button>
            </>
          )}
          <button
            onClick={() => setConfirmDestroy(true)}
            className="flex items-center gap-1.5 rounded-lg bg-accent-red/10 px-3 py-2 text-sm font-medium text-accent-red hover:bg-accent-red/20"
          >
            <Trash2 className="h-4 w-4" />
            Destroy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Connection Details */}
        {isRunning && ipAddress && (
          <div className="rounded-xl border border-surface-800 bg-surface-900 p-6 lg:col-span-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Terminal className="h-4 w-4" />
              Connection Details
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-surface-800/50 px-4 py-3">
                <div>
                  <span className="text-xs text-surface-500">SSH Command</span>
                  <p className="mt-0.5 font-mono text-sm text-white">
                    ssh root@{ipAddress} -p {sshPort}
                  </p>
                </div>
                <CopyButton
                  text={`ssh root@${ipAddress} -p ${sshPort}`}
                  label="Copy"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-800/50 px-4 py-3">
                <div>
                  <span className="text-xs text-surface-500">IP Address</span>
                  <p className="mt-0.5 font-mono text-sm text-white">
                    {ipAddress}
                  </p>
                </div>
                <CopyButton text={ipAddress} label="Copy" />
              </div>
              {jupyterUrl && (
                <div className="flex items-center justify-between rounded-lg bg-surface-800/50 px-4 py-3">
                  <div>
                    <span className="text-xs text-surface-500">
                      Jupyter Notebook
                    </span>
                    <p className="mt-0.5 text-sm text-brand-400">
                      {jupyterUrl}
                    </p>
                  </div>
                  <a
                    href={jupyterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specs */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Cpu className="h-4 w-4" />
            Specifications
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-surface-500">GPU</span>
              <p className="font-medium text-white">{inst.gpuType as string}</p>
            </div>
            <div>
              <span className="text-surface-500">VRAM</span>
              <p className="font-medium text-white">{inst.vram as string}</p>
            </div>
            <div>
              <span className="text-surface-500">vCPUs</span>
              <p className="font-medium text-white">{inst.vcpus as number}</p>
            </div>
            <div>
              <span className="text-surface-500">RAM</span>
              <p className="font-medium text-white">{inst.ram as string}</p>
            </div>
            <div>
              <span className="text-surface-500">Storage</span>
              <p className="font-medium text-white">{inst.storageGb as number} GB</p>
            </div>
            <div>
              <span className="text-surface-500">Uptime</span>
              <p className="font-medium text-white">
                {formatUptime(inst.startedAt as string | null, status)}
              </p>
            </div>
          </div>
          {sshKey && (
            <div className="mt-4 border-t border-surface-800 pt-4">
              <span className="text-xs text-surface-500">SSH Key</span>
              <p className="text-sm text-white">{sshKey.name}</p>
              <p className="font-mono text-xs text-surface-500">
                {sshKey.fingerprint}
              </p>
            </div>
          )}
        </div>

        {/* Billing */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <DollarSign className="h-4 w-4" />
            Billing
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-400">Price / hour</span>
              <span className="font-medium text-white">
                ${pricePerHour.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Price / minute</span>
              <span className="text-surface-300">
                ${pricePerMinute.toFixed(4)}
              </span>
            </div>
            <hr className="border-surface-800" />
            <div className="flex justify-between">
              <span className="text-surface-400">Total billed</span>
              <span className="text-lg font-bold text-white">
                ${totalBilled.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Your balance</span>
              <span className="font-medium text-accent-green">
                ${creditsBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Est. remaining</span>
              <span className="text-surface-300">
                {estimatedHours.toFixed(1)} hours
              </span>
            </div>
          </div>
        </div>

        {/* Volumes */}
        {volumes.length > 0 && (
          <div className="rounded-xl border border-surface-800 bg-surface-900 p-6 lg:col-span-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <HardDrive className="h-4 w-4" />
              Attached Volumes
            </h3>
            <div className="mt-4 space-y-2">
              {volumes.map((vol) => (
                <div
                  key={vol.id}
                  className="flex items-center justify-between rounded-lg bg-surface-800/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {vol.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {vol.sizeGb} GB &middot; {vol.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6 lg:col-span-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="h-4 w-4" />
            Timeline
          </h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-400">Created</span>
              <span className="text-surface-300">
                {new Date(inst.createdAt as string).toLocaleString()}
              </span>
            </div>
            {Boolean(inst.startedAt) && (
              <div className="flex justify-between">
                <span className="text-surface-400">Last started</span>
                <span className="text-surface-300">
                  {new Date(inst.startedAt as string).toLocaleString()}
                </span>
              </div>
            )}
            {Boolean(inst.stoppedAt) && (
              <div className="flex justify-between">
                <span className="text-surface-400">Last stopped</span>
                <span className="text-surface-300">
                  {new Date(inst.stoppedAt as string).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmDestroy}
        title="Destroy Instance"
        message={`Are you sure you want to destroy "${inst.name}"? This action cannot be undone and all data will be lost.`}
        confirmLabel="Destroy"
        confirmVariant="danger"
        isLoading={destroy.isPending}
        onConfirm={() => {
          destroy.mutate(id, {
            onSuccess: () => {
              toast.success("Instance destroyed");
              router.push("/dashboard/instances");
            },
          });
        }}
        onCancel={() => setConfirmDestroy(false)}
      />
    </div>
  );
}
