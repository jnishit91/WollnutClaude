// src/app/api/v1/models/[slug]/route.ts
// Get AI model detail by slug (public)

import prisma from "@/lib/prisma";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { ResourceNotFoundError } from "@/lib/utils/errors";

export const GET = withErrorHandler(async (_req, context) => {
  const params = await context.params;
  const slug = params.slug as string;

  const model = await prisma.aIModel.findUnique({
    where: { slug },
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

  if (!model) {
    throw new ResourceNotFoundError("Model", slug);
  }

  return apiSuccess(model);
});
