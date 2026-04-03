// API utility functions for standardized responses and error handling

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      message,
    } as ApiSuccessResponse<T>),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      } as ApiErrorResponse),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      } as ApiErrorResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: 'An unexpected error occurred',
    } as ApiErrorResponse),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
