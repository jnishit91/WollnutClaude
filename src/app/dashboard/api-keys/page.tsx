"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Code,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Calendar,
  Shield,
  Clock,
} from "lucide-react";
import type { ApiKeyInfo, ApiKeyCreated } from "@/types/user.types";

const SCOPE_OPTIONS = [
  { value: "all", label: "Full Access", description: "Complete API access" },
  {
    value: "instances",
    label: "Instances",
    description: "Create, manage, and delete instances",
  },
  {
    value: "billing",
    label: "Billing",
    description: "View balance and transactions",
  },
  {
    value: "ssh-keys",
    label: "SSH Keys",
    description: "Manage SSH keys",
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["all"]);
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreated, setNewlyCreated] = useState<ApiKeyCreated | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/api-keys");
      const data = await res.json();
      if (data.success) setKeys(data.data);
    } catch {
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async () => {
    if (!newName) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/v1/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, scopes: selectedScopes }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to create API key");
        return;
      }
      setNewlyCreated(data.data);
      setNewName("");
      setSelectedScopes(["all"]);
      setShowCreate(false);
      fetchKeys();
    } catch {
      toast.error("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string, keyName: string) => {
    if (!confirm(`Delete API key "${keyName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/v1/api-keys/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete API key");
        return;
      }
      toast.success("API key deleted");
      fetchKeys();
    } catch {
      toast.error("Failed to delete API key");
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleScope = (scope: string) => {
    if (scope === "all") {
      setSelectedScopes(["all"]);
      return;
    }
    const without = selectedScopes.filter((s) => s !== "all" && s !== scope);
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(without.length > 0 ? without : ["all"]);
    } else {
      setSelectedScopes([...without, scope]);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="mt-1 text-sm text-surface-400">
            Manage API keys for programmatic access
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Create API Key
        </button>
      </div>

      {/* Newly created key warning */}
      {newlyCreated && (
        <div className="mt-6 rounded-xl border border-accent-amber/30 bg-accent-amber/5 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-accent-amber">
            <Shield className="h-4 w-4" />
            Save your API key now — it won&apos;t be shown again
          </div>
          <p className="mt-1 text-xs text-surface-400">
            Copy this key and store it securely. For security, we only show the
            full key once.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 rounded-lg border border-surface-700 bg-surface-900 px-3 py-2.5 font-mono text-xs text-brand-400">
              {newlyCreated.plaintextKey}
            </code>
            <button
              onClick={() => copyToClipboard(newlyCreated.plaintextKey)}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2.5 text-xs font-medium text-white hover:bg-brand-700"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setNewlyCreated(null)}
            className="mt-3 text-xs text-surface-500 underline hover:text-surface-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h3 className="text-sm font-semibold text-white">
            Create New API Key
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-300">
                Key Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
                placeholder="e.g. production-server"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300">
                Permissions
              </label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {SCOPE_OPTIONS.map((scope) => (
                  <button
                    key={scope.value}
                    onClick={() => toggleScope(scope.value)}
                    className={`flex flex-col rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      selectedScopes.includes(scope.value)
                        ? "border-brand-500 bg-brand-600/10"
                        : "border-surface-700 bg-surface-800/50 hover:border-surface-600"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        selectedScopes.includes(scope.value)
                          ? "text-brand-400"
                          : "text-surface-300"
                      }`}
                    >
                      {scope.label}
                    </span>
                    <span className="text-xs text-surface-500">
                      {scope.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={isCreating || !newName}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create Key"}
              </button>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setNewName("");
                  setSelectedScopes(["all"]);
                }}
                className="rounded-lg border border-surface-700 px-4 py-2 text-sm font-medium text-surface-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys list */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        ) : keys.length === 0 ? (
          <div className="rounded-xl border border-surface-800 bg-surface-900 py-16 text-center">
            <Code className="mx-auto h-12 w-12 text-surface-600" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No API keys yet
            </h3>
            <p className="mt-1 text-sm text-surface-400">
              Create an API key to access Wollnut Labs programmatically.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Create Your First Key
            </button>
          </div>
        ) : (
          keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between rounded-xl border border-surface-800 bg-surface-900 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10">
                  <Code className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{key.name}</span>
                    <code className="rounded bg-surface-800 px-1.5 py-0.5 text-[11px] text-surface-400">
                      {key.keyPrefix}...
                    </code>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-surface-500">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {key.scopes.join(", ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created{" "}
                      {new Date(key.createdAt).toLocaleDateString()}
                    </span>
                    {key.lastUsedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last used{" "}
                        {new Date(key.lastUsedAt).toLocaleDateString()}
                      </span>
                    )}
                    {key.expiresAt && (
                      <span className="flex items-center gap-1 text-accent-amber">
                        Expires{" "}
                        {new Date(key.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(key.id, key.name)}
                className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-accent-red/10 hover:text-accent-red"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-8 rounded-xl border border-surface-800 bg-surface-900/50 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <Shield className="h-4 w-4 text-brand-400" />
          About API Keys
        </div>
        <p className="mt-2 text-sm text-surface-400">
          API keys allow you to interact with the Wollnut Labs API
          programmatically. Use them to create instances, manage volumes, and
          automate your GPU workflows. Keep your keys secure — treat them like
          passwords.
        </p>
        <div className="mt-3">
          <code className="rounded-lg bg-surface-800 px-3 py-1.5 text-xs text-surface-300">
            curl -H &quot;Authorization: Bearer wl_...&quot;
            https://api.wollnutlabs.com/v1/instances
          </code>
        </div>
      </div>
    </div>
  );
}
