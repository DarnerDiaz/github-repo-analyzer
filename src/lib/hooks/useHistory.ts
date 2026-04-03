'use client';

import { useState, useCallback } from 'react';

export function useHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/history?page=${page}&limit=${limit}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch history';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchHistory, isLoading, error };
}
