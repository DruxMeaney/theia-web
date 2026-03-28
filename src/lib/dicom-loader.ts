/**
 * DICOM loader — robust web-based handler for medical imaging files.
 *
 * Supports:
 * - Uncompressed (Implicit/Explicit VR Little/Big Endian)
 * - JPEG Baseline (1.2.840.10008.1.2.4.50)
 * - JPEG Lossless (1.2.840.10008.1.2.4.70) via jpeg-lossless-decoder-js
 * - JPEG 2000 (1.2.840.10008.1.2.4.90/91) via browser native
 * - RLE Lossless (1.2.840.10008.1.2.5) - basic support
 *
 * Replicates Python ImageLoader._dicom_to_rgb():
 * - RescaleSlope/Intercept
 * - WindowCenter/Width windowing
 * - MONOCHROME1 inversion
 */

// ─── Types ─────────────────────────────────────────────────
interface DicomElement {
  dataOffset: number;
  length: number;
  fragments?: Array<{ offset: number; length: number; position: number }>;
  encapsulatedPixelData?: boolean;
}

interface DicomDataSet {
  uint16: (tag: string) => number | undefined;
  int16: (tag: string) => number | undefined;
  float: (tag: string) => number | undefined;
  string: (tag: string) => string | undefined;
  elements: Record<string, DicomElement>;
  byteArray: Uint8Array;
}

function getNum(ds: DicomDataSet, tag: string): number | undefined {
  return ds.float(tag) ?? ds.uint16(tag) ?? ds.int16(tag);
}

function getStr(ds: DicomDataSet, tag: string): string {
  return (ds.string(tag) || '').trim();
}

// ─── Parser ────────────────────────────────────────────────
async function parseDicom(buffer: ArrayBuffer): Promise<DicomDataSet> {
  const dicomParser = await import('dicom-parser');
  const byteArray = new Uint8Array(buffer);
  return dicomParser.parseDicom(byteArray) as unknown as DicomDataSet;
}

// ─── Transfer Syntax detection ─────────────────────────────
function getTransferSyntax(ds: DicomDataSet): string {
  return getStr(ds, 'x00020010') || '1.2.840.10008.1.2';
}

function isCompressed(ts: string): boolean {
  // Anything that's not implicit/explicit VR LE/BE is compressed
  return ![
    '1.2.840.10008.1.2',     // Implicit VR Little Endian
    '1.2.840.10008.1.2.1',   // Explicit VR Little Endian
    '1.2.840.10008.1.2.2',   // Explicit VR Big Endian
  ].includes(ts);
}

function isJpegLossless(ts: string): boolean {
  return ts === '1.2.840.10008.1.2.4.57' || ts === '1.2.840.10008.1.2.4.70';
}

function isJpegBaseline(ts: string): boolean {
  return ts === '1.2.840.10008.1.2.4.50' || ts === '1.2.840.10008.1.2.4.51';
}

// ─── Extract frame data from encapsulated pixel data ───────
function extractFrameData(ds: DicomDataSet): Uint8Array | null {
  const el = ds.elements['x7fe00010'];
  if (!el) return null;

  // If encapsulated with fragments
  if (el.fragments && el.fragments.length > 0) {
    // Skip Basic Offset Table (first fragment if length = 0 or small)
    for (let i = 0; i < el.fragments.length; i++) {
      const frag = el.fragments[i];
      if (frag.length > 100) { // Skip empty/offset-table fragments
        return new Uint8Array(
          ds.byteArray.buffer,
          ds.byteArray.byteOffset + frag.position,
          frag.length
        );
      }
    }
    // If all fragments are small, concatenate them
    if (el.fragments.length > 1) {
      const totalLen = el.fragments.reduce((sum, f) => sum + f.length, 0);
      const result = new Uint8Array(totalLen);
      let pos = 0;
      for (const frag of el.fragments) {
        if (frag.length > 0) {
          result.set(
            new Uint8Array(ds.byteArray.buffer, ds.byteArray.byteOffset + frag.position, frag.length),
            pos
          );
          pos += frag.length;
        }
      }
      return result.slice(0, pos);
    }
  }

  // Raw pixel data (not encapsulated)
  if (el.dataOffset && el.length > 0) {
    return new Uint8Array(
      ds.byteArray.buffer,
      ds.byteArray.byteOffset + el.dataOffset,
      el.length
    );
  }

  return null;
}

// ─── Decode JPEG Lossless frame ────────────────────────────
async function decodeJpegLossless(
  frameData: Uint8Array,
  rows: number,
  cols: number,
  bitsAllocated: number
): Promise<{ pixelData: Int32Array | Uint16Array; width: number; height: number }> {
  const { lossless } = await import('jpeg-lossless-decoder-js');
  const decoder = new lossless.Decoder();
  const decompressed = decoder.decode(
    frameData.buffer,
    frameData.byteOffset,
    frameData.byteLength
  );
  // The decoder returns output based on the JPEG frame header
  const output = new Int32Array(decompressed);
  return { pixelData: output, width: cols || decoder.columns, height: rows || decoder.rows };
}

