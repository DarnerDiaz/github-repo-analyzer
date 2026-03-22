import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, ApiError } from '@/lib/api';
import { z } from 'zod';

const saveRepositorySchema = z.object({
  owner: z.string().min(1, 'Owner is required'),
  name: z.string().min(1, 'Repository name is required'),
  url: z.string().url('Invalid URL'),
  stars: z.number().int().nonnegative().default(0),
  forks: z.number().int().nonnegative().default(0),
  language: z.string().default(''),
  description: z.string().default(''),
  summary: z.string().default('No summary available'),
  structure: z.string().default('{}'),
  keyFiles: z.string().default('[]'),
  technologies: z.string().default('[]'),
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
    
    console.log('📝 Repository POST request with body:', body);
    
    const validatedData = saveRepositorySchema.parse(body);
    console.log('✅ Validation passed for:', validatedData.owner, '/', validatedData.name);
    
    // Check if repository already exists
    const fullName = `${validatedData.owner}/${validatedData.name}`;
    console.log('🔍 Searching for repository:', fullName);
    
    let repository = await withRetry(() =>
      prisma.repository.findUnique({
        where: { fullName },
      })
    );

    console.log('📦 Repository found:', repository?.id || 'new');

    // Create or update repository
    if (repository) {
      repository = await withRetry(() =>
        prisma.repository.update({
          where: { fullName },
          data: {
            stars: validatedData.stars,
            forks: validatedData.forks,
            language: validatedData.language || undefined,
            description: validatedData.description || undefined,
            updatedAt: new Date(),
          },
        })
      );
    } else {
      repository = await withRetry(() =>
        prisma.repository.create({
          data: {
            owner: validatedData.owner,
            name: validatedData.name,
            fullName,
            url: validatedData.url,
            stars: validatedData.stars,
            forks: validatedData.forks,
            language: validatedData.language || undefined,
            description: validatedData.description || undefined,
          },
        })
      );
    }

    // Save analysis
    const analysis = await withRetry(() =>
      prisma.analysis.create({
        data: {
          repositoryId: repository.id,
          summary: validatedData.summary,
          structure: validatedData.structure,
          keyFiles: validatedData.keyFiles,
          technologies: validatedData.technologies,
        },
      })
    );

    console.log('✅ Analysis saved:', analysis.id);

    return successResponse(
      { repository, analysis },
      'Repository analysis saved successfully'
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return handleApiError(
        new ApiError(`Validation failed: ${validationErrors}`, 400)
      );
    }
    return handleApiError(error);
  }
}
