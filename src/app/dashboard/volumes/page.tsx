"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { SkeletonRow } from "@/components/shared/Skeleton";
import {
  HardDrive,
  Plus,
  Trash2,
  Link,
  Unlink,
  Database,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Volume {
  id: string;
  name: string;
  sizeGb: number;
  status: "attached" | "detached";
  attachedInstance: string | null;
  region: string;
  createdAt: string;
}

interface CreateVolumePayload {
  name: string;
  sizeGb: number;
  region: string;
}

const REGIONS = [
  { value: "us-east-1", label: "US East (Virginia)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "EU West (Ireland)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function VolumeStatusBadge({ status }: { status: Volume["status"] }) {
  const isAttached = status === "attached";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isAttached
          ? "bg-accent-green/10 text-accent-green"
          : "bg-surface-800 text-surface-400"
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          isAttached ? "bg-accent-green" : "bg-surface-500"
        }`}
      />
      {isAttached ? "Attached" : "Detached"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Create Volume Modal                                                       */
/* -------------------------------------------------------------------------- */

function CreateVolumeModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [sizeGb, setSizeGb] = useState(100);
  const [region, setRegion] = useState(REGIONS[0]?.value ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Volume name is required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/volumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), sizeGb, region } satisfies CreateVolumePayload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Failed to create volume");
      }
      toast.success("Volume created");
      setName("");
      setSizeGb(100);
      setRegion(REGIONS[0]?.value ?? "");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-xl border border-surface-700 bg-surface-900 p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Create Volume</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-surface-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-training-data"
              className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white placeholder-surface-500 outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>

          {/* Size slider */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-300">
              Size &mdash; <span className="text-brand-400">{sizeGb} GB</span>
            </label>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={sizeGb}
              onChange={(e) => setSizeGb(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="mt-1 flex justify-between text-xs text-surface-500">
              <span>50 GB</span>
              <span>2000 GB</span>
            </div>
          </div>

          {/* Region select */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-300">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-medium text-surface-300 hover:bg-surface-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Volume"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function VolumesPage() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Volume | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchVolumes = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/volumes");
      if (!res.ok) throw new Error("Failed to fetch volumes");
      const data = await res.json();
      setVolumes(data);
    } catch {
      toast.error("Could not load volumes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVolumes(); }, [fetchVolumes]);

  /* ------ Actions ------ */

  const handleAttach = async (volume: Volume) => {
    const instanceId = window.prompt("Enter the instance ID to attach to:");
    if (!instanceId?.trim()) return;
    setActionLoading(volume.id);
    try {
      const res = await fetch(`/api/v1/volumes/${volume.id}/attach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId: instanceId.trim() }),
      });
      if (!res.ok) throw new Error("Failed to attach volume");
      toast.success(`Volume "${volume.name}" attached`);
      fetchVolumes();
    } catch {
      toast.error("Could not attach volume");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDetach = async (volume: Volume) => {
    setActionLoading(volume.id);
    try {
      const res = await fetch(`/api/v1/volumes/${volume.id}/detach`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to detach volume");
      toast.success(`Volume "${volume.name}" detached`);
      fetchVolumes();
    } catch {
      toast.error("Could not detach volume");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (volume: Volume) => {
    setActionLoading(volume.id);
    try {
      const res = await fetch(`/api/v1/volumes/${volume.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete volume");
      toast.success(`Volume "${volume.name}" deleted`);
      setConfirmDelete(null);
      fetchVolumes();
    } catch {
      toast.error("Could not delete volume");
    } finally {
      setActionLoading(null);
    }
  };

  /* ------ Render ------ */

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Volumes</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Create Volume
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : volumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-green/10 ring-1 ring-surface-800">
                <HardDrive className="h-10 w-10 text-brand-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface-900 ring-2 ring-surface-800">
                <Database className="h-4 w-4 text-accent-amber" />
              </div>
            </motion.div>
            <h2 className="mt-6 text-xl font-bold text-white">No volumes yet</h2>
            <p className="mt-2 max-w-md text-sm text-surface-400">
              Create your first persistent volume to store datasets, checkpoints,
              and model weights across instance restarts.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" />
              Create Your First Volume
            </button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {/* Table header */}
            <div className="hidden items-center gap-4 px-4 text-xs font-medium uppercase tracking-wider text-surface-500 md:grid md:grid-cols-8">
              <span className="col-span-2">Name</span>
              <span>Size</span>
              <span>Status</span>
              <span>Instance</span>
              <span>Region</span>
              <span>Created</span>
              <span />
            </div>

            {/* Rows */}
            <AnimatePresence initial={false}>
              {volumes.map((volume) => (
                <motion.div
                  key={volume.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-lg border border-surface-800 bg-surface-900/50 px-4 py-3 transition-colors hover:border-surface-700"
                >
                  <div className="grid items-center gap-4 md:grid-cols-8">
                    {/* Name */}
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface-800">
                        <HardDrive className="h-4 w-4 text-brand-400" />
                      </div>
                      <span className="truncate font-medium text-white">{volume.name}</span>
                    </div>

                    {/* Size */}
                    <div className="text-sm text-surface-300">{volume.sizeGb} GB</div>

                    {/* Status */}
                    <div>
                      <VolumeStatusBadge status={volume.status} />
                    </div>

                    {/* Instance */}
                    <div className="truncate text-sm font-mono text-surface-400">
                      {volume.attachedInstance ?? <span className="text-surface-600">&mdash;</span>}
                    </div>

                    {/* Region */}
                    <div className="text-sm text-surface-400">{volume.region}</div>

                    {/* Created */}
                    <div className="text-sm text-surface-400">{formatDate(volume.createdAt)}</div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1">
                      {volume.status === "detached" ? (
                        <button
                          onClick={() => handleAttach(volume)}
                          disabled={actionLoading === volume.id}
                          title="Attach to instance"
                          className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-800 hover:text-brand-400 disabled:opacity-50"
                        >
                          <Link className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDetach(volume)}
                          disabled={actionLoading === volume.id}
                          title="Detach from instance"
                          className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-800 hover:text-accent-amber disabled:opacity-50"
                        >
                          <Unlink className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete(volume)}
                        disabled={actionLoading === volume.id || volume.status === "attached"}
                        title={volume.status === "attached" ? "Detach before deleting" : "Delete volume"}
                        className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-800 hover:text-accent-red disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <CreateVolumeModal
            open={showCreate}
            onClose={() => setShowCreate(false)}
            onCreated={fetchVolumes}
          />
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Volume"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? All data on this volume will be permanently lost.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        isLoading={actionLoading === confirmDelete?.id}
        onConfirm={() => { if (confirmDelete) handleDelete(confirmDelete); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
