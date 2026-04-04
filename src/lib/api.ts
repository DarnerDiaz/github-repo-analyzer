// API utility functions for standardized responses and error handling

/**
 * Success response payload structure
 * @template T - The type of data in the response
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Error response payload structure
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
}

/**
 * Union type for API responses (success or error)
 * @template T - The type of data in success response
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Custom API error class for standardized error handling
 * @example
 * ```typescript
 * throw new ApiError('User not found', 404);
 * ```
 */
export class ApiError extends Error {
  /**
   * Creates an ApiError instance
   * @param {string} message - Human-readable error message
   * @param {number} [statusCode=400] - HTTP status code (default: 400 Bad Request)
   */
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Creates a success HTTP response with JSON payload
 * @template T - The type of data being returned
 * @param {T} data - The successful response data
 * @param {string} [message] - Optional success message
 * @param {number} [statusCode=200] - HTTP status code (default: 200 OK)
 * @returns {Response} Formatted JSON response ready to send to client
 * @example
 * ```typescript
 * return successResponse({ id: 1, name: 'John' }, 'User fetched', 200);
 * ```
 */
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

/**
 * Converts caught errors into standardized error responses
 * Handles ApiError, Error, and unknown error types gracefully
 * @param {unknown} error - The error object (can be any type)
 * @returns {Response} Standardized JSON error response
 * @example
 * ```typescript
 * try {
 *   // Some operation
 * } catch (error) {
 *   return handleApiError(error);
 * }
 * ```
 */
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
