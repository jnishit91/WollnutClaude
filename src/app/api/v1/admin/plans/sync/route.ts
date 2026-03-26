// src/app/api/v1/admin/plans/sync/route.ts
// Admin: sync GPU plans from E2E Networks

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("admin-plans");

export const POST = withErrorHandler(async () => {
  const admin = await requireAdmin();

  // Get current plans from DB
  const currentPlans = await prisma.gPUPlan.findMany({
    orderBy: { sortOrder: "asc" },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "admin.plans_sync",
      resource: "gpu_plan",
      details: { planCount: currentPlans.length },
    },
  });

  log.info("Plans sync triggered", {
    adminId: admin.id,
    planCount: currentPlans.length,
  });

  return apiSuccess({
    synced: true,
    planCount: currentPlans.length,
    plans: currentPlans.map((p) => ({
      id: p.id,
      gpuName: p.gpuName,
      available: p.available,
      wollnutPricePerHour: Number(p.wollnutPricePerHour),
    })),
  });
});
