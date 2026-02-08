import { Octokit } from '@octokit/rest';
import { Repository, RepositoryFile, AnalysisResult } from '@/types';

const octokit = new Octokit();

export async function getRepositoryInfo(
  owner: string,
  repo: string
): Promise<Repository> {
  const { data } = await octokit.repos.get({
    owner,
    repo,
  });

  return {
    owner,
    repo,
    url: data.html_url,
    description: data.description || '',
    language: data.language || 'Unknown',
    stars: data.stargazers_count,
    forks: data.forks_count,
  };
}

export async function getRepositoryStructure(
  owner: string,
  repo: string,
  path: string = ''
): Promise<RepositoryFile[]> {
  try {
    const options: any = {
      owner,
      repo,
    };
    
    if (path) {
      options.path = path;
    }
    
    const { data } = await octokit.repos.getContent(options);

    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: item.type as 'file' | 'dir',
        size: item.size || 0,
      }));
    } else {
      return [
        {
          name: (data as any).name,
          path: (data as any).path,
          type: 'file',
          size: (data as any).size || 0,
        },
      ];
    }
  } catch (error) {
    console.error('Error fetching repository structure:', error);
    return [];
  }
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (typeof data === 'object' && 'content' in data) {
      const content = (data as any).content;
      return Buffer.from(content, 'base64').toString('utf-8');
    }

    return '';
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
}

export async function getREADME(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const content = await getFileContent(owner, repo, 'README.md');
    return content || null;
  } catch {
    try {
      const content = await getFileContent(owner, repo, 'readme.md');
      return content || null;
    } catch {
      return null;
    }
  }
}

export async function searchFiles(
  owner: string,
  repo: string,
  query: string
): Promise<RepositoryFile[]> {
  try {
    const { data } = await octokit.search.code({
      q: `${query} repo:${owner}/${repo}`,
      per_page: 10,
    });

    return data.items.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: 'file',
      size: item.size || 0,
    }));
  } catch (error) {
    console.error('Error searching files:', error);
    return [];
  }
}

export async function analyzeRepository(
  owner: string,
  repo: string
): Promise<AnalysisResult> {
  try {
    const structure = await getRepositoryStructure(owner, repo);
    const readme = await getREADME(owner, repo);

    // Get main programming languages
    const { data: languages } = await octokit.repos.listLanguages({
      owner,
      repo,
    });

    const mainLanguages = Object.keys(languages).slice(0, 5);

    // Identify key files
    const keyFileNames = [
      'package.json',
      'requirements.txt',
      'setup.py',
      'Dockerfile',
      '.github/workflows',
      'tsconfig.json',
      'webpack.config.js',
      'next.config.js',
    ];

    const keyFiles = structure
      .filter((file) => keyFileNames.some((name) => file.path.includes(name)))
      .map((file) => file.path);

    return {
      summary: `Repository ${owner}/${repo} is a ${mainLanguages[0] || 'multi-language'} project with ${structure.length} items`,
      mainLanguages,
      keyFiles,
      structure,
      readme: readme || undefined,
    };
  } catch (error) {
    console.error('Error analyzing repository:', error);
    return {
      summary: 'Error analyzing repository',
      mainLanguages: [],
      keyFiles: [],
      structure: [],
    };
  }
}
