// src/app/api/v1/models/route.ts
// List active AI models (public)

import prisma from "@/lib/prisma";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";

export const GET = withErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { active: true };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { provider: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const models = await prisma.aIModel.findMany({
    where,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      provider: true,
      category: true,
      description: true,
      parameters: true,
      contextLength: true,
      vramRequired: true,
      recommendedGpu: true,
      templateSlug: true,
      huggingFaceId: true,
      licenseType: true,
      featured: true,
    },
  });

  return apiSuccess(models);
});
