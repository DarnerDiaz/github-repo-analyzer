import { describe, it, expect, beforeEach } from 'vitest';
import {
  ApiError,
  successResponse,
  handleApiError,
} from '../src/lib/api';

describe('Utils - ApiError Class', () => {
  it('should create ApiError with message and status code', () => {
    const error = new ApiError('Not found', 404);
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('ApiError');
  });

  it('should use default status code 400', () => {
    const error = new ApiError('Bad request');
    expect(error.statusCode).toBe(400);
  });

  it('should extend Error class', () => {
    const error = new ApiError('Test error', 500);
    expect(error instanceof Error).toBe(true);
  });

  it('should handle various status codes', () => {
    expect(new ApiError('Unauthorized', 401).statusCode).toBe(401);
    expect(new ApiError('Forbidden', 403).statusCode).toBe(403);
    expect(new ApiError('Internal error', 500).statusCode).toBe(500);
  });
});

describe('API - successResponse', () => {
  it('should create response with success status', async () => {
    const response = successResponse({ id: 1, name: 'Test' });
    expect(response.status).toBe(200);
  });

  it('should include correct content type header', async () => {
    const response = successResponse({ test: 'data' });
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  it('should serialize data correctly', async () => {
    const data = { id: 1, name: 'Test', tags: ['a', 'b'] };
    const response = successResponse(data);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual(data);
  });

  it('should include optional message', async () => {
    const response = successResponse({ id: 1 }, 'Resource created');
    const body = await response.json();
    expect(body.message).toBe('Resource created');
  });

  it('should omit message when not provided', async () => {
    const response = successResponse({ id: 1 });
    const body = await response.json();
    expect(body.message).toBeUndefined();
  });

  it('should support custom status codes', async () => {
    const response = successResponse({ id: 1 }, 'Created', 201);
    expect(response.status).toBe(201);
  });

  it('should default status to 200 when not provided', async () => {
    const response = successResponse({ test: 'data' });
    expect(response.status).toBe(200);
  });

  it('should handle various data types', async () => {
    const stringResponse = successResponse('string data');
    const stringBody = await stringResponse.json();
    expect(stringBody.data).toBe('string data');

    const numberResponse = successResponse(42);
    const numberBody = await numberResponse.json();
    expect(numberBody.data).toBe(42);

    const arrayResponse = successResponse([1, 2, 3]);
    const arrayBody = await arrayResponse.json();
    expect(arrayBody.data).toEqual([1, 2, 3]);
  });

  it('should handle null data', async () => {
    const response = successResponse(null);
    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.success).toBe(true);
  });
});

describe('API - handleApiError', () => {
  it('should handle ApiError correctly', async () => {
    const error = new ApiError('User not found', 404);
    const response = handleApiError(error);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('User not found');
  });

  it('should handle standard Error', async () => {
    const error = new Error('Something went wrong');
    const response = handleApiError(error);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Something went wrong');
  });

  it('should handle unknown error types', async () => {
    const response = handleApiError('string error');

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('An unexpected error occurred');
  });

  it('should include content type header', async () => {
    const error = new ApiError('Test error');
    const response = handleApiError(error);

    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  it('should preserve ApiError status codes', async () => {
    const errors = [
      new ApiError('Bad request', 400),
      new ApiError('Unauthorized', 401),
      new ApiError('Forbidden', 403),
      new ApiError('Not found', 404),
      new ApiError('Server error', 500),
    ];

    for (const error of errors) {
      const response = handleApiError(error);
      expect(response.status).toBe(error.statusCode);
    }
  });

  it('should handle null error', async () => {
    const response = handleApiError(null);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('An unexpected error occurred');
  });

  it('should handle undefined error', async () => {
    const response = handleApiError(undefined);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('An unexpected error occurred');
  });
});

describe('API - Response Format Consistency', () => {
  it('should always include success field', async () => {
    const successResp = successResponse({ test: 'data' });
    const successBody = await successResp.json();
    expect(successBody).toHaveProperty('success');
    expect(successBody.success).toBe(true);

    const errorResp = handleApiError(new Error('Test'));
    const errorBody = await errorResp.json();
    expect(errorBody).toHaveProperty('success');
    expect(errorBody.success).toBe(false);
  });

  it('should use correct response types', async () => {
    const successResp = successResponse({ data: 'test' }, 'Message');
    const successBody = await successResp.json();
    expect(successBody).toHaveProperty('data');
    expect(successBody).toHaveProperty('message');

    const errorResp = handleApiError(new Error('Test'));
    const errorBody = await errorResp.json();
    expect(errorBody).toHaveProperty('error');
  });

  it('success response should be JSON Response', () => {
    const response = successResponse({ test: 'data' });
    expect(response instanceof Response).toBe(true);
  });

  it('error response should be JSON Response', () => {
    const response = handleApiError(new Error('Test'));
    expect(response instanceof Response).toBe(true);
  });
});
