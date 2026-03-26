// src/app/api/v1/templates/route.ts
// List active templates (public)

import prisma from "@/lib/prisma";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const where: Record<string, unknown> = { active: true };
  if (category) where.category = category;

  const templates = await prisma.template.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: true,
      icon: true,
      tags: true,
      includedPackages: true,
      recommendedGpu: true,
      minVram: true,
      featured: true,
    },
  });

  return apiSuccess(templates);
});
