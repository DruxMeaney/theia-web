'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useAppStore, colorForLabel } from '@/stores/app-store';
import { useCanvasStore } from '@/stores/canvas-store';
import { useToolStore } from '@/stores/tool-store';
import { useProjectStore } from '@/stores/project-store';
import { renderFrame, canvasToImgNorm, zoomKeepPointer } from './rendering';
import { hitTest } from './hit-test';
import { loadImage, invalidateCache } from '@/lib/image-loader';
import { BBox, ToolMode } from '@/lib/types';
import { Config } from '@/lib/config';

export default function ImageCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const imageRef = useRef<ImageBitmap | null>(null);
  const lastRelRef = useRef<string | null>(null);
  const imgRectRef = useRef<[number, number, number, number]>([0, 0, 0, 0]);

  // Pan/zoom drag state (not in Zustand for performance)
  const panAnchorRef = useRef<[number, number] | null>(null);
  const zoomAnchorRef = useRef<[number, number] | null>(null);
  const zoomStartRef = useRef(1);
  const adjAnchorRef = useRef<[number, number] | null>(null);
  const adjStartRef = useRef<[number, number]>([1, 1]);
  const dragRectRef = useRef<[number, number] | null>(null);
  const crossPosRef = useRef<[number, number] | null>(null);

  const [showLabelModal, setShowLabelModal] = useState(false);
  const [pendingBox, setPendingBox] = useState<[number, number, number, number] | null>(null);

  // Store selectors
  const currentRel = useAppStore((s) => s.currentRel);
  const entries = useAppStore((s) => s.entries);
  const labelColors = useAppStore((s) => s.labelColors);
  const labels = useAppStore((s) => s.labels);
  const addAnnotation = useAppStore((s) => s.addAnnotation);
  const updateAnnotation = useAppStore((s) => s.updateAnnotation);
  const removeAnnotation = useAppStore((s) => s.removeAnnotation);
  const log = useAppStore((s) => s.log);

  const canvasStore = useCanvasStore();
  const toolStore = useToolStore();
  const setDirty = useProjectStore((s) => s.setDirty);

  const entry = currentRel ? entries[currentRel] : null;

  // Load image when current changes
  useEffect(() => {
    if (!currentRel || !entry) {
      imageRef.current = null;
      lastRelRef.current = null;
      requestRender(false);
      return;
    }

    if (lastRelRef.current === currentRel && imageRef.current) {
      requestRender(false);
      return;
    }

    const fileSource = entry.rawUrl || entry.fileHandle || entry.file;
    if (!fileSource) return;

    loadImage(fileSource, currentRel).then((bmp) => {
      imageRef.current = bmp;
      lastRelRef.current = currentRel;
      canvasStore.resetView();
      requestRender(false);
    }).catch((err) => {
      console.error('Failed to load image:', err);
      imageRef.current = null;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRel]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
        canvasStore.setCanvasSize(rect.width, rect.height);
        requestRender(false);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestRender = useCallback((fast: boolean) => {
    canvasStore.requestRender(fast);
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(renderTick);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTick = useCallback(() => {
    rafRef.current = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = useCanvasStore.getState();
    const toolState = useToolStore.getState();
    const appState = useAppStore.getState();
    const entry = appState.currentRel ? appState.entries[appState.currentRel] : null;

    const result = renderFrame({
      ctx,
      image: imageRef.current,
      canvasW: canvas.width,
      canvasH: canvas.height,
      zoom: state.zoom,
      panX: state.panX,
      panY: state.panY,
      brightness: state.brightness,
      contrast: state.contrast,
      fast: state.dragOrZoomActive,
      annotations: entry?.annotations || [],
      selectedIndex: toolState.selectedAnnotationIndex,
      labelColors: appState.labelColors,
      activeTool: toolState.activeTool,
      crossPos: crossPosRef.current,
      imgRect: imgRectRef.current,
    });

    imgRectRef.current = result.imgRect;
    useCanvasStore.setState({
      baseScale: result.baseScale,
      offx: result.offx,
      offy: result.offy,
    });

    // Draw temp rectangle for label tool
    if (toolState.activeTool === 'label' && dragRectRef.current && toolState.dragStartCanvas) {
      const [x0, y0] = toolState.dragStartCanvas;
      const [x1, y1] = dragRectRef.current;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(
        Math.min(x0, x1), Math.min(y0, y1),
        Math.abs(x1 - x0), Math.abs(y1 - y0)
      );
      ctx.setLineDash([]);
    }

    // Draw adjust indicator
    if (toolState.activeTool === 'adjust' && adjAnchorRef.current) {
      const dx = (crossPosRef.current?.[0] || 0) - adjAnchorRef.current[0];
      const dy = (crossPosRef.current?.[1] || 0) - adjAnchorRef.current[1];
      const mode = Math.abs(dy) >= Math.abs(dx) ? 'brightness' : 'contrast';
      const label = mode === 'brightness' ? '☀ Brillo' : '◐ Contraste';
      const color = mode === 'brightness' ? '#facc15' : '#e5e7eb';

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(12, 12, 130, 28);
      ctx.strokeStyle = '#4b5563';
      ctx.strokeRect(12, 12, 130, 28);
      ctx.fillStyle = color;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(label, 22, 30);
    }

    useCanvasStore.setState({ renderDirty: false, dragOrZoomActive: false });

    // Schedule final HQ render after fast render
    if (state.dragOrZoomActive) {
      rafRef.current = requestAnimationFrame(renderTick);
    }
  }, []);

  // Mouse handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const button = e.button;

    const tool = useToolStore.getState().activeTool;
    const cs = useCanvasStore.getState();
    const appState = useAppStore.getState();
    const entry = appState.currentRel ? appState.entries[appState.currentRel] : null;

    if (button === 1) {
      // Middle button: pan
      panAnchorRef.current = [x, y];
      return;
    }

    if (button === 2) {
      // Right button: zoom
      e.preventDefault();
      zoomAnchorRef.current = [x, y];
      zoomStartRef.current = cs.zoom;
      return;
    }

    // Left button
    if (tool === 'pan') {
      panAnchorRef.current = [x, y];
    } else if (tool === 'adjust') {
      adjAnchorRef.current = [x, y];
      adjStartRef.current = [cs.brightness, cs.contrast];
    } else if (tool === 'label') {
      useToolStore.setState({ dragStartCanvas: [x, y] });
      dragRectRef.current = null;
    } else if (tool === 'select' && entry) {
      const scale = cs.baseScale * cs.zoom;
      const result = hitTest(x, y, entry.annotations, useToolStore.getState().selectedAnnotationIndex, {
        offx: cs.offx, offy: cs.offy, scale, width: entry.width, height: entry.height,
      });
      if (result.index !== null) {
        const b = entry.annotations[result.index];
        useToolStore.setState({
          selectedAnnotationIndex: result.index,
          editActive: result.index,
          editMode: result.mode,
          editStartCanvas: [x, y],
          editStartNorm: [b.xMin, b.yMin, b.xMax, b.yMax],
        });
      } else {
        useToolStore.setState({ selectedAnnotationIndex: null, editActive: null, editMode: null });
      }
      requestRender(false);
    }
  }, [requestRender]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    crossPosRef.current = [x, y];

    const tool = useToolStore.getState().activeTool;
    const cs = useCanvasStore.getState();

    // Pan (left or middle)
    if (panAnchorRef.current) {
      const [ax, ay] = panAnchorRef.current;
      canvasStore.addPan(x - ax, y - ay);
      panAnchorRef.current = [x, y];
      requestRender(true);
      return;
    }

    // Zoom drag (right button)
    if (zoomAnchorRef.current) {
      const dy = y - zoomAnchorRef.current[1];
      const factor = Math.pow(2, -dy / 120);
      const entry = useAppStore.getState().currentRel ? useAppStore.getState().entries[useAppStore.getState().currentRel!] : null;
      if (entry) {
        const result = zoomKeepPointer(
          x, y, zoomStartRef.current * factor,
          cs.canvasW, cs.canvasH, cs.offx, cs.offy,
          entry.width, entry.height, cs.baseScale, cs.zoom
        );
        useCanvasStore.setState({ zoom: result.zoom, panX: result.panX, panY: result.panY, offx: result.offx, offy: result.offy });
      }
      requestRender(true);
      return;
    }

    // Adjust drag
    if (adjAnchorRef.current) {
      const [ax, ay] = adjAnchorRef.current;
      const dx = x - ax;
      const dy = y - ay;
      const factor = 0.0015;
      const nb = Math.max(0.2, Math.min(2.0, adjStartRef.current[0] + (-dy) * factor));
      const nc = Math.max(0.2, Math.min(2.0, adjStartRef.current[1] + dx * factor));
      canvasStore.setBrightnessContrast(nb, nc);
      requestRender(true);
      return;
    }

    // Label tool drag
    if (tool === 'label' && useToolStore.getState().dragStartCanvas) {
      dragRectRef.current = [x, y];
      requestRender(true);
      return;
    }

    // Select tool drag (edit)
    const ts = useToolStore.getState();
    if (ts.editActive !== null && ts.editMode && ts.editStartCanvas && ts.editStartNorm) {
      const appState = useAppStore.getState();
      const entry = appState.currentRel ? appState.entries[appState.currentRel] : null;
      if (!entry) return;
      const b = entry.annotations[ts.editActive];
      if (!b) return;

      const scale = cs.baseScale * cs.zoom;
      const dw = entry.width * scale;
      const dh = entry.height * scale;
      const dx = x - ts.editStartCanvas[0];
      const dy = y - ts.editStartCanvas[1];
      const dxn = dx / dw;
      const dyn = dy / dh;
      const [sxn, syn, sxX, syY] = ts.editStartNorm;
      const mode = ts.editMode;

      let newBox: [number, number, number, number] = [sxn, syn, sxX, syY];
      if (mode === 'move') {
        newBox = [sxn + dxn, syn + dyn, sxX + dxn, syY + dyn];
      } else {
        if (mode.includes('l')) newBox[0] = sxn + dxn;
        if (mode.includes('r')) newBox[2] = sxX + dxn;
        if (mode.includes('t')) newBox[1] = syn + dyn;
        if (mode.includes('b')) newBox[3] = syY + dyn;
      }

      const updated = new BBox(b.displayName, newBox[0], newBox[1], newBox[2], newBox[3]);
      updated.normFix();
      appState.updateAnnotation(appState.currentRel!, ts.editActive, updated);
      setDirty(true);
      requestRender(true);
    }

    // Crosshair update for label tool
    if (tool === 'label') {
      requestRender(false);
    }
  }, [canvasStore, requestRender, setDirty]);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Pan release
    if (panAnchorRef.current) {
      panAnchorRef.current = null;
      requestRender(false);
      return;
    }

    // Zoom release
    if (zoomAnchorRef.current) {
      zoomAnchorRef.current = null;
      requestRender(false);
      return;
    }

    // Adjust release
    if (adjAnchorRef.current) {
      adjAnchorRef.current = null;
      requestRender(false);
      return;
    }

    const ts = useToolStore.getState();

    // Label tool release
    if (ts.activeTool === 'label' && ts.dragStartCanvas) {
      const [x0, y0] = ts.dragStartCanvas;
      useToolStore.setState({ dragStartCanvas: null });
      dragRectRef.current = null;

      const cs = useCanvasStore.getState();
      const appState = useAppStore.getState();
      const entry = appState.currentRel ? appState.entries[appState.currentRel] : null;
      if (!entry) return;

      const scale = cs.baseScale * cs.zoom;
      const [nx0, ny0] = canvasToImgNorm(Math.min(x0, x), Math.min(y0, y), cs.offx, cs.offy, entry.width, entry.height, scale);
      const [nx1, ny1] = canvasToImgNorm(Math.max(x0, x), Math.max(y0, y), cs.offx, cs.offy, entry.width, entry.height, scale);

      if ((nx1 - nx0) < Config.MIN_BOX || (ny1 - ny0) < Config.MIN_BOX) {
        requestRender(false);
        return;
      }

      setPendingBox([nx0, ny0, nx1, ny1]);
      setShowLabelModal(true);
      return;
    }

    // Select edit release
    if (ts.editActive !== null) {
      useToolStore.setState({ editActive: null, editMode: null, editStartNorm: null, editStartCanvas: null });
      setDirty(true);
      log('Caja editada.');
      requestRender(false);
    }
  }, [requestRender, setDirty, log]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 0.9;

    const cs = useCanvasStore.getState();
    const appState = useAppStore.getState();
    const entry = appState.currentRel ? appState.entries[appState.currentRel] : null;
    if (!entry) return;

    const result = zoomKeepPointer(
      x, y, cs.zoom * factor,
      cs.canvasW, cs.canvasH, cs.offx, cs.offy,
      entry.width, entry.height, cs.baseScale, cs.zoom
    );
    useCanvasStore.setState({ zoom: result.zoom, panX: result.panX, panY: result.panY, offx: result.offx, offy: result.offy });
    requestRender(true);
    // Schedule final render
    setTimeout(() => requestRender(false), 150);
  }, [requestRender]);

  const onDoubleClick = useCallback(() => {
    canvasStore.resetView();
    requestRender(false);
  }, [canvasStore, requestRender]);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Label modal selection
  const onLabelSelected = useCallback((label: string | null) => {
    setShowLabelModal(false);
    if (!label || !pendingBox) {
      requestRender(false);
      return;
    }

    const appState = useAppStore.getState();
    if (!appState.currentRel) return;

    const [x0, y0, x1, y1] = pendingBox;
    const bbox = new BBox(label, Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1));
    addAnnotation(appState.currentRel, bbox);
    setDirty(true);
    log(`Caja agregada: ${label}`);
    requestRender(false);
    setPendingBox(null);
  }, [pendingBox, addAnnotation, setDirty, log, requestRender]);

  const cursor = (() => {
    const tool = toolStore.activeTool;
    if (tool === 'pan') return 'grab';
    if (tool === 'label') return 'crosshair';
    if (tool === 'adjust') return 'ns-resize';
    if (tool === 'select') return 'default';
    return 'default';
  })();

  return (
    <div className="relative flex-1 flex flex-col">
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 no-select"
          style={{ cursor }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
        />
      </div>

      {/* Label Type Modal */}
      {showLabelModal && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-[#1f2937] border border-[#334155] rounded-xl p-4 w-[300px] shadow-xl">
            <h3 className="text-sm font-bold text-[#cbd5e1] mb-3">Selecciona el tipo:</h3>
            <div className="max-h-[250px] overflow-y-auto space-y-1">
              {labels.map((label) => (
                <button
                  key={label}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#e5e7eb] hover:bg-[#374151] transition-colors"
                  onClick={() => onLabelSelected(label)}
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colorForLabel(label, labelColors) }}
                  />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-3 py-1.5 rounded-lg text-xs bg-[#374151] text-[#e5e7eb] hover:bg-[#4b5563]"
                onClick={() => onLabelSelected(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
