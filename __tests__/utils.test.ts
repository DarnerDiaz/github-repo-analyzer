import { describe, it, expect } from 'vitest';
import {
  parseGitHubUrl,
  generateId,
  formatDate,
  truncateString,
  getFileLanguage,
  isBinaryFile,
  summarizeFileStructure,
} from '../src/lib/utils';

describe('Utils - parseGitHubUrl', () => {
  it('should parse standard GitHub URL', () => {
    const result = parseGitHubUrl('https://github.com/DarnerDiaz/openapi-to-ts');
    expect(result).toEqual({ owner: 'DarnerDiaz', repo: 'openapi-to-ts' });
  });

  it('should parse GitHub URL with .git suffix', () => {
    const result = parseGitHubUrl('https://github.com/microsoft/vscode.git');
    expect(result).toEqual({ owner: 'microsoft', repo: 'vscode' });
  });

  it('should parse URL with http protocol', () => {
    const result = parseGitHubUrl('http://github.com/facebook/react');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('should return null for invalid URL', () => {
    expect(parseGitHubUrl('https://gitlab.com/user/repo')).toBeNull();
    expect(parseGitHubUrl('not a url')).toBeNull();
    expect(parseGitHubUrl('github.com/incomplete')).toBeNull();
  });

  it('should handle URLs with special characters in owner or repo', () => {
    const result = parseGitHubUrl('https://github.com/user-name/repo-name');
    expect(result).toEqual({ owner: 'user-name', repo: 'repo-name' });
  });

  it('should handle empty string', () => {
    expect(parseGitHubUrl('')).toBeNull();
  });
});

describe('Utils - generateId', () => {
  it('should generate a string ID', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should include timestamp and random component', () => {
    const id = generateId();
    const parts = id.split('-');
    expect(parts.length).toBe(2);
    expect(/^\d+$/.test(parts[0])).toBe(true); // timestamp
    expect(/^[a-z0-9]+$/.test(parts[1])).toBe(true); // random
  });

  it('should generate consistent format', () => {
    const ids = Array.from({ length: 5 }, () => generateId());
    ids.forEach(id => {
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });
});

describe('Utils - formatDate', () => {
  it('should format date with correct locale', () => {
    const date = new Date('2024-12-25T14:30:00Z');
    const result = formatDate(date);
    expect(result).toContain(':');
    expect(result).toContain('AM') || expect(result).toContain('PM');
  });

  it('should handle different times correctly', () => {
    const morning = new Date('2024-12-25T08:15:00Z');
    const afternoon = new Date('2024-12-25T14:30:00Z');
    const morning_result = formatDate(morning);
    const afternoon_result = formatDate(afternoon);
    expect(morning_result).not.toBe(afternoon_result);
  });

  it('should format with leading zeros for hour and minute', () => {
    const date = new Date('2024-12-25T09:05:00Z');
    const result = formatDate(date);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('should be consistent for same date', () => {
    const date = new Date('2024-12-25T14:30:00Z');
    const result1 = formatDate(date);
    const result2 = formatDate(date);
    expect(result1).toBe(result2);
  });
});

describe('Utils - truncateString', () => {
  it('should not truncate string shorter than max length', () => {
    const result = truncateString('hello', 10);
    expect(result).toBe('hello');
  });

  it('should truncate string longer than max length', () => {
    const result = truncateString('hello world', 5);
    expect(result).toBe('hello...');
  });

  it('should add ellipsis to truncated strings', () => {
    const result = truncateString('hello world', 8);
    expect(result).toBe('hello wo...');
    expect(result.endsWith('...')).toBe(true);
  });

  it('should handle exact length match', () => {
    const result = truncateString('hello', 5);
    expect(result).toBe('hello');
  });

  it('should handle empty string', () => {
    const result = truncateString('', 10);
    expect(result).toBe('');
  });

  it('should work with max length of 1', () => {
    const result = truncateString('hello', 1);
    expect(result).toBe('h...');
  });

  it('should preserve text before truncation', () => {
    const result = truncateString('abcdefghij', 5);
    expect(result).toContain('abcde');
  });

  it('should handle very long strings', () => {
    const longStr = 'a'.repeat(1000);
    const result = truncateString(longStr, 50);
    expect(result.length).toBe(53); // 50 + '...'
  });
});

describe('Utils - getFileLanguage', () => {
  it('should detect TypeScript files', () => {
    expect(getFileLanguage('index.ts')).toBe('typescript');
    expect(getFileLanguage('app.tsx')).toBe('tsx');
  });

  it('should detect JavaScript files', () => {
    expect(getFileLanguage('script.js')).toBe('javascript');
    expect(getFileLanguage('component.jsx')).toBe('jsx');
  });

  it('should detect Python files', () => {
    expect(getFileLanguage('script.py')).toBe('python');
  });

  it('should detect web files', () => {
    expect(getFileLanguage('index.html')).toBe('html');
    expect(getFileLanguage('style.css')).toBe('css');
    expect(getFileLanguage('data.json')).toBe('json');
  });

  it('should detect compiled languages', () => {
    expect(getFileLanguage('program.java')).toBe('java');
    expect(getFileLanguage('main.cpp')).toBe('cpp');
    expect(getFileLanguage('code.cs')).toBe('csharp');
  });

  it('should detect other languages', () => {
    expect(getFileLanguage('script.rb')).toBe('ruby');
    expect(getFileLanguage('main.go')).toBe('go');
    expect(getFileLanguage('lib.rs')).toBe('rust');
  });

  it('should be case insensitive', () => {
    expect(getFileLanguage('index.TS')).toBe('typescript');
    expect(getFileLanguage('script.PY')).toBe('python');
  });

  it('should handle files without extension', () => {
    expect(getFileLanguage('Makefile')).toBe('text');
    expect(getFileLanguage('README')).toBe('text');
  });

  it('should handle yaml extensions', () => {
    expect(getFileLanguage('config.yaml')).toBe('yaml');
    expect(getFileLanguage('config.yml')).toBe('yaml');
  });
});

describe('Utils - isBinaryFile', () => {
  it('should identify image files as binary', () => {
    expect(isBinaryFile('image.png')).toBe(true);
    expect(isBinaryFile('photo.jpg')).toBe(true);
    expect(isBinaryFile('pic.jpeg')).toBe(true);
    expect(isBinaryFile('icon.gif')).toBe(true);
    expect(isBinaryFile('favicon.ico')).toBe(true);
  });

  it('should identify document files as binary', () => {
    expect(isBinaryFile('document.pdf')).toBe(true);
  });

  it('should identify archive files as binary', () => {
    expect(isBinaryFile('archive.zip')).toBe(true);
    expect(isBinaryFile('backup.rar')).toBe(true);
  });

  it('should identify executable files as binary', () => {
    expect(isBinaryFile('program.exe')).toBe(true);
    expect(isBinaryFile('app.dmg')).toBe(true);
    expect(isBinaryFile('lib.so')).toBe(true);
  });

  it('should identify binary format files', () => {
    expect(isBinaryFile('data.bin')).toBe(true);
  });

  it('should not identify text files as binary', () => {
    expect(isBinaryFile('script.ts')).toBe(false);
    expect(isBinaryFile('readme.md')).toBe(false);
    expect(isBinaryFile('config.json')).toBe(false);
    expect(isBinaryFile('style.css')).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(isBinaryFile('image.PNG')).toBe(true);
    expect(isBinaryFile('script.TS')).toBe(false);
  });

  it('should handle files without extension', () => {
    expect(isBinaryFile('Makefile')).toBe(false);
  });
});

describe('Utils - summarizeFileStructure', () => {
  it('should format files with correct type indicator', () => {
    const files = [
      { type: 'file', path: 'src/index.ts' },
      { type: 'dir', path: 'src' },
    ];
    const result = summarizeFileStructure(files);
    expect(result).toContain('[FILE] src/index.ts');
    expect(result).toContain('[DIR] src');
  });

  it('should limit to max items', () => {
    const files = Array.from({ length: 100 }, (_, i) => ({
      type: 'file',
      path: `file${i}.ts`,
    }));
    const result = summarizeFileStructure(files, 10);
    const lines = result.split('\n');
    expect(lines.length).toBe(10);
  });

  it('should use default max items of 50', () => {
    const files = Array.from({ length: 100 }, (_, i) => ({
      type: 'file',
      path: `file${i}.ts`,
    }));
    const result = summarizeFileStructure(files);
    const lines = result.split('\n');
    expect(lines.length).toBe(50);
  });

  it('should handle empty array', () => {
    const result = summarizeFileStructure([], 10);
    expect(result).toBe('');
  });

  it('should handle array smaller than max items', () => {
    const files = [
      { type: 'file', path: 'file1.ts' },
      { type: 'file', path: 'file2.ts' },
    ];
    const result = summarizeFileStructure(files, 10);
    const lines = result.split('\n');
    expect(lines.length).toBe(2);
  });

  it('should preserve file order', () => {
    const files = [
      { type: 'file', path: 'z.ts' },
      { type: 'file', path: 'a.ts' },
      { type: 'file', path: 'm.ts' },
    ];
    const result = summarizeFileStructure(files);
    const lines = result.split('\n');
    expect(lines[0]).toContain('z.ts');
    expect(lines[1]).toContain('a.ts');
    expect(lines[2]).toContain('m.ts');
  });

  it('should join with newlines', () => {
    const files = [
      { type: 'file', path: 'file1.ts' },
      { type: 'file', path: 'file2.ts' },
    ];
    const result = summarizeFileStructure(files);
    expect(result.split('\n').length).toBe(2);
    expect(result).toContain('\n');
  });
});
