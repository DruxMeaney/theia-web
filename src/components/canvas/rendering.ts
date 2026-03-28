import { BBox } from '@/lib/types';
import { Config } from '@/lib/config';
import { colorForLabel } from '@/stores/app-store';

export interface RenderParams {
  ctx: CanvasRenderingContext2D;
  image: ImageBitmap | null;
  canvasW: number;
  canvasH: number;
  zoom: number;
  panX: number;
  panY: number;
  brightness: number;
  contrast: number;
  fast: boolean;
  annotations: BBox[];
  selectedIndex: number | null;
  labelColors: Record<string, string>;
  activeTool: string | null;
  crossPos: [number, number] | null;
  imgRect: [number, number, number, number]; // output: offx, offy, offx+nw, offy+nh
}

export interface RenderResult {
  baseScale: number;
  offx: number;
  offy: number;
  imgRect: [number, number, number, number];
}

export function renderFrame(p: RenderParams): RenderResult {
  const { ctx, canvasW, canvasH } = p;

  // Clear
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvasW, canvasH);

  if (!p.image) {
    return { baseScale: 1, offx: 0, offy: 0, imgRect: [0, 0, 0, 0] };
  }

  const iw = p.image.width;
  const ih = p.image.height;
  const baseScale = Math.min(canvasW / iw, canvasH / ih);
  const scale = baseScale * p.zoom;
  const nw = Math.max(1, Math.round(iw * scale));
  const nh = Math.max(1, Math.round(ih * scale));

  const offx = (canvasW - nw) / 2 + p.panX;
  const offy = (canvasH - nh) / 2 + p.panY;
  const imgRect: [number, number, number, number] = [offx, offy, offx + nw, offy + nh];

  // Calculate visible region
  const visL = Math.max(0, offx);
  const visT = Math.max(0, offy);
  const visR = Math.min(canvasW, offx + nw);
  const visB = Math.min(canvasH, offy + nh);

  if (visR > visL && visB > visT) {
    // Source crop coordinates
    const srcL = Math.max(0, (visL - offx) / scale);
    const srcT = Math.max(0, (visT - offy) / scale);
    const srcR = Math.min(iw, Math.ceil((visR - offx) / scale));
    const srcB = Math.min(ih, Math.ceil((visB - offy) / scale));

    // Set rendering quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = p.fast ? 'low' : 'high';

    // Apply brightness/contrast via CSS filter
    const needsFilter = Math.abs(p.brightness - 1) > 0.001 || Math.abs(p.contrast - 1) > 0.001;
    if (needsFilter) {
      ctx.filter = `brightness(${p.brightness}) contrast(${p.contrast})`;
    } else {
      ctx.filter = 'none';
    }

    // Draw visible portion
    ctx.drawImage(
      p.image,
      srcL, srcT, srcR - srcL, srcB - srcT,
      visL, visT, visR - visL, visB - visT
    );

    // Reset filter
    ctx.filter = 'none';
  }

  // Draw bounding boxes
  drawAllBoxes(ctx, p.annotations, p.selectedIndex, p.labelColors, offx, offy, iw, ih, scale);

  // Draw crosshair for label tool
  if (p.activeTool === 'label' && p.crossPos) {
    const [cx, cy] = p.crossPos;
    if (cx >= imgRect[0] && cx <= imgRect[2] && cy >= imgRect[1] && cy <= imgRect[3]) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, canvasH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(canvasW, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Draw HUD
  drawHud(ctx, canvasH, p.brightness, p.contrast, p.zoom);

  return { baseScale, offx, offy, imgRect };
}

function drawAllBoxes(
  ctx: CanvasRenderingContext2D,
  annotations: BBox[],
  selectedIndex: number | null,
  labelColors: Record<string, string>,
  offx: number, offy: number,
  imgW: number, imgH: number,
  scale: number
) {
  for (let i = 0; i < annotations.length; i++) {
    const b = annotations[i];
    const x0 = offx + b.xMin * imgW * scale;
    const y0 = offy + b.yMin * imgH * scale;
    const x1 = offx + b.xMax * imgW * scale;
    const y1 = offy + b.yMax * imgH * scale;
    const color = colorForLabel(b.displayName, labelColors);
    const isSelected = i === selectedIndex;
    const lineWidth = isSelected ? 3 : 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);

    // Label text
    ctx.fillStyle = color;
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(b.displayName, x0 + 4, Math.max(y0 - 6, 14));

    // Draw handles for selected
    if (isSelected) {
      drawHandles(ctx, x0, y0, x1, y1, color);
    }
  }
}

