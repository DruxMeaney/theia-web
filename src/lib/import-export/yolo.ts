import type { ImageEntry } from '@/lib/types';
import { basename } from '@/lib/utils';

/**
 * Export YOLO format.
 * Returns a Map where key is "yolo_labels/basename.txt" and value is lines of
 * "class cx cy w h" (normalized). Also includes "yolo_labels/classes.txt".
 */
export function exportYolo(
  allRelPaths: string[],
  entries: Record<string, ImageEntry>,
  labels: string[],
): Map<string, string> {
  const files = new Map<string, string>();

  // classes.txt
  files.set('yolo_labels/classes.txt', labels.join('\n') + '\n');

  const clsMap: Record<string, number> = {};
  labels.forEach((name, i) => {
    clsMap[name] = i;
  });

  for (const rel of allRelPaths) {
    const ent = entries[rel];
    if (!ent) continue;

    const base = basename(rel);
    const stem = base.lastIndexOf('.') >= 0
      ? base.slice(0, base.lastIndexOf('.'))
      : base;
    const outName = `yolo_labels/${stem}.txt`;

    const lines: string[] = [];
    for (const b of ent.annotations) {
      if (!(b.displayName in clsMap)) continue;
      const cx = (b.xMin + b.xMax) / 2.0;
      const cy = (b.yMin + b.yMax) / 2.0;
      const w = b.xMax - b.xMin;
      const h = b.yMax - b.yMin;
      lines.push(
        `${clsMap[b.displayName]} ${cx.toFixed(6)} ${cy.toFixed(6)} ${w.toFixed(6)} ${h.toFixed(6)}`,
      );
    }

    files.set(outName, lines.length > 0 ? lines.join('\n') + '\n' : '');
  }

  return files;
}
