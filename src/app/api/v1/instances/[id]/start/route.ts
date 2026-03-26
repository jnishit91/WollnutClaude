// src/app/api/v1/instances/[id]/start/route.ts
// Start a stopped instance

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess, apiError } from "@/lib/utils/api-response";
import {
  ResourceNotFoundError,
  InsufficientCreditsError,
} from "@/lib/utils/errors";
import { e2eService } from "@/lib/services/e2e-networks";

export const POST = withErrorHandler(async (_req, context) => {
  const user = await requireAuth();
  const params = await context.params;
  const id = params.id as string;

  const instance = await prisma.instance.findFirst({
    where: { id, userId: user.id },
  });

  if (!instance) {
    throw new ResourceNotFoundError("Instance", id);
  }

  if (instance.status !== "STOPPED") {
    return apiError(
      "Instance must be stopped to start it",
      400,
      "INVALID_STATE"
    );
  }

  // Check credits (at least 30 minutes)
  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { creditsBalance: true },
  });
  const balance = Number(dbUser.creditsBalance);
  const thirtyMinCost = Number(instance.pricePerMinute) * 30;

  if (balance < thirtyMinCost) {
    throw new InsufficientCreditsError(thirtyMinCost, balance);
  }

  // Call E2E to power on
  if (instance.e2eNodeId) {
    await e2eService.performAction(instance.e2eNodeId, "power_on");
  }

  const now = new Date();
  await prisma.instance.update({
    where: { id },
    data: {
      status: "PROVISIONING",
      startedAt: now,
      stoppedAt: null,
      lastBilledAt: now,
    },
  });

  return apiSuccess({ status: "PROVISIONING" });
});