function drawHandles(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number, x1: number, y1: number,
  color: string
) {
  const R = Config.HANDLE_R;
  const points: [number, number][] = [
    [x0, y0], [x1, y0], [x0, y1], [x1, y1],
    [x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2],
    [(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1],
  ];

  for (const [cx, cy] of points) {
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  canvasH: number,
  brightness: number,
  contrast: number,
  zoom: number
) {
  const bVal = Math.round((brightness - 1) * 100);
  const cVal = Math.round((contrast - 1) * 100);
  const zVal = Math.round(zoom * 100);

  const fmt = (v: number) => (v >= 0 ? `+${v}` : `${v}`);
  const lines = [
    `Brillo: ${fmt(bVal)}`,
    `Contraste: ${fmt(cVal)}`,
    `Zoom: ${zVal}%`,
  ];

  const lineH = 16;
  const padX = 10;
  const padY = 6;
  const boxW = 140;
  const boxH = lineH * lines.length + padY * 2;
  const x0 = 12;
  const y1 = canvasH - 12;
  const y0 = y1 - boxH;

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x0, y0, boxW, boxH);
  ctx.strokeStyle = '#4b5563';
  ctx.lineWidth = 1;
  ctx.strokeRect(x0, y0, boxW, boxH);

  ctx.fillStyle = '#e5e7eb';
  ctx.font = '10px Inter, monospace';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x0 + padX, y0 + padY + lineH * (i + 0.8));
  }
}

// Coordinate conversion utilities
export function imgToCanvas(
  xn: number, yn: number,
  offx: number, offy: number,
  imgW: number, imgH: number,
  scale: number
): [number, number] {
  return [offx + xn * imgW * scale, offy + yn * imgH * scale];
}

export function canvasToImgNorm(
  cx: number, cy: number,
  offx: number, offy: number,
  imgW: number, imgH: number,
  scale: number
): [number, number] {
  const x = Math.max(0, Math.min(1, (cx - offx) / (imgW * scale)));
  const y = Math.max(0, Math.min(1, (cy - offy) / (imgH * scale)));
  return [x, y];
}

export function zoomKeepPointer(
  px: number, py: number,
  newZoom: number,
  canvasW: number, canvasH: number,
  offx: number, offy: number,
  imgW: number, imgH: number,
  baseScale: number,
  currentZoom: number
): { zoom: number; panX: number; panY: number; offx: number; offy: number } {
  const clampedZoom = Math.max(Config.ZOOM_MIN, Math.min(Config.ZOOM_MAX, newZoom));
  const oldScale = baseScale * currentZoom;
  const xn = Math.max(0, Math.min(1, (px - offx) / (imgW * oldScale)));
  const yn = Math.max(0, Math.min(1, (py - offy) / (imgH * oldScale)));

  const newScale = baseScale * clampedZoom;
  const nx = xn * imgW * newScale;
  const ny = yn * imgH * newScale;
  const newOffx = px - nx;
  const newOffy = py - ny;
  const nw = imgW * newScale;
  const nh = imgH * newScale;
  const centerOffx = (canvasW - nw) / 2;
  const centerOffy = (canvasH - nh) / 2;

  return {
    zoom: clampedZoom,
    panX: newOffx - centerOffx,
    panY: newOffy - centerOffy,
    offx: newOffx,
    offy: newOffy,
  };
}
