import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, ApiError } from '@/lib/api';
import { z } from 'zod';

const historyQuerySchema = z.object({
  repositoryId: z.string().optional(),
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
});

// Retry utility for SQLite timeout issues on Windows
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const isTimeout = 
        (error instanceof Error) && 
        (error.message.includes('timed out') || 
         error.message.includes('SQLITE_BUSY') ||
         error.message.includes('database is locked'));
      
      if (isTimeout && attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 100;
        console.warn(`⏱️ Timeout attempt ${attempt}/${maxRetries}, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  
  throw lastError;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validatedQuery = historyQuerySchema.parse(searchParams);

    const where = validatedQuery.repositoryId
      ? { repositoryId: validatedQuery.repositoryId }
      : {};

    // Get sessions with count
    const [sessions, total] = await Promise.all([
      withRetry(() =>
        prisma.chatSession.findMany({
          where,
          include: {
            repository: true,
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              select: { content: true, role: true },
            },
          },
          orderBy: { updatedAt: 'desc' },
          take: validatedQuery.limit,
          skip: validatedQuery.offset,
        })
      ),
      withRetry(() => prisma.chatSession.count({ where })),
    ]);

    return successResponse({
      sessions,
      pagination: {
        total,
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        hasMore: validatedQuery.offset + validatedQuery.limit < total,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new ApiError('Invalid query parameters', 400));
    }
    return handleApiError(error);
  }
}
