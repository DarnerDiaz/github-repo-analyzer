'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, Repository, AnalysisResult } from '@/types';
import { sendMessageToGemini } from '@/lib/gemini';
import { generateId, formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useChatSession, useChatMessages, useRepositoryAnalysis } from '@/lib/hooks';
import ConfigStatus from '@/components/ConfigStatus';

interface ChatProps {
  repository: Repository;
  analysis: AnalysisResult;
}

export default function Chat({ repository, analysis }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [repositoryId, setRepositoryId] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);
  
  const { createSession } = useChatSession();
  const { addMessage: addMessageToDb } = useChatMessages(sessionId);
  const { saveAnalysis } = useRepositoryAnalysis();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if API key is configured
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    setHasApiKey(!!apiKey && apiKey.trim().length > 0);
  }, []);

  // Initialize chat session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        // Prepare analysis data for saving
        const analysisData = {
          owner: repository.owner,
          name: repository.repo,
          url: repository.url,
          stars: repository.stars || 0,
          forks: repository.forks || 0,
          language: repository.language || '',
          description: repository.description || '',
          summary: analysis.summary || 'Repository analysis',
          structure: JSON.stringify(analysis.structure || []),
          keyFiles: Array.isArray(analysis.keyFiles) 
            ? JSON.stringify(analysis.keyFiles)
            : (analysis.keyFiles || '[]'),
          technologies: Array.isArray(analysis.mainLanguages)
            ? JSON.stringify(analysis.mainLanguages)
            : (analysis.mainLanguages || '[]'),
        };

        console.log('Saving analysis with data:', analysisData);
        
        // Save analysis first
        const analysisResult = await saveAnalysis(analysisData);

        if (analysisResult?.repository?.id) {
          setRepositoryId(analysisResult.repository.id);

          // Create chat session
          const session = await createSession(analysisResult.repository.id);
          if (session?.id) {
            setSessionId(session.id);
          }
        }
      } catch (err) {
        console.error('Failed to initialize chat session:', err);
        setError('Failed to initialize chat. Starting offline mode.');
        // Still allow offline mode - messages won't be saved but chat works
      }
    };

    initSession();
  }, [repository, analysis, saveAnalysis, createSession]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Save user message to database
      if (sessionId) {
        try {
          await addMessageToDb('user', input);
        } catch (dbErr) {
          console.warn('Failed to save user message:', dbErr);
          // Continue even if database save fails
        }
      }

      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendMessageToGemini({
        message: input,
        context: {
          repository,
          analysis,
        },
        conversationHistory,
      });

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database
      if (sessionId) {
        try {
          await addMessageToDb('assistant', response.response);
        } catch (dbErr) {
          console.warn('Failed to save assistant message:', dbErr);
          // Continue even if database save fails
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get response from AI.';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">
          Chat about {repository.owner}/{repository.repo}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Ask questions about this repository's code, structure, and functionality
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ConfigStatus hasApiKey={hasApiKey} />

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start asking questions about the repository...</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              } rounded-lg p-3`}
            >
              <div className={`prose prose-sm max-w-none ${
                message.role === 'user' ? 'text-white prose-invert' : ''
              }`}>
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
              <p className={`text-xs mt-1 ${
                message.role === 'user'
                  ? 'text-blue-100'
                  : 'text-gray-500'
              }`}>
                {formatDate(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 bg-gray-50"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about this repository..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
