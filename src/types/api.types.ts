// src/types/api.types.ts
// Generic API request/response types used across the platform

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

/** Standard error shape returned by our API */
export interface ApiErrorShape {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/** Wrapper for React Query mutation results */
export interface MutationResult<T> {
  success: true;
  data: T;
}
