/**
 * Label manager - loads/saves labels.json, supports both formats:
 * 1. {"labels": ["A", "B", "C"]}
 * 2. ["A", "B", "C"]
 */

export function parseLabelsJson(content: string): string[] {
  try {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      return data.map((s: unknown) => String(s).trim()).filter(Boolean);
    }
    if (typeof data === 'object' && data !== null && Array.isArray(data.labels)) {
      return data.labels.map((s: unknown) => String(s).trim()).filter(Boolean);
    }
  } catch {}
  return [];
}

export function serializeLabelsJson(labels: string[]): string {
  return JSON.stringify({ labels }, null, 2);
}

/**
 * Try to find and load labels.json from a directory handle
 */
export async function loadLabelsFromDirectory(
  dirHandle: FileSystemDirectoryHandle
): Promise<string[]> {
  try {
    const fileHandle = await dirHandle.getFileHandle('labels.json');
    const file = await fileHandle.getFile();
    const content = await file.text();
    return parseLabelsJson(content);
  } catch {
    return [];
  }
}

/**
 * Save labels.json to a directory handle
 */
export async function saveLabelsToDirectory(
  dirHandle: FileSystemDirectoryHandle,
  labels: string[]
): Promise<boolean> {
  try {
    const fileHandle = await dirHandle.getFileHandle('labels.json', { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(serializeLabelsJson(labels));
    await writable.close();
    return true;
  } catch {
    return false;
  }
}

/**
 * Load labels from a File object (fallback)
 */
export function loadLabelsFromFile(file: File): Promise<string[]> {
  return file.text().then(parseLabelsJson);
}
