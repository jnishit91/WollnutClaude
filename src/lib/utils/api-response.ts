// src/lib/utils/api-response.ts
// Standardized API response format for all Wollnut endpoints

import { NextResponse } from "next/server";
import { AppError, ValidationError } from "./errors";
import { createLogger } from "./logger";
import { ZodError } from "zod";

const log = createLogger("api");

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Return a successful JSON response.
 */
export function apiSuccess<T>(
  data: T,
  status: number = 200,
  meta?: ApiSuccessResponse<T>["meta"]
): NextResponse<ApiResponse<T>> {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

/**
 * Return a standardized error JSON response.
 */
export function apiError(
  message: string,
  status: number = 500,
  code: string = "INTERNAL_ERROR",
  details?: Record<string, string[]>
): NextResponse<ApiResponse<never>> {
  const body: ApiErrorResponse = {
    success: false,
    error: { code, message },
  };
  if (details) body.error.details = details;
  return NextResponse.json(body, { status });
}

/**
 * Catch-all error handler for API routes.
 * Converts known error types into standardized responses.
 * Unknown errors return 500 with a generic message (never leaks internals).
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  // Zod validation errors
  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join(".") || "root";
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }
    return apiError("Validation failed", 422, "VALIDATION_ERROR", details);
  }

  // Our custom app errors
  if (error instanceof ValidationError) {
    return apiError(error.message, error.statusCode, error.code, error.errors);
  }

  if (error instanceof AppError) {
    // Log server errors, skip expected client errors
    if (error.statusCode >= 500) {
      log.error("Server error in API route", error);
    }
    return apiError(error.message, error.statusCode, error.code);
  }

  // Unknown errors — log full details, return generic message
  log.error("Unhandled error in API route", error instanceof Error ? error : new Error(String(error)));

  return apiError(
    "An unexpected error occurred. Please try again.",
    500,
    "INTERNAL_ERROR"
  );
}

/**
 * Wrapper to create a type-safe API route handler with error handling.
 *
 * Usage:
 *   export const GET = withErrorHandler(async (req) => {
 *     const data = await someOperation();
 *     return apiSuccess(data);
 *   });
 */
export function withErrorHandler(
  handler: (
    req: Request,
    context: { params: Promise<Record<string, string>> }
  ) => Promise<NextResponse>
) {
  return async (
    req: Request,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
