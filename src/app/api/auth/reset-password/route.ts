// src/app/api/auth/reset-password/route.ts
// Validate token and update password

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validators/auth.schema";
import {
  withErrorHandler,
  apiSuccess,
  apiError,
} from "@/lib/utils/api-response";
import { authLimiter, getRateLimitKey } from "@/lib/utils/rate-limiter";
import { RateLimitError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("auth:reset-password");

export const POST = withErrorHandler(async (req) => {
  // Rate limit
  const key = getRateLimitKey(req);
  const limit = authLimiter.check(key);
  if (!limit.allowed) {
    throw new RateLimitError(Math.ceil(limit.retryAfterMs / 1000));
  }

  const body = await req.json();
  const { token, password } = resetPasswordSchema.parse(body);

  // Find valid token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return apiError("Invalid or expired reset token", 400, "INVALID_TOKEN");
  }

  if (resetToken.expires < new Date()) {
    // Clean up expired token
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    return apiError("Reset token has expired", 400, "TOKEN_EXPIRED");
  }

  // Hash new password and update user
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { email: resetToken.email },
      data: { hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    }),
  ]);

  log.info("Password reset successful", { email: resetToken.email });

  return apiSuccess({ message: "Password has been reset successfully" });
});
