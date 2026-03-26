// src/app/api/auth/signup/route.ts
// Email/password registration endpoint

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signUpSchema } from "@/lib/validators/auth.schema";
import {
  withErrorHandler,
  apiSuccess,
  apiError,
} from "@/lib/utils/api-response";
import { authLimiter, getRateLimitKey } from "@/lib/utils/rate-limiter";
import { ConflictError, RateLimitError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("auth:signup");

export const POST = withErrorHandler(async (req) => {
  // Rate limit
  const key = getRateLimitKey(req);
  const limit = authLimiter.check(key);
  if (!limit.allowed) {
    throw new RateLimitError(Math.ceil(limit.retryAfterMs / 1000));
  }

  const body = await req.json();
  const data = signUpSchema.parse(body);

  // Check for existing user
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (existing) {
    throw new ConflictError("An account with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Look up welcome credits
  const setting = await prisma.systemSetting.findUnique({
    where: { key: "new_user_credits" },
  });
  const credits = setting
    ? Number((setting.value as { amount?: number }).amount ?? 5)
    : 5;

  // Create user with welcome credits
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword,
        creditsBalance: credits,
      },
      select: {
        id: true,
        name: true,
        email: true,
        creditsBalance: true,
        createdAt: true,
      },
    });

    // Record welcome bonus transaction
    if (credits > 0) {
      await tx.transaction.create({
        data: {
          userId: newUser.id,
          type: "BONUS",
          amount: credits,
          balance: credits,
          description: `Welcome bonus: $${credits} free credits`,
        },
      });
    }

    return newUser;
  });

  log.info("New user registered", { userId: user.id, email: user.email });

  return apiSuccess(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    201
  );
});
