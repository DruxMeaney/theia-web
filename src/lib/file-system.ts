import { Config } from './config';
import { getFileExtension } from './utils';

export interface ScannedFile {
  relPath: string;
  handle?: FileSystemFileHandle;
  file?: File;
}

/**
 * Check if File System Access API is available
 */
export function hasFileSystemAccess(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

/**
 * Open a directory using File System Access API
 */
export async function pickDirectory(): Promise<{
  handle: FileSystemDirectoryHandle;
  name: string;
} | null> {
  if (!hasFileSystemAccess()) return null;
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    return { handle, name: handle.name };
  } catch {
    return null;
  }
}

/**
 * Recursively scan a directory for supported image files
 */
export async function scanDirectory(
  dirHandle: FileSystemDirectoryHandle,
  basePath = ''
): Promise<ScannedFile[]> {
  const files: ScannedFile[] = [];

  for await (const [name, handle] of dirHandle.entries()) {
    const relPath = basePath ? `${basePath}/${name}` : name;

    if (handle.kind === 'directory') {
      const sub = await scanDirectory(handle as FileSystemDirectoryHandle, relPath);
      files.push(...sub);
    } else if (handle.kind === 'file') {
      const ext = getFileExtension(name);
      if (Config.SUPPORTED_EXTS.has(ext)) {
        files.push({ relPath, handle: handle as FileSystemFileHandle });
      }
    }
  }

  return files;
}

/**
 * Fallback: scan files from a file input with webkitdirectory
 */
export function scanFileList(fileList: FileList): ScannedFile[] {
  const files: ScannedFile[] = [];
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const relPath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    // Remove the root folder name from the path
    const parts = relPath.split('/');
    const cleanPath = parts.length > 1 ? parts.slice(1).join('/') : relPath;
    const ext = getFileExtension(file.name);
    if (Config.SUPPORTED_EXTS.has(ext)) {
      files.push({ relPath: cleanPath, file });
    }
  }
  return files;
}

/**
 * Read a file as text
 */
export async function readFileAsText(handle: FileSystemFileHandle): Promise<string>;
export async function readFileAsText(file: File): Promise<string>;
export async function readFileAsText(input: FileSystemFileHandle | File): Promise<string> {
  if (input instanceof File) {
    return input.text();
  }
  const file = await input.getFile();
  return file.text();
}

/**
 * Read a file as ArrayBuffer (for DICOM)
 */
export async function readFileAsArrayBuffer(handle: FileSystemFileHandle): Promise<ArrayBuffer>;
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer>;
export async function readFileAsArrayBuffer(input: FileSystemFileHandle | File): Promise<ArrayBuffer> {
  if (input instanceof File) {
    return input.arrayBuffer();
  }
  const file = await input.getFile();
  return file.arrayBuffer();
}

/**
 * Write text to a file (File System Access API)
 */
export async function writeFile(handle: FileSystemFileHandle, content: string): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}

/**
 * Show save file dialog
 */
export async function showSaveDialog(options?: {
  suggestedName?: string;
  types?: FilePickerAcceptType[];
}): Promise<FileSystemFileHandle | null> {
  if (!hasFileSystemAccess()) return null;
  try {
    return await window.showSaveFilePicker({
      suggestedName: options?.suggestedName,
      types: options?.types || [
        { description: 'JSON Lines', accept: { 'application/jsonl': ['.jsonl'] } },
        { description: 'JSON', accept: { 'application/json': ['.json'] } },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Show open file dialog
 */
export async function showOpenDialog(options?: {
  types?: FilePickerAcceptType[];
  multiple?: boolean;
}): Promise<FileSystemFileHandle[] | null> {
  if (!hasFileSystemAccess()) return null;
  try {
    return await window.showOpenFilePicker({
      types: options?.types,
      multiple: options?.multiple || false,
    });
  } catch {
    return null;
  }
}

/**
 * Fallback: trigger download
 */
export function downloadFile(content: string, filename: string, mimeType = 'application/json'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Find a file in a directory by path segments
 */
export async function findFileInDirectory(
  dirHandle: FileSystemDirectoryHandle,
  relPath: string
): Promise<FileSystemFileHandle | null> {
  const parts = relPath.split('/');
  let current: FileSystemDirectoryHandle = dirHandle;

  for (let i = 0; i < parts.length - 1; i++) {
    try {
      current = await current.getDirectoryHandle(parts[i]);
    } catch {
      return null;
    }
  }

  try {
    return await current.getFileHandle(parts[parts.length - 1]);
  } catch {
    return null;
  }
}
