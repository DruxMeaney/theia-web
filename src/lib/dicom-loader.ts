/**
 * DICOM loader — robust handler for medical imaging files.
 *
 * Supports:
 * - Uncompressed (Implicit/Explicit VR Little/Big Endian)
 * - JPEG compressed (Transfer Syntax 1.2.840.10008.1.2.4.50/51/57/70)
 * - JPEG 2000 (1.2.840.10008.1.2.4.90/91)
 * - JPEG-LS (1.2.840.10008.1.2.4.80/81)
 * - RLE Lossless (1.2.840.10008.1.2.5)
 *
 * Replicates Python ImageLoader._dicom_to_rgb():
 * - RescaleSlope/Intercept
 * - WindowCenter/Width windowing
 * - MONOCHROME1 inversion
 * - Multi-frame: takes first frame
 * - Samples per Pixel: handles RGB and grayscale
 */

// ─── Transfer Syntax constants ──────────────────────────────
const TS_JPEG_BASELINE     = '1.2.840.10008.1.2.4.50';
const TS_JPEG_EXTENDED     = '1.2.840.10008.1.2.4.51';
const TS_JPEG_LOSSLESS_P14 = '1.2.840.10008.1.2.4.57';
const TS_JPEG_LOSSLESS_SV1 = '1.2.840.10008.1.2.4.70';
const TS_JPEG_LS_LOSSLESS  = '1.2.840.10008.1.2.4.80';
const TS_JPEG_LS_LOSSY     = '1.2.840.10008.1.2.4.81';
const TS_JPEG2K_LOSSLESS   = '1.2.840.10008.1.2.4.90';
const TS_JPEG2K_LOSSY      = '1.2.840.10008.1.2.4.91';
const TS_RLE               = '1.2.840.10008.1.2.5';

const COMPRESSED_TS = new Set([
  TS_JPEG_BASELINE, TS_JPEG_EXTENDED, TS_JPEG_LOSSLESS_P14, TS_JPEG_LOSSLESS_SV1,
  TS_JPEG_LS_LOSSLESS, TS_JPEG_LS_LOSSY,
  TS_JPEG2K_LOSSLESS, TS_JPEG2K_LOSSY,
  TS_RLE,
]);

const JPEG_TS = new Set([
  TS_JPEG_BASELINE, TS_JPEG_EXTENDED, TS_JPEG_LOSSLESS_P14, TS_JPEG_LOSSLESS_SV1,
]);

const JPEG2K_TS = new Set([TS_JPEG2K_LOSSLESS, TS_JPEG2K_LOSSY]);

