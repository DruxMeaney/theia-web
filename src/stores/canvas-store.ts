import { create } from 'zustand';

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  baseScale: number;
  offx: number;
  offy: number;
  canvasW: number;
  canvasH: number;
  brightness: number;
  contrast: number;
  renderDirty: boolean;
  dragOrZoomActive: boolean;

  setZoom: (z: number) => void;
  setPan: (x: number, y: number) => void;
  addPan: (dx: number, dy: number) => void;
  setBaseScale: (s: number) => void;
  setOffset: (x: number, y: number) => void;
  setCanvasSize: (w: number, h: number) => void;
  setBrightness: (b: number) => void;
  setContrast: (c: number) => void;
  setBrightnessContrast: (b: number, c: number) => void;
  resetView: () => void;
  requestRender: (dragZoom: boolean) => void;
  clearRenderDirty: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  zoom: 1.0,
  panX: 0,
  panY: 0,
  baseScale: 1.0,
  offx: 0,
  offy: 0,
  canvasW: 900,
  canvasH: 650,
  brightness: 1.0,
  contrast: 1.0,
  renderDirty: false,
  dragOrZoomActive: false,

  setZoom: (z) => set({ zoom: z, renderDirty: true }),
  setPan: (x, y) => set({ panX: x, panY: y, renderDirty: true }),
  addPan: (dx, dy) => set((s) => ({ panX: s.panX + dx, panY: s.panY + dy, renderDirty: true })),
  setBaseScale: (s) => set({ baseScale: s }),
  setOffset: (x, y) => set({ offx: x, offy: y }),
  setCanvasSize: (w, h) => set({ canvasW: w, canvasH: h, renderDirty: true }),
  setBrightness: (b) => set({ brightness: b, renderDirty: true }),
  setContrast: (c) => set({ contrast: c, renderDirty: true }),
  setBrightnessContrast: (b, c) => set({ brightness: b, contrast: c, renderDirty: true }),
  resetView: () => set({
    zoom: 1.0,
    panX: 0,
    panY: 0,
    offx: 0,
    offy: 0,
    brightness: 1.0,
    contrast: 1.0,
    renderDirty: true,
  }),
  requestRender: (dragZoom) => set({ renderDirty: true, dragOrZoomActive: dragZoom }),
  clearRenderDirty: () => set({ renderDirty: false }),
}));
