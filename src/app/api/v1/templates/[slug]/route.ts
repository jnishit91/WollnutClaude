// src/app/api/v1/templates/[slug]/route.ts
// Get template detail by slug (public)

import prisma from "@/lib/prisma";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { ResourceNotFoundError } from "@/lib/utils/errors";

export const GET = withErrorHandler(async (_req, context) => {
  const params = await context.params;
  const slug = params.slug as string;

  const template = await prisma.template.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: true,
      e2eImageId: true,
      icon: true,
      tags: true,
      includedPackages: true,
      recommendedGpu: true,
      minVram: true,
      featured: true,
    },
  });

  if (!template) {
    throw new ResourceNotFoundError("Template", slug);
  }

  return apiSuccess(template);
});
