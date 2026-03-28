import { getFileExtension } from './utils';

const imageCache = new Map<string, ImageBitmap>();
const MAX_CACHE = 15;

function evictOldest() {
  if (imageCache.size > MAX_CACHE) {
    const first = imageCache.keys().next().value;
    if (first !== undefined) {
      const bmp = imageCache.get(first);
      bmp?.close();
      imageCache.delete(first);
    }
  }
}

/**
 * Load an image from a FileSystemFileHandle, File, or URL, returning an ImageBitmap
 */
export async function loadImage(
  input: FileSystemFileHandle | File | string,
  cacheKey?: string
): Promise<ImageBitmap> {
  if (cacheKey && imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  let bitmap: ImageBitmap;

  if (typeof input === 'string') {
    // URL-based loading (GitHub raw URLs)
    const res = await fetch(input);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
    const blob = await res.blob();

    const ext = getFileExtension(input.split('?')[0]);
    if (ext === '.dcm' || ext === '.dicom') {
      const file = new File([blob], 'image.dcm');
      const { loadDicomImage } = await import('./dicom-loader');
      bitmap = await loadDicomImage(file);
    } else {
      bitmap = await createImageBitmap(blob);
    }
  } else {
    const file = input instanceof File ? input : await input.getFile();
    const ext = getFileExtension(file.name);

    if (ext === '.dcm' || ext === '.dicom') {
      const { loadDicomImage } = await import('./dicom-loader');
      bitmap = await loadDicomImage(file);
    } else {
      bitmap = await createImageBitmap(file);
    }
  }

  if (cacheKey) {
    imageCache.set(cacheKey, bitmap);
    evictOldest();
  }
  return bitmap;
}

/**
 * Probe image dimensions from a FileSystemFileHandle, File, or URL
 */
export async function probeImageSize(
  input: FileSystemFileHandle | File | string
): Promise<{ width: number; height: number }> {
  if (typeof input === 'string') {
    const res = await fetch(input);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const blob = await res.blob();
    const bmp = await createImageBitmap(blob);
    const { width, height } = bmp;
    bmp.close();
    return { width, height };
  }

  const file = input instanceof File ? input : await input.getFile();
  const ext = getFileExtension(file.name);

  if (ext === '.dcm' || ext === '.dicom') {
    const { probeDicomSize } = await import('./dicom-loader');
    return probeDicomSize(file);
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap.close();
  return { width, height };
}

export function invalidateCache(cacheKey: string) {
  const bmp = imageCache.get(cacheKey);
  bmp?.close();
  imageCache.delete(cacheKey);
}

export function clearImageCache() {
  for (const bmp of imageCache.values()) bmp.close();
  imageCache.clear();
}
