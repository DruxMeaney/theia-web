import { create } from 'zustand';
import type { ToolMode, HitMode } from '@/lib/types';

interface ToolState {
  activeTool: ToolMode;
  modalOpen: boolean;
  selectedAnnotationIndex: number | null;

  // Drag state
  dragStartCanvas: [number, number] | null;
  editActive: number | null;
  editMode: HitMode | null;
  editStartNorm: [number, number, number, number] | null;
  editStartCanvas: [number, number] | null;

  setTool: (tool: ToolMode) => void;
  setModalOpen: (open: boolean) => void;
  setSelectedAnnotation: (idx: number | null) => void;
  setDragStart: (pos: [number, number] | null) => void;
  setEditState: (active: number | null, mode: HitMode | null, startNorm: [number, number, number, number] | null, startCanvas: [number, number] | null) => void;
  clearEdit: () => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: null,
  modalOpen: false,
  selectedAnnotationIndex: null,
  dragStartCanvas: null,
  editActive: null,
  editMode: null,
  editStartNorm: null,
  editStartCanvas: null,

  setTool: (tool) => set({
    activeTool: tool,
    editActive: null,
    editMode: null,
    editStartNorm: null,
    editStartCanvas: null,
  }),

  setModalOpen: (open) => set({ modalOpen: open }),
  setSelectedAnnotation: (idx) => set({ selectedAnnotationIndex: idx }),
  setDragStart: (pos) => set({ dragStartCanvas: pos }),

  setEditState: (active, mode, startNorm, startCanvas) => set({
    editActive: active,
    editMode: mode,
    editStartNorm: startNorm,
    editStartCanvas: startCanvas,
  }),

  clearEdit: () => set({
    editActive: null,
    editMode: null,
    editStartNorm: null,
    editStartCanvas: null,
  }),
}));
