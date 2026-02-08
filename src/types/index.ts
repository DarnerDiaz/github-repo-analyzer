export interface Repository {
  owner: string;
  repo: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
}

export interface RepositoryFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  content?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: string[];
}

export interface AnalysisResult {
  summary: string;
  mainLanguages: string[];
  keyFiles: string[];
  structure: RepositoryFile[];
  readme?: string;
}

export interface ChatContextData {
  repository: Repository;
  files: RepositoryFile[];
  analysis: AnalysisResult;
  messages: ChatMessage[];
}
