'use client';

import { FormEvent, useState } from 'react';
import { Repository } from '@/types';

interface RepositoryInputProps {
  onRepositorySubmit: (repo: Repository) => void;
  isLoading: boolean;
}

export default function RepositoryInput({
  onRepositorySubmit,
  isLoading,
}: RepositoryInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setError('Please enter a GitHub URL or owner/repo');
      return;
    }

    try {
      // Parse different input formats
      let owner = '';
      let repo = '';

      if (trimmedInput.includes('/')) {
        if (trimmedInput.includes('github.com')) {
          // Full URL format
          const match = trimmedInput.match(/github\.com\/([^/]+)\/([^/]+)/);
          if (!match) {
            setError('Invalid GitHub URL format');
            return;
          }
          owner = match[1];
          repo = match[2].replace('.git', '').replace(/^([^#]+)#.*$/, '$1');
        } else {
          // owner/repo format
          const parts = trimmedInput.split('/');
          owner = parts[0];
          repo = parts[1];
        }
      } else {
        setError('Please provide owner/repo or full GitHub URL');
        return;
      }

      // Validate format
      if (!owner || !repo) {
        setError('Invalid format. Use owner/repo or GitHub URL');
        return;
      }

      onRepositorySubmit({
        owner,
        repo,
        url: `https://github.com/${owner}/${repo}`,
        description: '',
        language: '',
        stars: 0,
        forks: 0,
      });

      setInput('');
    } catch (err) {
      setError('Failed to parse repository information');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter GitHub URL or owner/repo..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Loading...' : 'Analyze'}
        </button>
      </div>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </form>
  );
}
