import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, ApiError } from '@/lib/api';
import { z } from 'zod';

const addMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const validatedData = addMessageSchema.parse(body);

    // Verify session exists
    const session = await withRetry(() =>
      prisma.chatSession.findUnique({
        where: { id: sessionId },
      })
    );

    if (!session) {
      throw new ApiError('Chat session not found', 404);
    }

    // Create message
    const message = await withRetry(() =>
      prisma.chatMessage.create({
        data: {
          sessionId,
          role: validatedData.role,
          content: validatedData.content,
        },
      })
    );

    return successResponse(message, 'Message saved', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new ApiError('Invalid request data', 400));
    }
    return handleApiError(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Get session with messages
    const session = await withRetry(() =>
      prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      })
    );

    if (!session) {
      throw new ApiError('Chat session not found', 404);
    }

    return successResponse(session);
  } catch (error) {
    return handleApiError(error);
  }
}