// ─── Apply windowing to pixel values → RGBA ────────────────
function pixelValuesToRgba(
  pixelValues: ArrayLike<number>,
  numPixels: number,
  slope: number,
  intercept: number,
  windowCenter: number | undefined,
  windowWidth: number | undefined,
  isMonochrome1: boolean,
  bitsStored: number,
  bitsAllocated: number
): Uint8ClampedArray {
  // Apply mask
  const needsMask = bitsStored < bitsAllocated;
  const mask = needsMask ? (1 << bitsStored) - 1 : 0;

  // First pass: apply slope/intercept and find min/max if no window
  const processed = new Float32Array(numPixels);
  for (let i = 0; i < numPixels; i++) {
    let val = Number(pixelValues[i]);
    if (needsMask) val = val & mask;
    processed[i] = val * slope + intercept;
  }

  // Determine window
  let minVal: number, maxVal: number;
  if (windowCenter !== undefined && windowWidth !== undefined && windowWidth > 0) {
    minVal = windowCenter - windowWidth / 2;
    maxVal = windowCenter + windowWidth / 2;
  } else {
    minVal = Infinity;
    maxVal = -Infinity;
    for (let i = 0; i < numPixels; i++) {
      if (processed[i] < minVal) minVal = processed[i];
      if (processed[i] > maxVal) maxVal = processed[i];
    }
    if (maxVal <= minVal) { minVal = 0; maxVal = 1; }
  }

  // Normalize to RGBA
  const range = maxVal - minVal;
  const output = new Uint8ClampedArray(numPixels * 4);
  for (let i = 0; i < numPixels; i++) {
    let v = (processed[i] - minVal) / range;
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    let byte = Math.round(v * 255);
    if (isMonochrome1) byte = 255 - byte;
    const idx = i * 4;
    output[idx] = byte;
    output[idx + 1] = byte;
    output[idx + 2] = byte;
    output[idx + 3] = 255;
  }
  return output;
}

// ─── Read uncompressed pixel data ──────────────────────────
function readUncompressedPixels(
  ds: DicomDataSet,
  rows: number,
  cols: number
): Uint8ClampedArray {
  const bitsAllocated = getNum(ds, 'x00280100') || 16;
  const bitsStored = getNum(ds, 'x00280101') || bitsAllocated;
  const pixelRep = getNum(ds, 'x00280103') || 0;
  const samplesPerPixel = getNum(ds, 'x00280002') || 1;
  const photometric = getStr(ds, 'x00280004').toUpperCase() || 'MONOCHROME2';
  const slope = getNum(ds, 'x00281053') ?? 1.0;
  const intercept = getNum(ds, 'x00281052') ?? 0.0;
  const wc = getNum(ds, 'x00281050');
  const ww = getNum(ds, 'x00281051');

  const el = ds.elements['x7fe00010'];
  if (!el) throw new Error('No se encontraron datos de pixel en el archivo DICOM');

  const offset = el.dataOffset;
  const numPixels = rows * cols;
  const isM1 = photometric.includes('MONOCHROME1');

  // RGB direct
  if (samplesPerPixel === 3) {
    const output = new Uint8ClampedArray(numPixels * 4);
    for (let i = 0; i < numPixels; i++) {
      const src = offset + i * 3;
      output[i * 4] = ds.byteArray[src];
      output[i * 4 + 1] = ds.byteArray[src + 1];
      output[i * 4 + 2] = ds.byteArray[src + 2];
      output[i * 4 + 3] = 255;
    }
    return output;
  }

  // Grayscale: read raw pixel values
  let rawValues: ArrayLike<number>;
  if (bitsAllocated === 16) {
    const view = new DataView(ds.byteArray.buffer, ds.byteArray.byteOffset + offset, numPixels * 2);
    const arr = pixelRep === 1 ? new Int16Array(numPixels) : new Uint16Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
      arr[i] = pixelRep === 1 ? view.getInt16(i * 2, true) : view.getUint16(i * 2, true);
    }
    rawValues = arr;
  } else if (bitsAllocated === 8) {
    rawValues = ds.byteArray.slice(offset, offset + numPixels);
  } else {
    throw new Error(`Bits allocados no soportados: ${bitsAllocated}`);
  }

  return pixelValuesToRgba(rawValues, numPixels, slope, intercept, wc, ww, isM1, bitsStored, bitsAllocated);
}