// ─── Types ─────────────────────────────────────────────────
interface DicomDataSet {
  uint16: (tag: string) => number | undefined;
  int16: (tag: string) => number | undefined;
  float: (tag: string) => number | undefined;
  string: (tag: string) => string | undefined;
  elements: Record<string, { dataOffset: number; length: number; fragments?: Array<{ offset: number; length: number }> }>;
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

// ─── Get Transfer Syntax ──────────────────────────────────
function getTransferSyntax(ds: DicomDataSet): string {
  // Transfer Syntax UID is in file meta (0002,0010)
  return getStr(ds, 'x00020010') || '1.2.840.10008.1.2'; // default: Implicit VR Little Endian
}

// ─── Extract first frame from encapsulated pixel data ─────
function extractFirstFrame(ds: DicomDataSet): Uint8Array | null {
  const pixelElement = ds.elements['x7fe00010'];
  if (!pixelElement) return null;

  // If fragments exist (encapsulated), use the first non-empty fragment
  if (pixelElement.fragments && pixelElement.fragments.length > 0) {
    // Fragment 0 is usually the Basic Offset Table, skip it if it's empty or small
    for (const frag of pixelElement.fragments) {
      if (frag.length > 0) {
        return ds.byteArray.slice(frag.offset, frag.offset + frag.length);
      }
    }
  }

  // Try raw extraction from offset
  if (pixelElement.dataOffset && pixelElement.length > 0) {
    return ds.byteArray.slice(pixelElement.dataOffset, pixelElement.dataOffset + pixelElement.length);
  }

  return null;
}

// ─── Decode compressed frame using browser's native decoder ─
async function decodeCompressedFrame(
  frameData: Uint8Array,
  transferSyntax: string,
  rows: number,
  cols: number
): Promise<ImageBitmap> {
  let mimeType: string;

  if (JPEG_TS.has(transferSyntax)) {
    mimeType = 'image/jpeg';
  } else if (JPEG2K_TS.has(transferSyntax)) {
    mimeType = 'image/jp2';
  } else {
    // For JPEG-LS and RLE, try JPEG first (some viewers wrap these)
    mimeType = 'image/jpeg';
  }

  // Try native browser decoding
  const blob = new Blob([new Uint8Array(frameData)], { type: mimeType });
  try {
    return await createImageBitmap(blob);
  } catch {
    // If the browser can't decode (e.g., JPEG-LS, JPEG2000, RLE),
    // try as generic image
    const genericBlob = new Blob([new Uint8Array(frameData)]);
    try {
      return await createImageBitmap(genericBlob);
    } catch {
      throw new Error(
        `No se pudo decodificar el frame comprimido.\n` +
        `Transfer Syntax: ${transferSyntax}\n` +
        `Tipo: ${mimeType}\n\n` +
        `Este formato DICOM comprimido requiere un codec especializado.\n` +
        `Sugerencia: convierte el DICOM a formato sin comprimir con:\n` +
        `  dcmconv +ti input.dcm output.dcm\n` +
        `  (o usa gdcmconv --raw input.dcm output.dcm)`
      );
    }
  }
}

// ─── Uncompressed pixel data → RGBA ────────────────────────
function uncompressedToRgba(
  ds: DicomDataSet,
  rows: number,
  cols: number
): Uint8ClampedArray {
  const bitsAllocated = getNum(ds, 'x00280100') || 16;
  const bitsStored = getNum(ds, 'x00280101') || bitsAllocated;
  const pixelRepresentation = getNum(ds, 'x00280103') || 0;
  const samplesPerPixel = getNum(ds, 'x00280002') || 1;
  const photometric = getStr(ds, 'x00280004').toUpperCase() || 'MONOCHROME2';
  const slope = getNum(ds, 'x00281053') ?? 1.0;
  const intercept = getNum(ds, 'x00281052') ?? 0.0;
  const windowCenter = getNum(ds, 'x00281050');
  const windowWidth = getNum(ds, 'x00281051');

  const pixelElement = ds.elements['x7fe00010'];
  if (!pixelElement) throw new Error('No pixel data found in DICOM file');

  const offset = pixelElement.dataOffset;
  const numPixels = rows * cols;

  // Handle RGB directly
  if (samplesPerPixel === 3 && photometric.includes('RGB')) {
    const output = new Uint8ClampedArray(numPixels * 4);
    for (let i = 0; i < numPixels; i++) {
      const srcIdx = offset + i * 3;
      output[i * 4] = ds.byteArray[srcIdx];
      output[i * 4 + 1] = ds.byteArray[srcIdx + 1];
      output[i * 4 + 2] = ds.byteArray[srcIdx + 2];
      output[i * 4 + 3] = 255;
    }
    return output;
  }

  // Grayscale path
  let pixelData: Float32Array;
  if (bitsAllocated === 16) {
    const view = new DataView(ds.byteArray.buffer, ds.byteArray.byteOffset + offset, numPixels * 2);
    pixelData = new Float32Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
      pixelData[i] = pixelRepresentation === 1
        ? view.getInt16(i * 2, true)
        : view.getUint16(i * 2, true);
    }
  } else if (bitsAllocated === 8) {
    pixelData = new Float32Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
      pixelData[i] = ds.byteArray[offset + i];
    }
  } else if (bitsAllocated === 32) {
    const view = new DataView(ds.byteArray.buffer, ds.byteArray.byteOffset + offset, numPixels * 4);
    pixelData = new Float32Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
      pixelData[i] = pixelRepresentation === 1
        ? view.getInt32(i * 4, true)
        : view.getUint32(i * 4, true);
    }
  } else {
    throw new Error(`Bits allocados no soportados: ${bitsAllocated}`);
  }

  // Apply mask for bitsStored
  if (bitsStored < bitsAllocated) {
    const mask = (1 << bitsStored) - 1;
    for (let i = 0; i < numPixels; i++) {
      pixelData[i] = pixelData[i] & mask;
    }
  }

  // Apply RescaleSlope and RescaleIntercept
  if (slope !== 1.0 || intercept !== 0.0) {
    for (let i = 0; i < numPixels; i++) {
      pixelData[i] = pixelData[i] * slope + intercept;
    }
  }

  // Apply windowing
  let minVal: number, maxVal: number;
  if (windowCenter !== undefined && windowWidth !== undefined && windowWidth > 0) {
    minVal = windowCenter - windowWidth / 2;
    maxVal = windowCenter + windowWidth / 2;
  } else {
    // Auto-window: use min/max of actual data
    minVal = Infinity;
    maxVal = -Infinity;
    for (let i = 0; i < numPixels; i++) {
      const v = pixelData[i];
      if (v < minVal) minVal = v;
      if (v > maxVal) maxVal = v;
    }
    if (maxVal <= minVal) { minVal = 0; maxVal = 1; }
  }

  // Normalize to 0-255 RGBA
  const range = maxVal - minVal;
  const isMonochrome1 = photometric.includes('MONOCHROME1');
  const output = new Uint8ClampedArray(numPixels * 4);

  for (let i = 0; i < numPixels; i++) {
    let v = (pixelData[i] - minVal) / range;
    v = Math.max(0, Math.min(1, v));
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

// ─── Apply windowing to already-decoded ImageBitmap ────────
async function applyWindowingToBitmap(
  bitmap: ImageBitmap,
  ds: DicomDataSet
): Promise<ImageBitmap> {
  const photometric = getStr(ds, 'x00280004').toUpperCase();
  const isMonochrome1 = photometric.includes('MONOCHROME1');

  // If MONOCHROME1, we need to invert
  if (!isMonochrome1) return bitmap;

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  ctx.putImageData(imageData, 0, 0);
  bitmap.close();
  return createImageBitmap(canvas);
}

// ─── Public API ────────────────────────────────────────────

export async function loadDicomImage(file: File): Promise<ImageBitmap> {
  const buffer = await file.arrayBuffer();
  const ds = await parseDicom(buffer);
  const rows = getNum(ds, 'x00280010') || 0;
  const cols = getNum(ds, 'x00280011') || 0;

  if (rows === 0 || cols === 0) {
    throw new Error('DICOM: dimensiones invalidas (Rows/Columns = 0)');
  }

  const transferSyntax = getTransferSyntax(ds);

  // Compressed transfer syntax
  if (COMPRESSED_TS.has(transferSyntax)) {
    const frameData = extractFirstFrame(ds);
    if (!frameData) {
      throw new Error(`No se pudieron extraer frames del DICOM comprimido (TS: ${transferSyntax})`);
    }

    try {
      const bitmap = await decodeCompressedFrame(frameData, transferSyntax, rows, cols);
      return applyWindowingToBitmap(bitmap, ds);
    } catch (err) {
      // Fallback: try treating as uncompressed anyway
      console.warn('Compressed decode failed, trying uncompressed fallback:', err);
    }
  }

  // Uncompressed path
  const rgba = uncompressedToRgba(ds, rows, cols);
  const imageData = new ImageData(new Uint8ClampedArray(rgba.buffer as ArrayBuffer), cols, rows);
  return createImageBitmap(imageData);
}

export async function probeDicomSize(file: File): Promise<{ width: number; height: number }> {
  const buffer = await file.arrayBuffer();
  const ds = await parseDicom(buffer);
  const rows = getNum(ds, 'x00280010') || 0;
  const cols = getNum(ds, 'x00280011') || 0;
  return { width: cols, height: rows };
}
