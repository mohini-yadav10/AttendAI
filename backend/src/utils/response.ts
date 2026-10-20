export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  pagination?: ApiResponse['pagination']
): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
    ...(pagination && { pagination }),
  };
}

export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  };
}

export function createPaginationMeta(
  total: number,
  page: number,
  limit: number
): ApiResponse['pagination'] {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
