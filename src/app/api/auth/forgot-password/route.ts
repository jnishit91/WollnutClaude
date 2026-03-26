// src/app/api/auth/forgot-password/route.ts
// Generate password reset token and send email

import prisma from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validators/auth.schema";
import { withErrorHandler, apiSuccess } from "@/lib/utils/api-response";
import { authLimiter, getRateLimitKey } from "@/lib/utils/rate-limiter";
import { RateLimitError } from "@/lib/utils/errors";
import { generateToken } from "@/lib/utils/crypto";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("auth:forgot-password");

export const POST = withErrorHandler(async (req) => {
  // Rate limit
  const key = getRateLimitKey(req);
  const limit = authLimiter.check(key);
  if (!limit.allowed) {
    throw new RateLimitError(Math.ceil(limit.retryAfterMs / 1000));
  }

  const body = await req.json();
  const { email } = forgotPasswordSchema.parse(body);

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, hashedPassword: true },
  });

  if (user && user.hashedPassword) {
    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Generate new token (expires in 1 hour)
    const token = generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Send email (console.log for now)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 PASSWORD RESET EMAIL");
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token: ${token}`);
    console.log(`Expires: ${expires.toISOString()}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    log.info("Password reset token generated", { userId: user.id });
  }

  // Always return success (prevent email enumeration)
  return apiSuccess({
    message:
      "If an account with that email exists, a password reset link has been sent.",
  });
});
