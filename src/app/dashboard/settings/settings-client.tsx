"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { SSHKey, ApiKeyInfo, ApiKeyCreated } from "@/types/user.types";

// ─── Profile Section ────────────────────────────

function ProfileSection() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error?.message || "Failed to update profile");
        return;
      }

      await update();
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-surface-800 bg-surface-900 p-6">
      <h2 className="text-lg font-semibold text-white">Profile</h2>
      <p className="mt-1 text-sm text-surface-400">
        Manage your account information
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-300">
            Email
          </label>
          <input
            type="email"
            value={session?.user?.email ?? ""}
            disabled
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/30 px-3 py-2.5 text-sm text-surface-500"
          />
          <p className="mt-1 text-xs text-surface-600">
            Email cannot be changed
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-300">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus-ring"
            placeholder="Your name"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || name === session?.user?.name}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>

          <div className="text-sm text-surface-500">
            Role:{" "}
            <span className="font-medium text-surface-300">
              {session?.user?.role ?? "USER"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SSH Keys Section ───────────────────────────

function SSHKeysSection() {
  const [keys, setKeys] = useState<SSHKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKey, setNewKey] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/ssh-keys");
      const data = await res.json();
      if (data.success) setKeys(data.data);
    } catch {
      toast.error("Failed to load SSH keys");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleAdd = async () => {
    if (!newName || !newKey) return;
    setIsAdding(true);

    try {
      const res = await fetch("/api/v1/ssh-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, publicKey: newKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.message || "Failed to add SSH key");
        return;
      }

      toast.success("SSH key added");
      setNewName("");
      setNewKey("");
      setShowAdd(false);
      fetchKeys();
    } catch {
      toast.error("Failed to add SSH key");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, keyName: string) => {
    if (!confirm(`Delete SSH key "${keyName}"?`)) return;

    try {
      const res = await fetch(`/api/v1/ssh-keys/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete SSH key");
        return;
      }
      toast.success("SSH key deleted");
      fetchKeys();
    } catch {
      toast.error("Failed to delete SSH key");
    }
  };

  return (
    <section className="rounded-xl border border-surface-800 bg-surface-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">SSH Keys</h2>
          <p className="mt-1 text-sm text-surface-400">
            Manage SSH keys for instance access
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="rounded-lg bg-surface-800 px-3 py-1.5 text-sm font-medium text-surface-200 transition-colors hover:bg-surface-700"
        >
          {showAdd ? "Cancel" : "Add key"}
        </button>
      </div>

      {showAdd && (
        <div className="mt-4 space-y-3 rounded-lg border border-surface-700 bg-surface-800/50 p-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="block w-full rounded-lg border border-surface-700 bg-surface-900/50 px-3 py-2 text-sm text-white placeholder-surface-500 focus-ring"
            placeholder="Key name (e.g. my-laptop)"
          />
          <textarea
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="block w-full rounded-lg border border-surface-700 bg-surface-900/50 px-3 py-2 font-mono text-xs text-white placeholder-surface-500 focus-ring"
            placeholder="ssh-ed25519 AAAA... or ssh-rsa AAAA..."
            rows={3}
          />
          <button
            onClick={handleAdd}
            disabled={isAdding || !newName || !newKey}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {isAdding ? "Adding..." : "Add SSH key"}
          </button>
        </div>
      )}

      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        ) : keys.length === 0 ? (
          <p className="py-8 text-center text-sm text-surface-500">
            No SSH keys added yet
          </p>
        ) : (
          <div className="space-y-2">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between rounded-lg border border-surface-800 bg-surface-800/30 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {key.name}
                    </span>
                    {key.isDefault && (
                      <span className="rounded bg-brand-600/20 px-1.5 py-0.5 text-xs text-brand-400">
                        default
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate font-mono text-xs text-surface-500">
                    {key.fingerprint}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(key.id, key.name)}
                  className="ml-4 text-sm text-surface-500 transition-colors hover:text-accent-red"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── API Keys Section ───────────────────────────

function APIKeysSection() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newKeyPlaintext, setNewKeyPlaintext] = useState<string | null>(null);

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

  const handleAdd = async () => {
    if (!newName) return;
    setIsAdding(true);

    try {
      const res = await fetch("/api/v1/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, scopes: ["all"] }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.message || "Failed to create API key");
        return;
      }

      setNewKeyPlaintext((data.data as ApiKeyCreated).plaintextKey);
      setNewName("");
      fetchKeys();
    } catch {
      toast.error("Failed to create API key");
    } finally {
      setIsAdding(false);
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

  const copyKey = () => {
    if (newKeyPlaintext) {
      navigator.clipboard.writeText(newKeyPlaintext);
      toast.success("API key copied to clipboard");
    }
  };

  return (
    <section className="rounded-xl border border-surface-800 bg-surface-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">API Keys</h2>
          <p className="mt-1 text-sm text-surface-400">
            Manage API keys for programmatic access
          </p>
        </div>
        <button
          onClick={() => {
            setShowAdd(!showAdd);
            setNewKeyPlaintext(null);
          }}
          className="rounded-lg bg-surface-800 px-3 py-1.5 text-sm font-medium text-surface-200 transition-colors hover:bg-surface-700"
        >
          {showAdd ? "Cancel" : "Create key"}
        </button>
      </div>

      {newKeyPlaintext && (
        <div className="mt-4 rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-4">
          <p className="text-sm font-medium text-accent-amber">
            Copy your API key now. It won&apos;t be shown again.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-surface-800 px-3 py-2 font-mono text-xs text-white">
              {newKeyPlaintext}
            </code>
            <button
              onClick={copyKey}
              className="rounded-lg bg-surface-700 px-3 py-2 text-xs font-medium text-white hover:bg-surface-600"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => {
              setNewKeyPlaintext(null);
              setShowAdd(false);
            }}
            className="mt-2 text-xs text-surface-500 hover:text-surface-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {showAdd && !newKeyPlaintext && (
        <div className="mt-4 flex items-end gap-3 rounded-lg border border-surface-700 bg-surface-800/50 p-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-surface-300">
              Key name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-900/50 px-3 py-2 text-sm text-white placeholder-surface-500 focus-ring"
              placeholder="e.g. production-server"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding || !newName}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {isAdding ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        ) : keys.length === 0 ? (
          <p className="py-8 text-center text-sm text-surface-500">
            No API keys created yet
          </p>
        ) : (
          <div className="space-y-2">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between rounded-lg border border-surface-800 bg-surface-800/30 px-4 py-3"
              >
                <div className="min-w-0">
                  <span className="text-sm font-medium text-white">
                    {key.name}
                  </span>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-surface-500">
                    <span className="font-mono">{key.keyPrefix}...</span>
                    <span>
                      {key.lastUsedAt
                        ? `Used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                        : "Never used"}
                    </span>
                    {key.expiresAt && (
                      <span>
                        Expires{" "}
                        {new Date(key.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(key.id, key.name)}
                  className="ml-4 text-sm text-surface-500 transition-colors hover:text-accent-red"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Settings Page ─────────────────────────

export function SettingsClient() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-surface-400">
          Manage your account, SSH keys, and API access
        </p>
      </div>

      <ProfileSection />
      <SSHKeysSection />
      <APIKeysSection />
    </div>
  );
}
