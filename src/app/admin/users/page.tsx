"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, UserPlus, Shield, DollarSign } from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  creditsBalance: number;
  instanceCount: number;
  createdAt: string;
}

async function fetchUsers(search: string) {
  const url = search
    ? `/api/v1/admin/users?search=${encodeURIComponent(search)}`
    : "/api/v1/admin/users";
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to load");
  return data.data as UserData[];
}

function AdjustCreditsModal({
  user,
  onClose,
}: {
  user: UserData;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const adjust = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/admin/credits/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed");
      return data.data;
    },
    onSuccess: (data) => {
      toast.success(`Credits updated. New balance: $${data.newBalance.toFixed(2)}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-surface-700 bg-surface-900 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">Adjust Credits</h3>
        <p className="mt-1 text-sm text-surface-400">
          {user.name ?? user.email} — Current: ${user.creditsBalance.toFixed(2)}
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-surface-400">
              Amount (positive to add, negative to deduct)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50 or -10"
              className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-surface-400">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Promotional credit"
              className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-surface-700 py-2 text-sm font-medium text-surface-300 hover:border-surface-600 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => adjust.mutate()}
            disabled={!amount || !reason || adjust.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {adjust.isPending ? <Spinner className="h-4 w-4" /> : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [adjustUser, setAdjustUser] = useState<UserData | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", debouncedSearch],
    queryFn: () => fetchUsers(debouncedSearch),
    staleTime: 30_000,
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    // Simple debounce
    clearTimeout((globalThis as unknown as Record<string, ReturnType<typeof setTimeout>>).__searchTimer);
    (globalThis as unknown as Record<string, ReturnType<typeof setTimeout>>).__searchTimer = setTimeout(
      () => setDebouncedSearch(val),
      300
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <span className="text-sm text-surface-400">
          {users?.length ?? 0} users
        </span>
      </div>

      {/* Search */}
      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="mt-8 flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-surface-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800 bg-surface-900/50">
                <th className="px-4 py-3 text-left font-medium text-surface-400">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">
                  Role
                </th>
                <th className="px-4 py-3 text-right font-medium text-surface-400">
                  Credits
                </th>
                <th className="px-4 py-3 text-right font-medium text-surface-400">
                  Instances
                </th>
                <th className="px-4 py-3 text-left font-medium text-surface-400">
                  Joined
                </th>
                <th className="px-4 py-3 text-right font-medium text-surface-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-surface-800/50 transition-colors hover:bg-surface-900/30"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">
                        {user.name ?? "—"}
                      </p>
                      <p className="text-xs text-surface-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        user.role === "ADMIN"
                          ? "bg-accent-red/10 text-accent-red"
                          : "bg-surface-700/50 text-surface-300"
                      }`}
                    >
                      {user.role === "ADMIN" && <Shield className="h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white">
                    ${user.creditsBalance.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-surface-300">
                    {user.instanceCount}
                  </td>
                  <td className="px-4 py-3 text-surface-400">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setAdjustUser(user)}
                      className="inline-flex items-center gap-1 rounded-lg bg-surface-800 px-3 py-1.5 text-xs font-medium text-surface-300 transition-colors hover:bg-surface-700 hover:text-white"
                    >
                      <DollarSign className="h-3 w-3" />
                      Adjust Credits
                    </button>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-surface-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust modal */}
      {adjustUser && (
        <AdjustCreditsModal
          user={adjustUser}
          onClose={() => setAdjustUser(null)}
        />
      )}
    </div>
  );
}
