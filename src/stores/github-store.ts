import { create } from 'zustand';
import type { GitHubConfig } from '@/lib/github-api';

interface GitHubState {
  config: GitHubConfig | null;
  connected: boolean;
  dataPath: string; // path within repo where images live (e.g. "public/data/MASTOGRAFIAS")

  setConfig: (config: GitHubConfig) => void;
  setConnected: (connected: boolean) => void;
  setDataPath: (path: string) => void;
  clear: () => void;
}

export const useGitHubStore = create<GitHubState>((set) => ({
  config: null,
  connected: false,
  dataPath: 'public/data/MASTOGRAFIAS',

  setConfig: (config) => set({ config, connected: true }),
  setConnected: (connected) => set({ connected }),
  setDataPath: (path) => set({ dataPath: path }),
  clear: () => set({ config: null, connected: false }),
}));
