// src/app/api/v1/instances/[id]/reboot/route.ts
// Reboot a running instance

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { withErrorHandler, apiSuccess, apiError } from "@/lib/utils/api-response";
import { ResourceNotFoundError } from "@/lib/utils/errors";
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

  if (instance.status !== "RUNNING") {
    return apiError(
      "Instance must be running to reboot it",
      400,
      "INVALID_STATE"
    );
  }

  if (instance.e2eNodeId) {
    await e2eService.performAction(instance.e2eNodeId, "reboot");
  }

  return apiSuccess({ status: "RUNNING" });
});
