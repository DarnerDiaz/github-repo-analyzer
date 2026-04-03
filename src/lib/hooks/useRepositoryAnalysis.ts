'use client';

import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api';
import { z } from 'zod';

const saveRepositorySchema = z.object({
  owner: z.string(),
  name: z.string(),
  url: z.string(),
  description: z.string().optional(),
  stars: z.number().optional(),
  forks: z.number().optional(),
  language: z.string().optional(),
  summary: z.string(),
  structure: z.string(),
  keyFiles: z.string(),
  technologies: z.string(),
});

export function useRepositoryAnalysis() {
  const [isLoading, setIsLoading] = useState(false);

  const saveAnalysis = useCallback(async (data: Partial<z.infer<typeof saveRepositorySchema>>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Failed to save analysis:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { saveAnalysis, isLoading };
}
