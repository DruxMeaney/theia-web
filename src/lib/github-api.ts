/**
 * GitHub API integration for THEIA
 * Handles reading files, listing directories, and writing files to a GitHub repository.
 * Images are served via raw.githubusercontent.com for performance.
 */

const GITHUB_API = 'https://api.github.com';

export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
  download_url: string | null;
}

/**
 * Get the raw URL for a file in the repo
 */
export function getRawUrl(config: GitHubConfig, path: string): string {
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${path}`;
}

/**
 * List contents of a directory in the repo
 */
export async function listDirectory(
  config: GitHubConfig,
  path: string
): Promise<GitHubFile[]> {
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Expected directory listing but got a file');
  }

  return data.map((item: Record<string, unknown>) => ({
    name: item.name as string,
    path: item.path as string,
    type: item.type as 'file' | 'dir',
    size: (item.size as number) || 0,
    sha: item.sha as string,
    download_url: (item.download_url as string) || null,
  }));
}

/**
 * Recursively scan a directory in the repo for supported image files
 */
export async function scanRepoDirectory(
  config: GitHubConfig,
  basePath: string,
  supportedExts: Set<string>
): Promise<{ relPath: string; rawUrl: string; size: number }[]> {
  const results: { relPath: string; rawUrl: string; size: number }[] = [];

  async function scan(dirPath: string, relPrefix: string) {
    const items = await listDirectory(config, dirPath);

    for (const item of items) {
      if (item.type === 'dir') {
        const newRel = relPrefix ? `${relPrefix}/${item.name}` : item.name;
        await scan(item.path, newRel);
      } else if (item.type === 'file') {
        const ext = '.' + item.name.split('.').pop()?.toLowerCase();
        if (supportedExts.has(ext)) {
          const relPath = relPrefix ? `${relPrefix}/${item.name}` : item.name;
          results.push({
            relPath,
            rawUrl: getRawUrl(config, item.path),
            size: item.size,
          });
        }
      }
    }
  }

  await scan(basePath, '');
  return results;
}

/**
 * Read a text file from the repo
 */
export async function readFileContent(
  config: GitHubConfig,
  path: string
): Promise<string> {
  const url = getRawUrl(config, path);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.text();
}

/**
 * Write/update a file in the repo via GitHub Contents API
 */
export async function writeFileToRepo(
  config: GitHubConfig,
  path: string,
  content: string,
  message: string
): Promise<{ sha: string }> {
  // First, try to get the current file SHA (needed for updates)
  let existingSha: string | undefined;
  try {
    const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      existingSha = data.sha;
    }
  } catch {
    // File doesn't exist yet, that's fine
  }

  // Create or update the file
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${path}`;
  const body: Record<string, unknown> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))), // UTF-8 safe base64
    branch: config.branch,
  };
  if (existingSha) {
    body.sha = existingSha;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to write ${path}: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  return { sha: data.content.sha };
}

/**
 * Upload a binary file (image) to the repo
 */
export async function uploadBinaryFile(
  config: GitHubConfig,
  path: string,
  file: File,
  message: string
): Promise<{ sha: string }> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${path}`;
  const body: Record<string, unknown> = {
    message,
    content: base64,
    branch: config.branch,
  };

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload ${path}: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  return { sha: data.content.sha };
}

/**
 * Load an image from a raw GitHub URL as ImageBitmap
 */
export async function loadImageFromUrl(url: string): Promise<ImageBitmap> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

/**
 * Probe image dimensions from a raw GitHub URL
 */
export async function probeImageFromUrl(url: string): Promise<{ width: number; height: number }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
  const blob = await res.blob();
  const bmp = await createImageBitmap(blob);
  const { width, height } = bmp;
  bmp.close();
  return { width, height };
}

/**
 * Read labels.json from repo if it exists
 */
export async function loadLabelsFromRepo(
  config: GitHubConfig,
  dataPath: string
): Promise<string[]> {
  try {
    const content = await readFileContent(config, `${dataPath}/labels.json`);
    const data = JSON.parse(content);
    if (Array.isArray(data)) return data.map(String).filter(Boolean);
    if (data?.labels && Array.isArray(data.labels)) return data.labels.map(String).filter(Boolean);
  } catch {
    // No labels.json found
  }
  return [];
}

/**
 * Store GitHub config in localStorage
 */
export function saveGitHubConfig(config: GitHubConfig): void {
  localStorage.setItem('theia_github_config', JSON.stringify(config));
}

/**
 * Load GitHub config from localStorage
 */
export function loadGitHubConfig(): GitHubConfig | null {
  try {
    const data = localStorage.getItem('theia_github_config');
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}
