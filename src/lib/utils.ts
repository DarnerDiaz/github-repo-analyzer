/**
 * Parses a GitHub repository URL to extract owner and repository name
 * @param {string} url - Full GitHub URL (e.g., 'https://github.com/user/repo' or 'https://github.com/user/repo.git')
 * @returns {{ owner: string; repo: string } | null} Parsed owner and repo, or null if URL is invalid
 * @example
 * ```typescript
 * parseGitHubUrl('https://github.com/DarnerDiaz/openapi-to-ts');  
 * // Returns: { owner: 'DarnerDiaz', repo: 'openapi-to-ts' }
 * ```
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2].replace('.git', ''),
  };
}

/**
 * Generates a unique ID combining timestamp and random string
 * @returns {string} Unique identifier in format: `{timestamp}-{randomstring}`
 * @example
 * ```typescript
 * const id = generateId();
 * // Returns: '1703010234567-a1b2c3d4e'
 * ```
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formats a Date object into a readable time string with AM/PM
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string (e.g., '09:30 AM')
 * @example
 * ```typescript
 * formatDate(new Date('2024-12-25T14:30:00Z'));
 * // Returns: '02:30 PM'
 * ```
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

export function getFileLanguage(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    php: 'php',
    sql: 'sql',
    html: 'html',
    css: 'css',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
  };

  return languageMap[ext || ''] || 'text';
}

export function isBinaryFile(filePath: string): boolean {
  const binaryExtensions = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'ico',
    'pdf',
    'zip',
    'rar',
    'bin',
    'exe',
    'dmg',
    'so',
  ];

  const ext = filePath.split('.').pop()?.toLowerCase();
  return binaryExtensions.includes(ext || '');
}

export function summarizeFileStructure(files: any[], maxItems: number = 50): string {
  const slice = files.slice(0, maxItems);
  return slice
    .map((f) => `${f.type === 'dir' ? '[DIR]' : '[FILE]'} ${f.path}`)
    .join('\n');
}
