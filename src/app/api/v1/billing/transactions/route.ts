// src/app/api/v1/billing/transactions/route.ts
// Paginated transaction history for the authenticated user

import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { transactionQuerySchema } from "@/lib/validators/billing.schema";
import { apiSuccess, withErrorHandler } from "@/lib/utils/api-response";
import type { Prisma } from "@prisma/client";

export const GET = withErrorHandler(async (req) => {
  const user = await requireAuth();

  const url = new URL(req.url);
  const params = transactionQuerySchema.parse({
    page: url.searchParams.get("page") ?? undefined,
    perPage: url.searchParams.get("perPage") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
    startDate: url.searchParams.get("startDate") ?? undefined,
    endDate: url.searchParams.get("endDate") ?? undefined,
  });

  const where: Prisma.TransactionWhereInput = { userId: user.id };

  if (params.type) {
    where.type = params.type;
  }
  if (params.startDate) {
    where.createdAt = { ...((where.createdAt as object) ?? {}), gte: new Date(params.startDate) };
  }
  if (params.endDate) {
    where.createdAt = { ...((where.createdAt as object) ?? {}), lte: new Date(params.endDate) };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.perPage,
      take: params.perPage,
      select: {
        id: true,
        type: true,
        amount: true,
        balance: true,
        description: true,
        razorpayPaymentId: true,
        createdAt: true,
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return apiSuccess(
    transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
      balance: Number(t.balance),
    })),
    200,
    {
      page: params.page,
      perPage: params.perPage,
      total,
      totalPages: Math.ceil(total / params.perPage),
    }
  );
});