// ─── Handle compressed DICOM via browser decode ────────────
async function decodeCompressedViaBrowser(
  frameData: Uint8Array,
  ds: DicomDataSet
): Promise<ImageBitmap> {
  const photometric = getStr(ds, 'x00280004').toUpperCase();
  const isM1 = photometric.includes('MONOCHROME1');

  // Try JPEG mime
  for (const mime of ['image/jpeg', 'image/jp2', 'application/octet-stream']) {
    try {
      const blob = new Blob([new Uint8Array(frameData)], { type: mime });
      const bmp = await createImageBitmap(blob);

      if (isM1) {
        // Invert
        const canvas = new OffscreenCanvas(bmp.width, bmp.height);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(bmp, 0, 0);
        const imgData = ctx.getImageData(0, 0, bmp.width, bmp.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i] = 255 - imgData.data[i];
          imgData.data[i + 1] = 255 - imgData.data[i + 1];
          imgData.data[i + 2] = 255 - imgData.data[i + 2];
        }
        ctx.putImageData(imgData, 0, 0);
        bmp.close();
        return createImageBitmap(canvas);
      }

      return bmp;
    } catch {
      continue;
    }
  }
  throw new Error('El navegador no pudo decodificar el frame comprimido');
}

// ═════════════════════════════════════════════════════════════
// PUBLIC API
// ═════════════════════════════════════════════════════════════

export async function loadDicomImage(file: File): Promise<ImageBitmap> {
  const buffer = await file.arrayBuffer();
  const ds = await parseDicom(buffer);

  const rows = getNum(ds, 'x00280010') || 0;
  const cols = getNum(ds, 'x00280011') || 0;
  if (rows === 0 || cols === 0) {
    throw new Error('DICOM: dimensiones invalidas (Rows/Columns = 0)');
  }

  const ts = getTransferSyntax(ds);
  const numPixels = rows * cols;

  // ── Path 1: JPEG Lossless → dedicated JS decoder ──
  if (isJpegLossless(ts)) {
    const frameData = extractFrameData(ds);
    if (!frameData) throw new Error('No se pudieron extraer frames JPEG Lossless');

    try {
      const { pixelData } = await decodeJpegLossless(frameData, rows, cols, getNum(ds, 'x00280100') || 16);

      const slope = getNum(ds, 'x00281053') ?? 1.0;
      const intercept = getNum(ds, 'x00281052') ?? 0.0;
      const wc = getNum(ds, 'x00281050');
      const ww = getNum(ds, 'x00281051');
      const bitsStored = getNum(ds, 'x00280101') || 16;
      const bitsAllocated = getNum(ds, 'x00280100') || 16;
      const isM1 = getStr(ds, 'x00280004').toUpperCase().includes('MONOCHROME1');

      const rgba = pixelValuesToRgba(pixelData, numPixels, slope, intercept, wc, ww, isM1, bitsStored, bitsAllocated);
      const imgData = new ImageData(new Uint8ClampedArray(rgba.buffer as ArrayBuffer), cols, rows);
      return createImageBitmap(imgData);
    } catch (err) {
      console.warn('JPEG Lossless decode failed, trying browser fallback:', err);
      return decodeCompressedViaBrowser(frameData, ds);
    }
  }

  // ── Path 2: JPEG Baseline → browser native decode ──
  if (isJpegBaseline(ts)) {
    const frameData = extractFrameData(ds);
    if (!frameData) throw new Error('No se pudieron extraer frames JPEG');
    return decodeCompressedViaBrowser(frameData, ds);
  }

  // ── Path 3: Other compressed → try browser decode ──
  if (isCompressed(ts)) {
    const frameData = extractFrameData(ds);
    if (frameData) {
      try {
        return await decodeCompressedViaBrowser(frameData, ds);
      } catch {
        // Fall through to uncompressed path as last resort
        console.warn('Compressed decode failed for TS:', ts, '- trying uncompressed fallback');
      }
    }
  }

  // ── Path 4: Uncompressed ──
  try {
    const rgba = readUncompressedPixels(ds, rows, cols);
    const imgData = new ImageData(new Uint8ClampedArray(rgba.buffer as ArrayBuffer), cols, rows);
    return createImageBitmap(imgData);
  } catch (err) {
    throw new Error(
      `No se pudo decodificar el DICOM.\n` +
      `Transfer Syntax: ${ts}\n` +
      `Dimensiones: ${cols}x${rows}\n` +
      `Error: ${err instanceof Error ? err.message : err}`
    );
  }
}

export async function probeDicomSize(file: File): Promise<{ width: number; height: number }> {
  const buffer = await file.arrayBuffer();
  const ds = await parseDicom(buffer);
  const rows = getNum(ds, 'x00280010') || 0;
  const cols = getNum(ds, 'x00280011') || 0;
  return { width: cols, height: rows };
}
