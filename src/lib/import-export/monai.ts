import type { ImageEntry } from '@/lib/types';
import { basename } from '@/lib/utils';

interface MonaiMaskRecord {
  image: string;
  label: string;
}

interface MonaiMasksResult {
  records: MonaiMaskRecord[];
  labelsMap: Record<string, number>;
  maskBlobs: Map<string, Blob>;
}

/**
 * Export MONAI segmentation masks using OffscreenCanvas.
 * Draws filled rectangles for each bbox with a class_id grayscale value.
 * Returns records for dataset_monai.json, labelsMap, and mask Blobs.
 */
export async function exportMonaiMasks(
  allRelPaths: string[],
  entries: Record<string, ImageEntry>,
  labels: string[],
  masksDirName = 'masks_png',
): Promise<MonaiMasksResult> {
  // label -> id (1..N), 0 is background
  const labelToId: Record<string, number> = {};
  labels.forEach((name, i) => {
    labelToId[name] = i + 1;
  });

  const records: MonaiMaskRecord[] = [];
  const maskBlobs = new Map<string, Blob>();

  for (const rel of allRelPaths) {
    const ent = entries[rel];
    if (!ent) continue;

    const width = ent.width;
    const height = ent.height;

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;

    // Fill with background (0)
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, width, height);

    for (const bbox of ent.annotations) {
      const name = (bbox.displayName || 'class').trim();
      if (!(name in labelToId)) {
        labelToId[name] = Object.keys(labelToId).length + 1;
      }
      const classId = labelToId[name];

      const x0 = Math.max(0, Math.min(width - 1, Math.floor(bbox.xMin * width)));
      const y0 = Math.max(0, Math.min(height - 1, Math.floor(bbox.yMin * height)));
      const x1 = Math.max(0, Math.min(width, Math.ceil(bbox.xMax * width)));
      const y1 = Math.max(0, Math.min(height, Math.ceil(bbox.yMax * height)));

      if (x1 <= x0 || y1 <= y0) continue;

      ctx.fillStyle = `rgb(${classId},${classId},${classId})`;
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }

    const base = basename(rel);
    const stem = base.lastIndexOf('.') >= 0
      ? base.slice(0, base.lastIndexOf('.'))
      : base;
    const maskFilename = `${stem}_mask.png`;

    const blob = await canvas.convertToBlob({ type: 'image/png' });
    maskBlobs.set(`${masksDirName}/${maskFilename}`, blob);

    const imageRel = rel.replace(/\\/g, '/');
    const labelRel = `${masksDirName}/${maskFilename}`.replace(/\\/g, '/');

    records.push({ image: imageRel, label: labelRel });
  }

  return { records, labelsMap: labelToId, maskBlobs };
}

interface MonaiDetectionRecord {
  image: string;
  boxes: number[][];
  labels: number[];
  width: number;
  height: number;
}

/**
 * Export MONAI detection Python source code.
 * Generates a Python file string with DATA and LABELS_MAP.
 */
export function exportMonaiDetectionPy(
  allRelPaths: string[],
  entries: Record<string, ImageEntry>,
  labels: string[],
  projectName: string,
  includeEmptyImages = true,
): string {
  // 0-based for detection (no background)
  const baseLabels = labels
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  const labelToId: Record<string, number> = {};
  baseLabels.forEach((name, i) => {
    labelToId[name] = i;
  });

  const data: MonaiDetectionRecord[] = [];
  const warnings: string[] = [];

  for (const rel of allRelPaths) {
    const ent = entries[rel];
    if (!ent) continue;

    const width = Math.trunc(ent.width);
    const height = Math.trunc(ent.height);
    if (width <= 0 || height <= 0) {
      warnings.push(`${rel}: invalid size (${width}x${height})`);
      continue;
    }

    const imageRel = rel.replace(/\\/g, '/');
    const boxes: number[][] = [];
    const boxLabels: number[] = [];

    for (const b of ent.annotations) {
      const name = (b.displayName || '').trim() || 'class';

      if (!(name in labelToId)) {
        labelToId[name] = Object.keys(labelToId).length;
      }

      // Normalized -> pixels
      let x0 = b.xMin * width;
      let y0 = b.yMin * height;
      let x1 = b.xMax * width;
      let y1 = b.yMax * height;

      // Clamp to edges
      x0 = Math.max(0, Math.min(width, x0));
      y0 = Math.max(0, Math.min(height, y0));
      x1 = Math.max(0, Math.min(width, x1));
      y1 = Math.max(0, Math.min(height, y1));

      // Normalize order
      if (x1 < x0) [x0, x1] = [x1, x0];
      if (y1 < y0) [y0, y1] = [y1, y0];

      // Skip degenerate boxes
      if (x1 - x0 <= 0 || y1 - y0 <= 0) continue;

      boxes.push([x0, y0, x1, y1]);
      boxLabels.push(labelToId[name]);
    }

    if (!boxes.length && !includeEmptyImages) continue;

    data.push({
      image: imageRel,
      boxes,
      labels: boxLabels,
      width,
      height,
    });
  }

  // Sort labelsMap by id for reproducibility
  const sortedEntries = Object.entries(labelToId).sort(
    ([, a], [, b]) => a - b,
  );
  const labelsMap: Record<string, number> = {};
  for (const [name, id] of sortedEntries) {
    labelsMap[name] = id;
  }

  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const header = `"""
Dataset exportado por Etiquetador Minerva (web) — MODO DETECCION
Fecha: ${ts}
Proyecto origen: ${projectName || '(no guardado como JSONL)'}

Estructura:
- DATA: lista de dicts con:
    - image: ruta relativa (respecto a tu carpeta raiz de imagenes)
    - boxes: lista de [xMin, yMin, xMax, yMax] en pixeles (float) formato XYXY
    - labels: lista de ids (int) 0..N-1 (sin fondo)
    - width, height: tamano de la imagen (px)
- LABELS_MAP: dict "Clase" -> id_int (0..N-1)

Sugerencia de uso:
    from dataset_monai_det import DATA, LABELS_MAP
    # luego resuelves rutas:
    # abs_path = os.path.join(root_dir, rec["image"])

"""`;

  const dataTxt = JSON.stringify(data, null, 2);
  const mapTxt = JSON.stringify(labelsMap, null, 2);

  const warnTxt =
    warnings.length > 0
      ? `\nWARNINGS = ${JSON.stringify(warnings.slice(0, 200), null, 2)}\n`
      : '\nWARNINGS = []\n';

  const footer = `
def validate_dataset():
    """
    Validacion ligera: longitudes consistentes y cajas con coordenadas validas.
    """
    for i, r in enumerate(DATA):
        boxes = r.get("boxes", [])
        labels = r.get("labels", [])
        w = r.get("width", None)
        h = r.get("height", None)
        if w is None or h is None or w <= 0 or h <= 0:
            raise ValueError(f"[{i}] width/height invalidos: {w}x{h}")
        if len(boxes) != len(labels):
            raise ValueError(f"[{i}] boxes/labels desalineados: {len(boxes)} vs {len(labels)}")
        for b in boxes:
            if len(b) != 4:
                raise ValueError(f"[{i}] bbox no tiene 4 coords: {b}")
            x0, y0, x1, y1 = b
            if not (0 <= x0 <= x1 <= w and 0 <= y0 <= y1 <= h):
                raise ValueError(f"[{i}] bbox fuera de rango: {b} con w,h={w,h}")

if __name__ == "__main__":
    validate_dataset()
`;

  return `${header}\n\nDATA = ${dataTxt}\n\nLABELS_MAP = ${mapTxt}\n${warnTxt}\n${footer}`;
}
