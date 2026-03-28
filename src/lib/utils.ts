import { BBox } from './types';

export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

export function nowHHMMSS(): string {
  const d = new Date();
  return d.toLocaleTimeString('es-MX', { hour12: false });
}

export function bboxText(i: number, b: BBox): string {
  const f = (v: number) => v.toFixed(4);
  return `[${i}] ${b.displayName} x(${f(b.xMin)}–${f(b.xMax)}) y(${f(b.yMin)}–${f(b.yMax)})`;
}

export function getFileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot).toLowerCase() : '';
}

export function basename(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] || '';
}

export function dirname(path: string): string {
  const normalized = path.replace(/\\/g, '/');
  const idx = normalized.lastIndexOf('/');
  if (idx < 0) return '';
  return normalized.slice(0, idx);
}
