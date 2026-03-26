// src/app/api/v1/billing/usage/route.ts
// Get usage summary for the authenticated user

import { requireAuth } from "@/lib/auth-helpers";
import { billingService } from "@/lib/services/billing.service";
import { usageQuerySchema } from "@/lib/validators/billing.schema";
import { apiSuccess, withErrorHandler } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async (req) => {
  const user = await requireAuth();

  const url = new URL(req.url);
  const params = usageQuerySchema.parse({
    startDate: url.searchParams.get("startDate") ?? undefined,
    endDate: url.searchParams.get("endDate") ?? undefined,
    instanceId: url.searchParams.get("instanceId") ?? undefined,
    gpuType: url.searchParams.get("gpuType") ?? undefined,
    groupBy: url.searchParams.get("groupBy") ?? undefined,
  });

  // Default to current month if no dates provided
  const now = new Date();
  const startDate = params.startDate
    ? new Date(params.startDate)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = params.endDate ? new Date(params.endDate) : now;

  const summary = await billingService.getUsageSummary(
    user.id,
    startDate,
    endDate,
    params.groupBy
  );

  return apiSuccess(summary);
});
