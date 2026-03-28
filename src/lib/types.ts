export class BBox {
  displayName: string;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;

  constructor(displayName: string, xMin: number, yMin: number, xMax: number, yMax: number) {
    this.displayName = displayName;
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
  }

  normFix(): void {
    this.xMin = clamp01(this.xMin);
    this.yMin = clamp01(this.yMin);
    this.xMax = clamp01(this.xMax);
    this.yMax = clamp01(this.yMax);
    if (this.xMax < this.xMin) [this.xMin, this.xMax] = [this.xMax, this.xMin];
    if (this.yMax < this.yMin) [this.yMin, this.yMax] = [this.yMax, this.yMin];
  }

  asVertex(annSet?: string): VertexAnnotation {
    const d: VertexAnnotation = {
      displayName: this.displayName,
      xMin: this.xMin,
      xMax: this.xMax,
      yMin: this.yMin,
      yMax: this.yMax,
    };
    if (annSet) {
      d.annotationResourceLabels = {
        'aiplatform.googleapis.com/annotation_set_name': annSet,
      };
    }
    return d;
  }

  clone(): BBox {
    return new BBox(this.displayName, this.xMin, this.yMin, this.xMax, this.yMax);
  }
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export interface VertexAnnotation {
  displayName: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  annotationResourceLabels?: Record<string, string>;
}

export interface ImageEntry {
  /** For File System Access API */
  fileHandle?: FileSystemFileHandle;
  /** For fallback: raw File object */
  file?: File;
  /** For GitHub: raw URL to fetch image */
  rawUrl?: string;
  relPath: string;
  width: number;
  height: number;
  annotations: BBox[];
}

export interface VertexJsonlLine {
  imageGcsUri?: string;
  imageUri?: string;
  boundingBoxAnnotations: VertexAnnotation[];
  dataItemResourceLabels?: Record<string, string>;
}

export type ToolMode = 'pan' | 'label' | 'adjust' | 'select' | null;

export type HitMode = 'move' | 'tl' | 'tr' | 'bl' | 'br' | 'l' | 'r' | 't' | 'b';

export interface TreeNode {
  name: string;
  relPath: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  isOpen?: boolean;
}
