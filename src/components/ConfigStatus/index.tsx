'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConfigStatusProps {
  hasApiKey: boolean;
}

export default function ConfigStatus({ hasApiKey }: ConfigStatusProps) {
  if (hasApiKey) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
        <CheckCircle2 size={18} className="flex-shrink-0" />
        <span>AI features are active and ready to use!</span>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="flex-shrink-0 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 mb-2">
            AI Features Not Configured
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            To enable AI-powered analysis and chat, you need to configure your Google Gemini API key.
          </p>
          <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
            <li>
              Get a free API key from{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-yellow-900"
              >
                Google AI Studio
              </a>
            </li>
            <li>
              Add to{' '}
              <code className="bg-yellow-100 px-1.5 py-0.5 rounded text-xs">
                .env.local
              </code>
              : <code className="bg-yellow-100 px-1.5 py-0.5 rounded text-xs">
                NEXT_PUBLIC_GEMINI_API_KEY=your_key
              </code>
            </li>
            <li>Restart the dev server</li>
          </ol>
          <p className="text-xs text-yellow-700 mt-3">
            See{' '}
            <a
              href="/API_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-yellow-800"
            >
              API_SETUP.md
            </a>{' '}
            for detailed instructions
          </p>
        </div>
      </div>
    </div>
  );
}
