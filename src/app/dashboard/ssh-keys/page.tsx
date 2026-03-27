"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Key, Plus, Trash2, Fingerprint, Calendar, Shield } from "lucide-react";
import type { SSHKey } from "@/types/user.types";

export default function SSHKeysPage() {
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
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SSH Keys</h1>
          <p className="mt-1 text-sm text-surface-400">
            Manage SSH keys for secure instance access
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add SSH Key
        </button>
      </div>

      {/* Add key form */}
      {showAdd && (
        <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h3 className="text-sm font-semibold text-white">Add New SSH Key</h3>
          <p className="mt-1 text-xs text-surface-500">
            Generate a key with:{" "}
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-brand-400">
              ssh-keygen -t ed25519 -C &quot;your@email.com&quot;
            </code>
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-surface-300">
                Key Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
                placeholder="e.g. my-macbook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300">
                Public Key
              </label>
              <textarea
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 font-mono text-xs text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
                placeholder="ssh-ed25519 AAAA... or ssh-rsa AAAA..."
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={isAdding || !newName || !newKey}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add Key"}
              </button>
              <button
                onClick={() => {
                  setShowAdd(false);
                  setNewName("");
                  setNewKey("");
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
            <Key className="mx-auto h-12 w-12 text-surface-600" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No SSH keys yet
            </h3>
            <p className="mt-1 text-sm text-surface-400">
              Add an SSH key to connect securely to your GPU instances.
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Add Your First Key
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
                  <Key className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{key.name}</span>
                    {key.isDefault && (
                      <span className="rounded bg-brand-600/20 px-1.5 py-0.5 text-[10px] font-bold text-brand-400">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-surface-500">
                    <span className="flex items-center gap-1">
                      <Fingerprint className="h-3 w-3" />
                      {key.fingerprint}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Added {new Date(key.createdAt).toLocaleDateString()}
                    </span>
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
          About SSH Keys
        </div>
        <p className="mt-2 text-sm text-surface-400">
          SSH keys provide secure, passwordless access to your GPU instances.
          When you launch an instance, select which SSH keys to authorize. Your
          private key stays on your machine — only the public key is stored.
        </p>
      </div>
    </div>
  );
}
