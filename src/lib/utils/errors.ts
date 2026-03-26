// src/lib/utils/errors.ts
// Custom error hierarchy for Wollnut Labs

export class AppError extends Error {
  public readonly statusCode: number;
  public code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─────────────────────────────────────────────
// E2E NETWORKS API ERRORS
// ─────────────────────────────────────────────

export class E2EApiError extends AppError {
  public readonly e2eCode: number | null;
  public readonly e2eMessage: string | null;
  public readonly endpoint: string;

  constructor(
    message: string,
    endpoint: string,
    statusCode: number = 502,
    e2eCode: number | null = null,
    e2eMessage: string | null = null
  ) {
    super(message, statusCode, "E2E_API_ERROR");
    this.e2eCode = e2eCode;
    this.e2eMessage = e2eMessage;
    this.endpoint = endpoint;
  }
}

export class E2EAuthError extends E2EApiError {
  constructor(endpoint: string) {
    super(
      "E2E Networks authentication failed. Check API token configuration.",
      endpoint,
      401,
      401,
      "Unauthorized"
    );
    this.code = "E2E_AUTH_ERROR";
  }
}

export class E2ERateLimitError extends E2EApiError {
  public readonly retryAfter: number;

  constructor(endpoint: string, retryAfter: number = 60) {
    super(
      `E2E Networks rate limit exceeded. Retry after ${retryAfter}s.`,
      endpoint,
      429,
      429,
      "Rate limit exceeded"
    );
    this.code = "E2E_RATE_LIMIT";
    this.retryAfter = retryAfter;
  }
}

export class E2EResourceNotFoundError extends E2EApiError {
  constructor(resource: string, resourceId: string, endpoint: string) {
    super(
      `E2E resource not found: ${resource} (${resourceId})`,
      endpoint,
      404,
      404,
      "Not found"
    );
    this.code = "E2E_NOT_FOUND";
  }
}

// ─────────────────────────────────────────────
// APPLICATION ERRORS
// ─────────────────────────────────────────────

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTH_REQUIRED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(
    message: string = "Validation failed",
    errors: Record<string, string[]> = {}
  ) {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class InsufficientCreditsError extends AppError {
  public readonly required: number;
  public readonly available: number;

  constructor(required: number, available: number) {
    super(
      `Insufficient credits. Required: $${required.toFixed(4)}, Available: $${available.toFixed(4)}`,
      402,
      "INSUFFICIENT_CREDITS"
    );
    this.required = required;
    this.available = available;
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter: number = 60) {
    super("Rate limit exceeded", 429, "RATE_LIMIT");
    this.retryAfter = retryAfter;
  }
}
