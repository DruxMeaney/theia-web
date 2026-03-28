/**
 * DICOM loader - lazily imported only when DICOM files are encountered.
 * Replicates the Python ImageLoader._dicom_to_rgb() logic:
 * - RescaleSlope/Intercept
 * - WindowCenter/Width windowing
 * - MONOCHROME1 inversion
 */

interface DicomDataSet {
  uint16: (tag: string) => number | undefined;
  int16: (tag: string) => number | undefined;
  float: (tag: string) => number | undefined;
  string: (tag: string) => string | undefined;
  elements: Record<string, { dataOffset: number; length: number }>;
  byteArray: Uint8Array;
}

function getTag(ds: DicomDataSet, tag: string): number | undefined {
  return ds.float(tag) ?? ds.uint16(tag) ?? ds.int16(tag);
}

function getTagString(ds: DicomDataSet, tag: string): string | undefined {
  return ds.string(tag);
}

async function parseDicom(buffer: ArrayBuffer): Promise<DicomDataSet> {
  const dicomParser = await import('dicom-parser');
  const byteArray = new Uint8Array(buffer);
  return dicomParser.parseDicom(byteArray) as unknown as DicomDataSet;
}

function dicomToRgb(ds: DicomDataSet): { data: Uint8ClampedArray; width: number; height: number } {
  const rows = getTag(ds, 'x00280010') || 0;
  const cols = getTag(ds, 'x00280011') || 0;
  const bitsAllocated = getTag(ds, 'x00280100') || 16;
  const bitsStored = getTag(ds, 'x00280101') || bitsAllocated;
  const pixelRepresentation = getTag(ds, 'x00280103') || 0;
  const photometric = (getTagString(ds, 'x00280004') || 'MONOCHROME2').toUpperCase();

  const slope = getTag(ds, 'x00281053') ?? 1.0;
  const intercept = getTag(ds, 'x00281052') ?? 0.0;
  const windowCenter = getTag(ds, 'x00281050');
  const windowWidth = getTag(ds, 'x00281051');

  // Extract pixel data
  const pixelDataElement = ds.elements['x7fe00010'];
  if (!pixelDataElement) {
    throw new Error('No pixel data found in DICOM file');
  }

  const offset = pixelDataElement.dataOffset;
  const length = pixelDataElement.length;
  const numPixels = rows * cols;

  // Read pixel values
  let pixelData: Float32Array;
  if (bitsAllocated === 16) {
    const view = new DataView(ds.byteArray.buffer, ds.byteArray.byteOffset + offset, length);
    pixelData = new Float32Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
      if (pixelRepresentation === 1) {
        pixelData[i] = view.getInt16(i * 2, true);
      } else {
        pixelData[i] = view.getUint16(i * 2, true);
      }
    }
  } else if (bitsAllocated === 8) {
    pixelData = new Float32Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
      pixelData[i] = ds.byteArray[offset + i];
    }
  } else {
    throw new Error(`Unsupported bits allocated: ${bitsAllocated}`);
  }

  // Apply mask for bitsStored
  if (bitsStored < bitsAllocated) {
    const mask = (1 << bitsStored) - 1;
    for (let i = 0; i < numPixels; i++) {
      pixelData[i] = pixelData[i] & mask;
    }
  }

  // Apply RescaleSlope and RescaleIntercept
  for (let i = 0; i < numPixels; i++) {
    pixelData[i] = pixelData[i] * slope + intercept;
  }

  // Apply windowing
  let minVal: number, maxVal: number;
  if (windowCenter !== undefined && windowWidth !== undefined && windowWidth > 0) {
    minVal = windowCenter - windowWidth / 2;
    maxVal = windowCenter + windowWidth / 2;
  } else {
    minVal = Infinity;
    maxVal = -Infinity;
    for (let i = 0; i < numPixels; i++) {
      if (pixelData[i] < minVal) minVal = pixelData[i];
      if (pixelData[i] > maxVal) maxVal = pixelData[i];
    }
    if (maxVal <= minVal) { minVal = 0; maxVal = 1; }
  }

  // Normalize to 0-255
  const range = maxVal - minVal;
  const output = new Uint8ClampedArray(numPixels * 4); // RGBA
  for (let i = 0; i < numPixels; i++) {
    let v = (pixelData[i] - minVal) / range;
    v = Math.max(0, Math.min(1, v));
    let byte = Math.round(v * 255);

    // MONOCHROME1 inversion
    if (photometric.includes('MONOCHROME1')) {
      byte = 255 - byte;
    }

    const idx = i * 4;
    output[idx] = byte;
    output[idx + 1] = byte;
    output[idx + 2] = byte;
    output[idx + 3] = 255;
  }

  return { data: output, width: cols, height: rows };
}

export async function loadDicomImage(file: File): Promise<ImageBitmap> {
  const buffer = await file.arrayBuffer();
  const ds = await parseDicom(buffer);
  const { data, width, height } = dicomToRgb(ds);
  const imageData = new ImageData(new Uint8ClampedArray(data.buffer as ArrayBuffer), width, height);
  return createImageBitmap(imageData);
}

export async function probeDicomSize(file: File): Promise<{ width: number; height: number }> {
  const buffer = await file.arrayBuffer();
  const ds = await parseDicom(buffer);
  const rows = getTag(ds, 'x00280010') || 0;
  const cols = getTag(ds, 'x00280011') || 0;
  return { width: cols, height: rows };
}
