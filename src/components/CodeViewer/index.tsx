'use client';

import { useState } from 'react';
import { RepositoryFile } from '@/types';
import { getFileContent } from '@/lib/github';
import { getFileLanguage, isBinaryFile } from '@/lib/utils';

interface CodeViewerProps {
  owner: string;
  repo: string;
  file: RepositoryFile;
}

export default function CodeViewer({ owner, repo, file }: CodeViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoadFile = async () => {
    if (isBinaryFile(file.path)) {
      setError('Cannot preview binary files');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const fileContent = await getFileContent(owner, repo, file.path);
      setContent(fileContent);
    } catch (err) {
      setError('Failed to load file content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 break-all">{file.path}</h4>
        <p className="text-xs text-gray-600 mt-1">{file.size} bytes</p>
      </div>

      {!content ? (
        <div className="p-4">
          <button
            onClick={handleLoadFile}
            disabled={isLoading}
            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 text-sm"
          >
            {isLoading ? 'Loading...' : 'View File'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      ) : (
        <pre className="p-4 bg-gray-900 text-gray-100 text-xs overflow-x-auto max-h-96">
          <code>{content.substring(0, 5000)}</code>
          {content.length > 5000 && (
            <p className="text-yellow-400 mt-4">... (file truncated to 5000 chars)</p>
          )}
        </pre>
      )}
    </div>
  );
}
