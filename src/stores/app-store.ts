import { create } from 'zustand';
import { ImageEntry, BBox, TreeNode } from '@/lib/types';

interface AppState {
  // Folder
  folder: string | null;
  folderHandle: FileSystemDirectoryHandle | null;

  // Images
  entries: Record<string, ImageEntry>;
  allRelPaths: string[];
  filteredRelPaths: string[];
  currentRel: string | null;

  // Labels
  labels: string[];
  labelColors: Record<string, string>;

  // Tree
  treeRoot: TreeNode | null;

  // Activity log
  activityLog: string[];

  // Actions
  setFolder: (folder: string | null, handle: FileSystemDirectoryHandle | null) => void;
  setEntries: (entries: Record<string, ImageEntry>, allRelPaths: string[]) => void;
  setCurrentRel: (rel: string | null) => void;
  setFilteredRelPaths: (paths: string[]) => void;
  setLabels: (labels: string[]) => void;
  updateLabelColors: () => void;
  addLabel: (label: string) => void;
  setTreeRoot: (root: TreeNode | null) => void;
  addAnnotation: (rel: string, bbox: BBox) => void;
  removeAnnotation: (rel: string, index: number) => void;
  updateAnnotation: (rel: string, index: number, bbox: BBox) => void;
  clearAnnotations: (rel: string) => void;
  setAnnotations: (rel: string, bboxes: BBox[]) => void;
  log: (msg: string) => void;
  clearLog: () => void;
}

const COLD_TO_WARM = ['#3b82f6', '#06b6d4', '#10b981', '#a3e635', '#f59e0b', '#f97316', '#ef4444'];
const COLOR_PALETTE = [
  '#60a5fa', '#34d399', '#f59e0b', '#ef4444', '#a78bfa', '#f472b6',
  '#2dd4bf', '#fb923c', '#22c55e', '#eab308', '#38bdf8', '#a3e635',
  '#f43f5e', '#8b5cf6',
];

function computeLabelColors(labels: string[]): Record<string, string> {
  const colors: Record<string, string> = {};
  if (!labels.length) return colors;
  const base = COLD_TO_WARM;
  const n = labels.length;
  if (n === 1) {
    colors[labels[0]] = base[base.length - 1];
    return colors;
  }
  for (let i = 0; i < n; i++) {
    const idx = Math.round(i * (base.length - 1) / (n - 1));
    colors[labels[i]] = base[idx];
  }
  return colors;
}

export function colorForLabel(displayName: string, labelColors: Record<string, string>): string {
  if (labelColors[displayName]) return labelColors[displayName];
  const hash = Math.abs([...displayName].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0));
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

export const useAppStore = create<AppState>((set, get) => ({
  folder: null,
  folderHandle: null,
  entries: {},
  allRelPaths: [],
  filteredRelPaths: [],
  currentRel: null,
  labels: [],
  labelColors: {},
  treeRoot: null,
  activityLog: [],

  setFolder: (folder, handle) => set({ folder, folderHandle: handle }),

  setEntries: (entries, allRelPaths) => set({ entries, allRelPaths, filteredRelPaths: [...allRelPaths] }),

  setCurrentRel: (rel) => set({ currentRel: rel }),

  setFilteredRelPaths: (paths) => set({ filteredRelPaths: paths }),

  setLabels: (labels) => {
    set({ labels, labelColors: computeLabelColors(labels) });
  },

  updateLabelColors: () => {
    const { labels } = get();
    set({ labelColors: computeLabelColors(labels) });
  },

  addLabel: (label) => {
    const { labels } = get();
    if (!labels.includes(label)) {
      const newLabels = [...labels, label];
      set({ labels: newLabels, labelColors: computeLabelColors(newLabels) });
    }
  },

  setTreeRoot: (root) => set({ treeRoot: root }),

  addAnnotation: (rel, bbox) => {
    const { entries } = get();
    const entry = entries[rel];
    if (!entry) return;
    entry.annotations = [...entry.annotations, bbox];
    set({ entries: { ...entries, [rel]: { ...entry, annotations: entry.annotations } } });
  },

  removeAnnotation: (rel, index) => {
    const { entries } = get();
    const entry = entries[rel];
    if (!entry) return;
    const anns = [...entry.annotations];
    anns.splice(index, 1);
    set({ entries: { ...entries, [rel]: { ...entry, annotations: anns } } });
  },

  updateAnnotation: (rel, index, bbox) => {
    const { entries } = get();
    const entry = entries[rel];
    if (!entry || index < 0 || index >= entry.annotations.length) return;
    const anns = [...entry.annotations];
    anns[index] = bbox;
    set({ entries: { ...entries, [rel]: { ...entry, annotations: anns } } });
  },

  clearAnnotations: (rel) => {
    const { entries } = get();
    const entry = entries[rel];
    if (!entry) return;
    set({ entries: { ...entries, [rel]: { ...entry, annotations: [] } } });
  },

  setAnnotations: (rel, bboxes) => {
    const { entries } = get();
    const entry = entries[rel];
    if (!entry) return;
    set({ entries: { ...entries, [rel]: { ...entry, annotations: bboxes } } });
  },

  log: (msg) => {
    const ts = new Date().toLocaleTimeString('es-MX', { hour12: false });
    set((s) => ({ activityLog: [...s.activityLog, `[${ts}] ${msg}`] }));
  },

  clearLog: () => set({ activityLog: [] }),
}));
