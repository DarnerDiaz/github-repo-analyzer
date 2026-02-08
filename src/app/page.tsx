'use client';

import { useState } from 'react';
import RepositoryInput from '@/components/RepositoryInput';
import Chat from '@/components/Chat';
import DocumentationViewer from '@/components/DocumentationViewer';
import { Repository, AnalysisResult } from '@/types';
import { getRepositoryInfo, analyzeRepository } from '@/lib/github';

export default function Home() {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRepositorySubmit = async (repo: Repository) => {
    setIsLoading(true);
    setError('');

    try {
      // Fetch repository info
      const repoInfo = await getRepositoryInfo(repo.owner, repo.repo);
      setRepository(repoInfo);

      // Analyze repository
      const analysisResult = await analyzeRepository(repo.owner, repo.repo);
      setAnalysis(analysisResult);
    } catch (err) {
      setError('Failed to load repository. Please check the URL and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GitHub Repository Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Chat with your GitHub repositories, get insights, and generate documentation
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <RepositoryInput onRepositorySubmit={handleRepositorySubmit} isLoading={isLoading} />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Content Section */}
        {repository && analysis && (
          <div className="space-y-8">
            {/* Repository Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {repository.owner}/{repository.repo}
                  </h2>
                  <p className="text-gray-600 mt-2">{repository.description}</p>
                  <div className="flex gap-6 mt-4 text-sm text-gray-600">
                    <span>📊 {repository.stars} stars</span>
                    <span>🔀 {repository.forks} forks</span>
                    <span>💻 {repository.language}</span>
                  </div>
                </div>
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                >
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat Section */}
              <div className="lg:col-span-2">
                <Chat repository={repository} analysis={analysis} />
              </div>

              {/* Documentation Section */}
              <div>
                <DocumentationViewer
                  analysis={analysis}
                  repoName={`${repository.owner}/${repository.repo}`}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
