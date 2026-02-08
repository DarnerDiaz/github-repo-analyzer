'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types';
import { generateDocumentation, generateSummary } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';

interface DocumentationViewerProps {
  analysis: AnalysisResult;
  repoName: string;
}

export default function DocumentationViewer({
  analysis,
  repoName,
}: DocumentationViewerProps) {
  const [documentation, setDocumentation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'docs'>('analysis');
  const [error, setError] = useState('');

  const handleGenerateDocs = async () => {
    setIsLoading(true);
    setError('');

    try {
      const contentSummary = `
Repository: ${repoName}
Languages: ${analysis.mainLanguages.join(', ')}
Key Files: ${analysis.keyFiles.join(', ')}
Summary: ${analysis.summary}
`;
      const docs = await generateDocumentation(contentSummary, repoName);
      setDocumentation(docs);
    } catch (err) {
      setError('Failed to generate documentation');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 px-4 py-3 font-medium text-sm ${
            activeTab === 'analysis'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Analysis
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex-1 px-4 py-3 font-medium text-sm ${
            activeTab === 'docs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Generated Docs
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'analysis' && (
          <div>
            <div className="space-y-4">
              {analysis.readme && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">README.md</h4>
                  <div className="max-h-96 overflow-y-auto bg-gray-50 p-3 rounded prose prose-sm">
                    <ReactMarkdown>{analysis.readme}</ReactMarkdown>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm mb-2">Main Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.mainLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Key Files</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.keyFiles.map((file) => (
                    <li key={file} className="text-sm text-gray-700">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div>
            {!documentation ? (
              <button
                onClick={handleGenerateDocs}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
              >
                {isLoading ? 'Generating...' : 'Generate Documentation'}
              </button>
            ) : (
              <div className="max-h-96 overflow-y-auto prose prose-sm">
                <ReactMarkdown>{documentation}</ReactMarkdown>
              </div>
            )}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
