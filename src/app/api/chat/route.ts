import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, ApiError } from '@/lib/api';
import { z } from 'zod';

const createChatSessionSchema = z.object({
  repositoryId: z.string().min(1),
  title: z.string().optional().default('Chat Session'),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createChatSessionSchema.parse(body);

    // Verify repository exists
    const repository = await withRetry(() =>
      prisma.repository.findUnique({
        where: { id: validatedData.repositoryId },
      })
    );

    if (!repository) {
      throw new ApiError('Repository not found', 404);
    }

    // Create chat session
    const session = await withRetry(() =>
      prisma.chatSession.create({
        data: {
          repositoryId: validatedData.repositoryId,
          title: validatedData.title,
        },
      })
    );

    return successResponse(session, 'Chat session created', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new ApiError('Invalid request data', 400));
    }
    return handleApiError(error);
  }
}
