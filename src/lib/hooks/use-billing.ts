"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "@/lib/constants/routes";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Request failed");
  return data.data;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () =>
      fetchJson<{
        activeInstances: number;
        creditsBalance: number;
        monthSpend: number;
        totalGpuHours: number;
        recentTransactions: {
          id: string;
          type: string;
          amount: number;
          description: string;
          createdAt: string;
        }[];
        dailyUsage: { date: string; hours: number; cost: number }[];
      }>("/api/v1/dashboard/stats"),
    refetchInterval: 60_000,
  });
}

interface BalanceData {
  balance: number;
  autoRecharge: boolean;
  autoRechargeAmount: number | null;
  autoRechargeThreshold: number | null;
}

export function useBalance() {
  return useQuery<BalanceData>({
    queryKey: ["billing", "balance"],
    queryFn: () => fetchJson(API_ROUTES.BILLING.BALANCE),
    refetchInterval: 60_000,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (params: { amount: number; currency?: "INR" | "USD" }) => {
      const res = await fetch(API_ROUTES.BILLING.ADD_CREDITS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Request failed");
      return data.data as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        prefill: { name: string; email: string };
      };
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const res = await fetch("/api/v1/billing/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Verification failed");
      return data.data as {
        verified: boolean;
        amount: number;
        newBalance: number;
        paymentId: string;
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

interface UsageSummary {
  totalSpend: number;
  totalHours: number;
  byGpu: { gpuType: string; hours: number; cost: number }[];
  byDay: { date: string; cost: number; hours: number }[];
  byInstance: {
    instanceId: string;
    instanceName: string;
    gpuType: string;
    hours: number;
    cost: number;
  }[];
}

export function useUsageSummary(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.startDate) searchParams.set("startDate", params.startDate);
  if (params?.endDate) searchParams.set("endDate", params.endDate);
  if (params?.groupBy) searchParams.set("groupBy", params.groupBy);
  const qs = searchParams.toString();

  return useQuery<UsageSummary>({
    queryKey: ["billing", "usage", params],
    queryFn: () =>
      fetchJson(`${API_ROUTES.BILLING.USAGE}${qs ? `?${qs}` : ""}`),
  });
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balance: number;
  description: string;
  razorpayPaymentId: string | null;
  createdAt: string;
}

interface TransactionResponse {
  data: Transaction[];
  meta: { page: number; perPage: number; total: number; totalPages: number };
}

export function useTransactions(params?: {
  page?: number;
  perPage?: number;
  type?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.type) searchParams.set("type", params.type);
  const qs = searchParams.toString();

  return useQuery<TransactionResponse>({
    queryKey: ["billing", "transactions", params],
    queryFn: async () => {
      const res = await fetch(
        `${API_ROUTES.BILLING.TRANSACTIONS}${qs ? `?${qs}` : ""}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Request failed");
      return { data: json.data, meta: json.meta };
    },
  });
}

interface Invoice {
  month: string;
  totalAmount: number;
  totalHours: number;
  instanceCount: number;
  pdfUrl: string | null;
}

export function useInvoices() {
  return useQuery<Invoice[]>({
    queryKey: ["billing", "invoices"],
    queryFn: () => fetchJson(API_ROUTES.BILLING.INVOICES),
  });
}

export function useAutoRecharge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      enabled: boolean;
      amount?: number | null;
      threshold?: number | null;
    }) => {
      const res = await fetch("/api/v1/billing/auto-recharge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Request failed");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "balance"] });
    },
  });
}
