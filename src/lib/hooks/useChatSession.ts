'use client';

import { useState, useCallback } from 'react';

export function useChatSession() {
  const [isLoading, setIsLoading] = useState(false);

  const createSession = useCallback(async (repositoryId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryId, title: 'Chat Session' }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Failed to create chat session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createSession, isLoading };
}

export function useChatMessages(sessionId: string | null) {
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback(async (role: string, content: string) => {
    if (!sessionId) return null;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, content }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const getSession = useCallback(async () => {
    if (!sessionId) return null;
    
    try {
      const response = await fetch(`/api/chat/${sessionId}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Failed to get session:', error);
      throw error;
    }
  }, [sessionId]);

  return { addMessage, getSession, isLoading };
}
