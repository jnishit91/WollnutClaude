// src/lib/auth-helpers.ts
// Server-side auth utilities for API routes

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { AuthenticationError, AuthorizationError } from "./utils/errors";

/**
 * Get authenticated user from session. Throws if not authenticated.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  return session.user;
}

/**
 * Get authenticated admin user. Throws if not admin.
 */
export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    throw new AuthorizationError("Admin access required");
  }

  return user;
}
