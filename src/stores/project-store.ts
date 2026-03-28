import { create } from 'zustand';

interface ProjectState {
  projectName: string | null;
  projectFileHandle: FileSystemFileHandle | null;
  dirty: boolean;
  gcsPrefix: string;
  defaultMlUse: string;
  fixedAnnotationSetName: string;
  recentProjects: string[];

  setProjectName: (name: string | null) => void;
  setProjectFileHandle: (handle: FileSystemFileHandle | null) => void;
  setDirty: (dirty: boolean) => void;
  setGcsPrefix: (prefix: string) => void;
  setDefaultMlUse: (use: string) => void;
  addRecent: (name: string) => void;
  loadRecents: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: null,
  projectFileHandle: null,
  dirty: false,
  gcsPrefix: 'gs://your-bucket/path',
  defaultMlUse: 'training',
  fixedAnnotationSetName: 'local_annotations',
  recentProjects: [],

  setProjectName: (name) => set({ projectName: name }),
  setProjectFileHandle: (handle) => set({ projectFileHandle: handle }),
  setDirty: (dirty) => set({ dirty }),
  setGcsPrefix: (prefix) => set({ gcsPrefix: prefix }),
  setDefaultMlUse: (use) => set({ defaultMlUse: use }),

  addRecent: (name) => {
    const recents = get().recentProjects.filter((r) => r !== name);
    recents.unshift(name);
    if (recents.length > 10) recents.length = 10;
    set({ recentProjects: recents });
    try {
      localStorage.setItem('theia_recents', JSON.stringify(recents));
    } catch {}
  },

  loadRecents: () => {
    try {
      const data = localStorage.getItem('theia_recents');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          set({ recentProjects: parsed.filter((x: unknown) => typeof x === 'string') });
        }
      }
    } catch {}
  },
}));
