// src/app/api/v1/plans/route.ts
// List available GPU plans (public)

import prisma from "@/lib/prisma";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async () => {
  const plans = await prisma.gPUPlan.findMany({
    where: { available: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      e2ePlanId: true,
      gpuName: true,
      gpuShortName: true,
      vram: true,
      vcpus: true,
      ram: true,
      storage: true,
      infiniband: true,
      wollnutPricePerHour: true,
      wollnutPricePerMinute: true,
      available: true,
      availableCount: true,
      category: true,
    },
  });

  return apiSuccess(
    plans.map((p) => ({
      ...p,
      wollnutPricePerHour: Number(p.wollnutPricePerHour),
      wollnutPricePerMinute: Number(p.wollnutPricePerMinute),
    }))
  );
});
