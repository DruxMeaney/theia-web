import { BBox, HitMode } from '@/lib/types';
import { Config } from '@/lib/config';

interface CanvasCoords {
  offx: number;
  offy: number;
  scale: number;
  width: number;
  height: number;
}

function imgToCanvas(xn: number, yn: number, c: CanvasCoords): [number, number] {
  return [c.offx + xn * c.width * c.scale, c.offy + yn * c.height * c.scale];
}

export function hitTest(
  cx: number,
  cy: number,
  annotations: BBox[],
  selectedIndex: number | null,
  coords: CanvasCoords
): { index: number | null; mode: HitMode | null } {
  if (!annotations.length) return { index: null, mode: null };

  // Prioritize selected annotation
  const candidates = [...Array(annotations.length).keys()];
  if (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < annotations.length) {
    const idx = candidates.indexOf(selectedIndex);
    if (idx > 0) {
      candidates.splice(idx, 1);
      candidates.unshift(selectedIndex);
    }
  }

  for (const i of candidates) {
    const b = annotations[i];
    const [x0, y0] = imgToCanvas(b.xMin, b.yMin, coords);
    const [x1, y1] = imgToCanvas(b.xMax, b.yMax, coords);

    // Check handles first
    const handles: [string, number, number][] = [
      ['tl', x0, y0], ['tr', x1, y0], ['bl', x0, y1], ['br', x1, y1],
      ['l', x0, (y0 + y1) / 2], ['r', x1, (y0 + y1) / 2],
      ['t', (x0 + x1) / 2, y0], ['b', (x0 + x1) / 2, y1],
    ];

    for (const [k, hx, hy] of handles) {
      if (Math.abs(cx - hx) <= Config.HANDLE_R && Math.abs(cy - hy) <= Config.HANDLE_R) {
        return { index: i, mode: k as HitMode };
      }
    }

    // Check box containment
    if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) {
      return { index: i, mode: 'move' };
    }
  }

  return { index: null, mode: null };
}
