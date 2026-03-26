"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useBalance,
  useUsageSummary,
  useTransactions,
  useInvoices,
  useAutoRecharge,
} from "@/lib/hooks/use-billing";
import { AddCreditsModal } from "@/components/billing/AddCreditsModal";
import { Spinner } from "@/components/shared/Spinner";

function TransactionTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    CREDIT_PURCHASE: "bg-accent-green/10 text-accent-green",
    USAGE_DEDUCTION: "bg-accent-red/10 text-accent-red",
    REFUND: "bg-brand-600/10 text-brand-400",
    BONUS: "bg-accent-amber/10 text-accent-amber",
    PROMO: "bg-purple-500/10 text-purple-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
        styles[type] ?? "bg-surface-800 text-surface-400"
      }`}
    >
      {type.replace(/_/g, " ")}
    </span>
  );
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingPageContent />
    </Suspense>
  );
}

function BillingPageContent() {
  const searchParams = useSearchParams();
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [chartView, setChartView] = useState<"day" | "gpu" | "instance">("day");
  const [txPage, setTxPage] = useState(1);
  const [txFilter, setTxFilter] = useState<string | undefined>();

  // Auto-recharge form state
  const [arEnabled, setArEnabled] = useState(false);
  const [arAmount, setArAmount] = useState("");
  const [arThreshold, setArThreshold] = useState("");

  const { data: balanceData, refetch: refetchBalance } = useBalance();
  const { data: usage } = useUsageSummary();
  const { data: txData } = useTransactions({
    page: txPage,
    type: txFilter,
  });
  const { data: invoices } = useInvoices();
  const autoRecharge = useAutoRecharge();

  // Handle Stripe return
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Credits added successfully!");
      refetchBalance();
    } else if (searchParams.get("cancelled") === "true") {
      toast.error("Payment cancelled");
    }
  }, [searchParams, refetchBalance]);

  // Sync auto-recharge form with server state
  useEffect(() => {
    if (balanceData) {
      setArEnabled(balanceData.autoRecharge);
      setArAmount(balanceData.autoRechargeAmount?.toString() ?? "");
      setArThreshold(balanceData.autoRechargeThreshold?.toString() ?? "");
    }
  }, [balanceData]);

  const handleAutoRechargeSave = () => {
    autoRecharge.mutate(
      {
        enabled: arEnabled,
        amount: arEnabled ? parseFloat(arAmount) || null : null,
        threshold: arEnabled ? parseFloat(arThreshold) || null : null,
      },
      {
        onSuccess: () => toast.success("Auto-recharge settings saved"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  // Chart data
  const chartData =
    chartView === "day"
      ? usage?.byDay ?? []
      : chartView === "gpu"
        ? usage?.byGpu.map((g) => ({ name: g.gpuType, cost: g.cost, hours: g.hours })) ?? []
        : usage?.byInstance.map((i) => ({ name: i.instanceName, cost: i.cost, hours: i.hours })) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <button
          onClick={() => setShowAddCredits(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Add Credits
        </button>
      </div>

      {/* Balance Card */}
      <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10">
            <Wallet className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <p className="text-sm text-surface-400">Current Balance</p>
            <p className="text-3xl font-bold text-white">
              ${balanceData?.balance.toFixed(2) ?? "0.00"}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-surface-800/50 p-3">
            <p className="text-xs text-surface-500">This Month</p>
            <p className="mt-1 text-lg font-semibold text-white">
              ${usage?.totalSpend.toFixed(2) ?? "0.00"}
            </p>
          </div>
          <div className="rounded-lg bg-surface-800/50 p-3">
            <p className="text-xs text-surface-500">GPU Hours</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {usage?.totalHours.toFixed(1) ?? "0.0"}h
            </p>
          </div>
          <div className="hidden rounded-lg bg-surface-800/50 p-3 sm:block">
            <p className="text-xs text-surface-500">Active GPUs</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {usage?.byGpu.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Recharge */}
      <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900/50 p-6">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-accent-amber" />
          <h2 className="text-lg font-semibold text-white">Auto-Recharge</h2>
        </div>
        <p className="mt-1 text-sm text-surface-400">
          Automatically add credits when your balance drops below a threshold.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setArEnabled(!arEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              arEnabled ? "bg-brand-600" : "bg-surface-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                arEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-surface-300">
            {arEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {arEnabled && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-surface-400">
                Recharge Amount ($)
              </label>
              <input
                type="number"
                min={10}
                value={arAmount}
                onChange={(e) => setArAmount(e.target.value)}
                placeholder="50"
                className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-surface-400">
                When balance drops below ($)
              </label>
              <input
                type="number"
                min={1}
                value={arThreshold}
                onChange={(e) => setArThreshold(e.target.value)}
                placeholder="5"
                className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <button
                onClick={handleAutoRechargeSave}
                disabled={autoRecharge.isPending}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {autoRecharge.isPending ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Usage Chart */}
      <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900/50 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Usage Overview</h2>
          <div className="flex gap-1 rounded-lg bg-surface-800 p-1">
            {(["day", "gpu", "instance"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  chartView === view
                    ? "bg-surface-700 text-white"
                    : "text-surface-400 hover:text-white"
                }`}
              >
                By {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 h-64">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-surface-500">
              No usage data for this period
            </div>
          ) : chartView === "day" ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickFormatter={(v: string) => v.split("-").slice(1).join("/")}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #2a2a3e",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#5c7cfa"
                  fill="#5c7cfa"
                  fillOpacity={0.1}
                  name="Cost ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis
                  dataKey={chartView === "gpu" ? "name" : "name"}
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #2a2a3e",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="cost" fill="#5c7cfa" radius={[4, 4, 0, 0]} name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900/50 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Transaction History
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-surface-500" />
            <select
              value={txFilter ?? ""}
              onChange={(e) => {
                setTxFilter(e.target.value || undefined);
                setTxPage(1);
              }}
              className="rounded-lg border border-surface-700 bg-surface-800 px-2 py-1 text-xs text-surface-300 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="CREDIT_PURCHASE">Purchases</option>
              <option value="USAGE_DEDUCTION">Usage</option>
              <option value="REFUND">Refunds</option>
              <option value="BONUS">Bonus</option>
              <option value="PROMO">Promo</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800 text-left text-xs font-medium uppercase tracking-wider text-surface-500">
                <th className="pb-3">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/50">
              {txData?.data?.map((tx) => (
                <tr key={tx.id} className="text-surface-300">
                  <td className="py-3 pr-4 text-xs text-surface-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <TransactionTypeBadge type={tx.type} />
                  </td>
                  <td className="py-3 pr-4 text-surface-300">
                    {tx.description}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span
                      className={`flex items-center justify-end gap-1 font-medium ${
                        tx.amount >= 0
                          ? "text-accent-green"
                          : "text-accent-red"
                      }`}
                    >
                      {tx.amount >= 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      ${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 text-right text-surface-400">
                    ${tx.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
              {(!txData?.data || txData.data.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-surface-500"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {txData?.meta && txData.meta.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-surface-500">
              Page {txData.meta.page} of {txData.meta.totalPages} ({txData.meta.total} total)
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                disabled={txPage <= 1}
                className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-800 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setTxPage((p) => Math.min(txData.meta.totalPages, p + 1))
                }
                disabled={txPage >= txData.meta.totalPages}
                className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-800 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="mt-6 rounded-xl border border-surface-800 bg-surface-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Invoices</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800 text-left text-xs font-medium uppercase tracking-wider text-surface-500">
                <th className="pb-3">Month</th>
                <th className="pb-3 text-right">Total Amount</th>
                <th className="pb-3 text-right">GPU Hours</th>
                <th className="pb-3 text-right">Instances</th>
                <th className="pb-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/50">
              {invoices?.map((inv) => (
                <tr key={inv.month} className="text-surface-300">
                  <td className="py-3 font-medium text-white">{inv.month}</td>
                  <td className="py-3 text-right">
                    ${inv.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 text-right">
                    {inv.totalHours.toFixed(1)}h
                  </td>
                  <td className="py-3 text-right">{inv.instanceCount}</td>
                  <td className="py-3 text-right">
                    {inv.pdfUrl ? (
                      <a
                        href={inv.pdfUrl}
                        className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300"
                      >
                        <Download className="h-3 w-3" />
                        PDF
                      </a>
                    ) : (
                      <span className="text-xs text-surface-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {(!invoices || invoices.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-surface-500"
                  >
                    No invoices yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCreditsModal
        open={showAddCredits}
        onClose={() => setShowAddCredits(false)}
      />
    </div>
  );
}
