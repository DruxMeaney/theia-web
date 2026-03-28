import { BBox } from '@/lib/types';
import type { ImageEntry } from '@/lib/types';
import { basename, clamp01 } from '@/lib/utils';
import { matchRelByUri, findByBasename } from '@/lib/import-export/path-matcher';

interface CocoImage {
  id: number;
  file_name: string;
  width: number;
  height: number;
}

interface CocoAnnotation {
  id: number;
  image_id: number;
  category_id: number;
  bbox: [number, number, number, number];
  area: number;
  iscrowd: number;
}

interface CocoCategory {
  id: number;
  name: string;
  supercategory: string;
}

interface CocoDataset {
  images: CocoImage[];
  annotations: CocoAnnotation[];
  categories: CocoCategory[];
}

/**
 * Import COCO JSON.
 * Parses images/annotations/categories, converts bbox [x,y,w,h] to normalized coords.
 */
export function importCoco(
  content: string,
  allRelPaths: string[],
  entries: Record<string, ImageEntry>,
): { nimg: number; nbox: number; newLabels: string[] } {
  const coco = JSON.parse(content) as CocoDataset;

  const id2file: Record<number, string> = {};
  for (const img of coco.images || []) {
    id2file[img.id] = img.file_name;
  }

  const id2cat: Record<number, string> = {};
  for (const c of coco.categories || []) {
    id2cat[c.id] = c.name;
  }

  const newLabels = [...new Set(Object.values(id2cat))];

  // Group annotations by image_id
  const annByImg: Record<number, Array<{ name: string; bbox: number[] }>> = {};
  for (const ann of coco.annotations || []) {
    const imgId = ann.image_id;
    const catId = ann.category_id;
    const bbox = ann.bbox;
    if (!(imgId in id2file) || !(catId in id2cat) || !bbox) continue;
    if (!annByImg[imgId]) annByImg[imgId] = [];
    annByImg[imgId].push({ name: id2cat[catId], bbox });
  }

  let nimg = 0;
  let nbox = 0;

  for (const imgIdStr of Object.keys(annByImg)) {
    const imgId = Number(imgIdStr);
    const pairs = annByImg[imgId];
    const fname = id2file[imgId] || '';

    const rel =
      matchRelByUri(fname, allRelPaths) ||
      findByBasename(basename(fname), allRelPaths);
    if (!rel || !entries[rel]) continue;

    const ent = entries[rel];
    ent.annotations.length = 0;

    for (const { name, bbox } of pairs) {
      const [x, y, w, h] = bbox;
      const xn0 = clamp01(x / ent.width);
      const yn0 = clamp01(y / ent.height);
      const xn1 = clamp01((x + w) / ent.width);
      const yn1 = clamp01((y + h) / ent.height);

      ent.annotations.push(
        new BBox(
          name,
          Math.min(xn0, xn1),
          Math.min(yn0, yn1),
          Math.max(xn0, xn1),
          Math.max(yn0, yn1),
        ),
      );
      nbox++;
    }
    nimg++;
  }

  return { nimg, nbox, newLabels };
}

/**
 * Export COCO JSON.
 * Builds a COCO JSON object with images, annotations, categories.
 */
export function exportCoco(
  allRelPaths: string[],
  entries: Record<string, ImageEntry>,
  labels: string[],
): string {
  const catMap: Record<string, number> = {};
  const categories: CocoCategory[] = [];
  labels.forEach((name, i) => {
    const cid = i + 1;
    catMap[name] = cid;
    categories.push({ id: cid, name, supercategory: 'none' });
  });

  const images: CocoImage[] = [];
  const annotations: CocoAnnotation[] = [];
  let annId = 1;

  allRelPaths.forEach((rel, idx) => {
    const ent = entries[rel];
    if (!ent) return;

    const imgId = idx + 1;
    images.push({
      id: imgId,
      file_name: rel,
      width: ent.width,
      height: ent.height,
    });

    for (const b of ent.annotations) {
      if (!(b.displayName in catMap)) continue;

      const x0 = b.xMin * ent.width;
      const y0 = b.yMin * ent.height;
      const w = (b.xMax - b.xMin) * ent.width;
      const h = (b.yMax - b.yMin) * ent.height;

      annotations.push({
        id: annId,
        image_id: imgId,
        category_id: catMap[b.displayName],
        bbox: [x0, y0, w, h],
        area: Math.max(0, w * h),
        iscrowd: 0,
      });
      annId++;
    }
  });

  return JSON.stringify({ images, annotations, categories }, null, 2);
}
