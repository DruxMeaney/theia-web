import { basename } from '@/lib/utils';

/**
 * Strip gs:// prefix and try to match a relPath that ends with the suffix.
 * Mirrors Python ImportExportManager._match_rel_by_uri
 */
export function matchRelByUri(
  uri: string,
  allRelPaths: string[],
): string | null {
  if (!uri) return null;

  let suffix = uri;
  if (uri.startsWith('gs://')) {
    const rest = uri.slice(5);
    const slashIdx = rest.indexOf('/');
    suffix = slashIdx >= 0 ? rest.slice(slashIdx + 1) : '';
  }
  suffix = suffix.replace(/\\/g, '/');

  for (const rel of allRelPaths) {
    if (rel.endsWith(suffix)) return rel;
  }
  return null;
}

/**
 * Case-insensitive basename match.
 * Mirrors Python ImportExportManager._find_by_basename
 */
export function findByBasename(
  base: string,
  allRelPaths: string[],
): string | null {
  const lower = base.toLowerCase();
  for (const rel of allRelPaths) {
    if (basename(rel).toLowerCase() === lower) return rel;
  }
  return null;
}
