'use client';

import { useEffect, useState } from 'react';
import { useHistory } from '@/lib/hooks';

interface HistorySidebarProps {
  onSelectSession: (sessionId: string) => void;
}

export default function HistorySidebar({ onSelectSession }: HistorySidebarProps) {
  const { fetchHistory, isLoading } = useHistory();
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory(1, 20);
        setSessions(data.sessions || []);
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };

    loadHistory();
  }, [fetchHistory]);

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>
      
      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      
      <div className="space-y-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className="w-full text-left p-2 rounded hover:bg-gray-200 transition text-sm"
          >
            <p className="font-medium text-gray-900 truncate">{session.title}</p>
            <p className="text-xs text-gray-500">
              {session.repository?.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
