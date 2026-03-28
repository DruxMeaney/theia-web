import { BBox } from '@/lib/types';
import type { ImageEntry, VertexJsonlLine } from '@/lib/types';
import { basename } from '@/lib/utils';
import { matchRelByUri, findByBasename } from '@/lib/import-export/path-matcher';

/**
 * Import JSONL (Vertex AI format).
 * Parses each line, matches images by URI or basename, clears and sets annotations.
 */
export function importJsonl(
  content: string,
  allRelPaths: string[],
  entries: Record<string, ImageEntry>,
): { nimg: number; nbox: number } {
  let nimg = 0;
  let nbox = 0;

  const lines = content.split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const obj: VertexJsonlLine = JSON.parse(line);
    const uri = obj.imageGcsUri || obj.imageUri || '';

    const rel =
      matchRelByUri(uri, allRelPaths) ||
      findByBasename(basename(uri), allRelPaths);
    if (!rel || !entries[rel]) continue;

    const entry = entries[rel];
    entry.annotations.length = 0;

    for (const ann of obj.boundingBoxAnnotations || []) {
      const b = new BBox(
        ann.displayName || '',
        Number(ann.xMin) || 0,
        Number(ann.yMin) || 0,
        Number(ann.xMax) || 0,
        Number(ann.yMax) || 0,
      );
      b.normFix();
      entry.annotations.push(b);
      nbox++;
    }
    nimg++;
  }

  return { nimg, nbox };
}

/**
 * Export JSONL (Vertex AI format).
 * Builds a JSONL string with imageGcsUri, boundingBoxAnnotations, dataItemResourceLabels.
 */
export function exportJsonl(
  allRelPaths: string[],
  entries: Record<string, ImageEntry>,
  gcsPrefix: string,
  defaultMlUse: string,
  fixedAnnotationSetName: string,
): string {
  const lines: string[] = [];
  const prefix = gcsPrefix.replace(/\/+$/, '');

  for (const rel of allRelPaths) {
    const ent = entries[rel];
    if (!ent) continue;

    const imgUri = `${prefix}/${rel}`;
    const bbs = ent.annotations.map((b) => b.asVertex(fixedAnnotationSetName));

    const line: VertexJsonlLine = {
      imageGcsUri: imgUri,
      boundingBoxAnnotations: bbs,
      dataItemResourceLabels: defaultMlUse
        ? { 'aiplatform.googleapis.com/ml_use': defaultMlUse }
        : {},
    };

    lines.push(JSON.stringify(line));
  }

  return lines.join('\n') + '\n';
}
