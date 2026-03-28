'use client';

import { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useCanvasStore } from '@/stores/canvas-store';
import { useToolStore } from '@/stores/tool-store';
import { useProjectStore } from '@/stores/project-store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { pickDirectory, scanDirectory, scanFileList, hasFileSystemAccess, showSaveDialog, showOpenDialog, writeFile, downloadFile } from '@/lib/file-system';
import { probeImageSize, clearImageCache } from '@/lib/image-loader';
import { loadLabelsFromDirectory, parseLabelsJson } from '@/lib/label-manager';
import { scanRepoDirectory, loadLabelsFromRepo, readFileContent, writeFileToRepo, loadGitHubConfig, saveGitHubConfig, type GitHubConfig } from '@/lib/github-api';
import { useGitHubStore } from '@/stores/github-store';
import { ImageEntry, BBox, TreeNode } from '@/lib/types';
import { dirname } from '@/lib/utils';
import { Config } from '@/lib/config';
import { THEMES, getThemeById, applyTheme, saveThemeId, loadThemeId } from '@/lib/themes';
import { colorForLabel } from '@/stores/app-store';
import ImageCanvas from '@/components/canvas/ImageCanvas';

// ─── SVG Icons ───────────────────────────────────────────────
const icons = {
  folder: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>,
  fileOpen: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>,
  save: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7.414A2 2 0 0016.414 6L13 2.586A2 2 0 0011.586 2H5zm5 6a2 2 0 100 4 2 2 0 000-4z"/></svg>,
  chevUp: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/></svg>,
  chevDown: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>,
  arrowLeft: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  arrowRight: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>,
  hand: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 2a1.5 1.5 0 011.5 1.5V6a1.5 1.5 0 013 0V5.5a1.5 1.5 0 013 0v5a7.5 7.5 0 01-15 0V8.5a1.5 1.5 0 013 0V3.5A1.5 1.5 0 0110 2z"/></svg>,
  adjust: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 010 12V4z"/></svg>,
  reset: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>,
  plus: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>,
  cursor: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.672 1.911a1 1 0 10-1.932.518l.259.963a1 1 0 001.932-.518l-.26-.963zM2.429 4.74a1 1 0 10-.517 1.932l.962.258a1 1 0 00.518-1.932l-.963-.258zm8.114-.024a1 1 0 00-1.932-.518l-.259.963a1 1 0 001.932.518l.26-.963zM6.228 9.057l4.285 4.286-1.31.655a.5.5 0 01-.67-.223l-2.305-4.718zM3.6 6.628L8 11.028l-1.42 2.006a.5.5 0 01-.85-.042L3.6 6.628z"/></svg>,
  trash: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>,
};

export default function Home() {
  const appStore = useAppStore();
  const canvasStore = useCanvasStore();
  const projectStore = useProjectStore();
  const toolStore = useToolStore();
  const githubStore = useGitHubStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelsInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showGitHubSetup, setShowGitHubSetup] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState('emerald');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [activePanel, setActivePanel] = useState<'workspace' | 'help' | 'about' | null>('workspace');
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const [activeTab, setActiveTab] = useState<'explorer' | 'search'>('explorer');
  const [subfolder, setSubfolder] = useState('(Todos)');
  const [searchText, setSearchText] = useState('');
  const resizerRef = useRef<boolean>(false);

  // Load theme on mount
  useEffect(() => {
    const id = loadThemeId();
    setCurrentThemeId(id);
    applyTheme(getThemeById(id));
  }, []);

  // ─── Build tree ────────────────────────────────────────────
  const buildTree = useCallback((allRelPaths: string[], folderName: string): TreeNode => {
    const root: TreeNode = { name: folderName, relPath: '', type: 'folder', children: [], isOpen: true };
    const dirMap = new Map<string, TreeNode>();
    dirMap.set('', root);
    const ensureDir = (dirPath: string): TreeNode => {
      if (dirMap.has(dirPath)) return dirMap.get(dirPath)!;
      const parent = dirname(dirPath);
      const parentNode = ensureDir(parent);
      const name = dirPath.split('/').pop() || dirPath;
      const node: TreeNode = { name, relPath: dirPath, type: 'folder', children: [], isOpen: false };
      parentNode.children!.push(node);
      dirMap.set(dirPath, node);
      return node;
    };
    for (const rel of allRelPaths) {
      const dir = dirname(rel);
      if (dir) ensureDir(dir);
      const parentNode = dir ? dirMap.get(dir)! : root;
      const name = rel.split('/').pop() || rel;
      parentNode.children!.push({ name, relPath: rel, type: 'file' });
    }
    return root;
  }, []);

  // ─── Load folder ───────────────────────────────────────────
  // Load from GitHub repo
  const loadFromGitHub = useCallback(async (config: GitHubConfig, dataPath: string) => {
    appStore.log('Conectando a GitHub...');
    try {
      const scanned = await scanRepoDirectory(config, dataPath, Config.SUPPORTED_EXTS);
      const entries: Record<string, ImageEntry> = {};
      const allRelPaths: string[] = [];

      appStore.log(`Encontrados ${scanned.length} archivos. Cargando dimensiones...`);
      for (const sf of scanned) {
        try {
          const { width, height } = await probeImageSize(sf.rawUrl);
          entries[sf.relPath] = { rawUrl: sf.rawUrl, relPath: sf.relPath, width, height, annotations: [] };
          allRelPaths.push(sf.relPath);
        } catch (err) { console.error(`Error probing ${sf.relPath}:`, err); }
      }

      allRelPaths.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      const folderName = dataPath.split('/').pop() || 'GitHub';
      appStore.setFolder(folderName, null);
      appStore.setEntries(entries, allRelPaths);
      appStore.setTreeRoot(buildTree(allRelPaths, folderName));

      // Load labels from repo
      const labels = await loadLabelsFromRepo(config, dataPath);
      if (labels.length) { appStore.setLabels(labels); appStore.log(`Etiquetas cargadas: ${labels.length}`); }

      if (allRelPaths.length) appStore.setCurrentRel(allRelPaths[0]);
      clearImageCache();
      canvasStore.resetView();
      projectStore.setDirty(false);
      githubStore.setConfig(config);
      githubStore.setDataPath(dataPath);
      saveGitHubConfig(config);
      appStore.log(`Cargadas ${allRelPaths.length} imágenes desde GitHub`);
    } catch (err) {
      appStore.log(`Error GitHub: ${err}`);
      alert(`Error al conectar con GitHub: ${err}`);
    }
  }, [appStore, canvasStore, projectStore, githubStore, buildTree]);

  const loadFolder = useCallback(async () => {
    // If GitHub is configured, use it
    const ghConfig = useGitHubStore.getState().config || loadGitHubConfig();
    if (ghConfig) {
      const dataPath = useGitHubStore.getState().dataPath || 'public/data/MASTOGRAFIAS';
      await loadFromGitHub(ghConfig, dataPath);
      return;
    }

    // Otherwise show GitHub setup or use local
    if (hasFileSystemAccess()) {
      const result = await pickDirectory();
      if (!result) return;
      appStore.log('Escaneando carpeta...');
      const scanned = await scanDirectory(result.handle);
      const entries: Record<string, ImageEntry> = {};
      const allRelPaths: string[] = [];
      for (const sf of scanned) {
        try {
          const { width, height } = await probeImageSize(sf.handle!);
          entries[sf.relPath] = { fileHandle: sf.handle, relPath: sf.relPath, width, height, annotations: [] };
          allRelPaths.push(sf.relPath);
        } catch (err) { console.error(`Error probing ${sf.relPath}:`, err); }
      }
      allRelPaths.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      appStore.setFolder(result.name, result.handle);
      appStore.setEntries(entries, allRelPaths);
      appStore.setTreeRoot(buildTree(allRelPaths, result.name));
      const labels = await loadLabelsFromDirectory(result.handle);
      if (labels.length) { appStore.setLabels(labels); appStore.log(`Etiquetas cargadas: ${labels.length}`); }
      if (allRelPaths.length) appStore.setCurrentRel(allRelPaths[0]);
      clearImageCache(); canvasStore.resetView(); projectStore.setDirty(false);
      appStore.log(`Cargadas ${allRelPaths.length} imágenes de '${result.name}'`);
    } else {
      fileInputRef.current?.click();
    }
  }, [appStore, canvasStore, projectStore, buildTree, loadFromGitHub]);

  const onFolderInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const scanned = scanFileList(files);
    const entries: Record<string, ImageEntry> = {};
    const allRelPaths: string[] = [];
    for (const sf of scanned) {
      try {
        const { width, height } = await probeImageSize(sf.file!);
        entries[sf.relPath] = { file: sf.file, relPath: sf.relPath, width, height, annotations: [] };
        allRelPaths.push(sf.relPath);
      } catch (err) { console.error(`Error probing ${sf.relPath}:`, err); }
    }
    allRelPaths.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const folderName = files[0].webkitRelativePath?.split('/')[0] || 'Folder';
    appStore.setFolder(folderName, null);
    appStore.setEntries(entries, allRelPaths);
    appStore.setTreeRoot(buildTree(allRelPaths, folderName));
    if (allRelPaths.length) appStore.setCurrentRel(allRelPaths[0]);
    clearImageCache(); canvasStore.resetView(); projectStore.setDirty(false);
    appStore.log(`Cargadas ${allRelPaths.length} imágenes`);
  }, [appStore, canvasStore, projectStore, buildTree]);

  // ─── Navigation ────────────────────────────────────────────
  const navPrevImage = useCallback(() => {
    const { filteredRelPaths, allRelPaths, currentRel } = useAppStore.getState();
    const seq = filteredRelPaths.length ? filteredRelPaths : allRelPaths;
    if (!seq.length || !currentRel) return;
    const i = seq.indexOf(currentRel);
    if (i > 0) { appStore.setCurrentRel(seq[i - 1]); canvasStore.resetView(); }
  }, [appStore, canvasStore]);

  const navNextImage = useCallback(() => {
    const { filteredRelPaths, allRelPaths, currentRel } = useAppStore.getState();
    const seq = filteredRelPaths.length ? filteredRelPaths : allRelPaths;
    if (!seq.length || !currentRel) return;
    const i = seq.indexOf(currentRel);
    if (i >= 0 && i < seq.length - 1) { appStore.setCurrentRel(seq[i + 1]); canvasStore.resetView(); }
  }, [appStore, canvasStore]);

  const navPrevFolder = useCallback(() => {
    const { filteredRelPaths, allRelPaths, currentRel } = useAppStore.getState();
    const seq = filteredRelPaths.length ? filteredRelPaths : allRelPaths;
    if (!seq.length || !currentRel) return;
    const curDir = dirname(currentRel);
    const folders: string[] = []; const seen = new Set<string>();
    for (const r of seq) { const d = dirname(r); if (!seen.has(d)) { seen.add(d); folders.push(d); } }
    const i = folders.indexOf(curDir);
    if (i > 0) { const first = seq.find((r) => dirname(r) === folders[i - 1]); if (first) { appStore.setCurrentRel(first); canvasStore.resetView(); } }
  }, [appStore, canvasStore]);

  const navNextFolder = useCallback(() => {
    const { filteredRelPaths, allRelPaths, currentRel } = useAppStore.getState();
    const seq = filteredRelPaths.length ? filteredRelPaths : allRelPaths;
    if (!seq.length || !currentRel) return;
    const curDir = dirname(currentRel);
    const folders: string[] = []; const seen = new Set<string>();
    for (const r of seq) { const d = dirname(r); if (!seen.has(d)) { seen.add(d); folders.push(d); } }
    const i = folders.indexOf(curDir);
    if (i >= 0 && i < folders.length - 1) { const first = seq.find((r) => dirname(r) === folders[i + 1]); if (first) { appStore.setCurrentRel(first); canvasStore.resetView(); } }
  }, [appStore, canvasStore]);

  // ─── Project management ────────────────────────────────────
  const saveProject = useCallback(async () => {
    const state = useAppStore.getState(); const ps = useProjectStore.getState();
    if (!state.folder) return;
    const { exportJsonl } = await import('@/lib/import-export/jsonl');
    const content = exportJsonl(state.allRelPaths, state.entries, ps.gcsPrefix, ps.defaultMlUse, ps.fixedAnnotationSetName);

    // Save to GitHub if connected
    const ghConfig = useGitHubStore.getState().config;
    if (ghConfig) {
      const ghDataPath = useGitHubStore.getState().dataPath;
      const fileName = ps.projectName || 'annotations.jsonl';
      const filePath = `${ghDataPath}/${fileName}`;
      try {
        await writeFileToRepo(ghConfig, filePath, content, `THEIA: save ${fileName}`);
        projectStore.setDirty(false);
        projectStore.setProjectName(fileName);
        appStore.log(`Guardado en GitHub → ${filePath}`);
      } catch (err) {
        appStore.log(`Error guardando en GitHub: ${err}`);
        alert(`Error guardando en GitHub: ${err}`);
      }
      return;
    }

    if (ps.projectFileHandle) {
      await writeFile(ps.projectFileHandle, content); projectStore.setDirty(false); appStore.log(`Proyecto guardado`);
    } else { await saveProjectAs(); }
  }, [appStore, projectStore]);

  const saveProjectAs = useCallback(async () => {
    const state = useAppStore.getState(); const ps = useProjectStore.getState();
    if (!state.folder) return;
    const { exportJsonl } = await import('@/lib/import-export/jsonl');
    const content = exportJsonl(state.allRelPaths, state.entries, ps.gcsPrefix, ps.defaultMlUse, ps.fixedAnnotationSetName);
    if (hasFileSystemAccess()) {
      const handle = await showSaveDialog({ suggestedName: ps.projectName || 'annotations.jsonl', types: [{ description: 'JSON Lines', accept: { 'application/jsonl': ['.jsonl'] } }] });
      if (!handle) return;
      await writeFile(handle, content); projectStore.setProjectFileHandle(handle); projectStore.setProjectName(handle.name);
      projectStore.setDirty(false); projectStore.addRecent(handle.name); appStore.log(`Guardado como → ${handle.name}`);
    } else { downloadFile(content, ps.projectName || 'annotations.jsonl'); projectStore.setDirty(false); }
  }, [appStore, projectStore]);

  const openProject = useCallback(async () => {
    const state = useAppStore.getState();
    if (!state.folder) { alert('Primero carga una carpeta de imágenes.'); return; }
    if (hasFileSystemAccess()) {
      const handles = await showOpenDialog({ types: [{ description: 'JSON Lines', accept: { 'application/jsonl': ['.jsonl'] } }] });
      if (!handles?.length) return;
      const handle = handles[0]; const file = await handle.getFile(); const content = await file.text();
      const { importJsonl } = await import('@/lib/import-export/jsonl');
      const { nimg, nbox } = importJsonl(content, state.allRelPaths, state.entries);
      appStore.setEntries({ ...state.entries }, [...state.allRelPaths]);
      projectStore.setProjectFileHandle(handle); projectStore.setProjectName(handle.name);
      projectStore.setDirty(false); projectStore.addRecent(handle.name);
      canvasStore.requestRender(false); appStore.log(`Proyecto abierto: ${handle.name} (${nimg} img, ${nbox} cajas)`);
    }
  }, [appStore, projectStore, canvasStore]);

  // ─── Import / Export ───────────────────────────────────────
  const handleImport = useCallback(async (mode: string) => {
    setImportMode(mode);
    if (hasFileSystemAccess()) {
      const types = mode === 'coco' ? [{ description: 'JSON', accept: { 'application/json': ['.json'] } }] : [{ description: 'JSON Lines', accept: { 'application/jsonl': ['.jsonl'] } }];
      const handles = await showOpenDialog({ types }); if (!handles?.length) return;
      const file = await handles[0].getFile(); const content = await file.text();
      await processImport(mode, content, file.name);
    } else { importInputRef.current?.click(); }
  }, []);

  const processImport = useCallback(async (mode: string, content: string, filename: string) => {
    const state = useAppStore.getState();
    if (!state.folder) { alert('Primero carga una carpeta.'); return; }
    if (mode === 'jsonl') {
      const { importJsonl } = await import('@/lib/import-export/jsonl');
      const { nimg, nbox } = importJsonl(content, state.allRelPaths, state.entries);
      appStore.setEntries({ ...state.entries }, [...state.allRelPaths]);
      projectStore.setDirty(true); appStore.log(`Importado JSONL: ${filename} → ${nimg} img / ${nbox} cajas`);
    } else if (mode === 'coco') {
      const { importCoco } = await import('@/lib/import-export/coco');
      const { nimg, nbox, newLabels } = importCoco(content, state.allRelPaths, state.entries);
      for (const l of newLabels) appStore.addLabel(l);
      appStore.setEntries({ ...state.entries }, [...state.allRelPaths]);
      projectStore.setDirty(true); appStore.log(`Importado COCO: ${filename} → ${nimg} img / ${nbox} cajas`);
    }
    canvasStore.requestRender(false);
  }, [appStore, projectStore, canvasStore]);

  const handleExport = useCallback(async (mode: string) => {
    const state = useAppStore.getState(); const ps = useProjectStore.getState();
    if (!state.folder) { alert('Primero carga una carpeta.'); return; }
    let content = ''; let filename = '';
    if (mode === 'jsonl') {
      const { exportJsonl } = await import('@/lib/import-export/jsonl');
      content = exportJsonl(state.allRelPaths, state.entries, ps.gcsPrefix, ps.defaultMlUse, ps.fixedAnnotationSetName); filename = 'annotations.jsonl';
    } else if (mode === 'coco') {
      const { exportCoco } = await import('@/lib/import-export/coco');
      content = exportCoco(state.allRelPaths, state.entries, state.labels); filename = 'export_coco.json';
    } else if (mode === 'yolo') {
      const { exportYolo } = await import('@/lib/import-export/yolo');
      const files = exportYolo(state.allRelPaths, state.entries, state.labels);
      for (const [name, text] of files) downloadFile(text, name);
      appStore.log(`Exportado YOLO (${files.size} archivos)`); return;
    }
    if (hasFileSystemAccess()) {
      const ext = mode === 'coco' ? '.json' : '.jsonl';
      const handle = await showSaveDialog({ suggestedName: filename, types: [{ description: mode.toUpperCase(), accept: { 'application/json': [ext] } }] });
      if (!handle) return; await writeFile(handle, content); appStore.log(`Exportado ${mode.toUpperCase()} → ${handle.name}`);
    } else { downloadFile(content, filename); appStore.log(`Exportado ${mode.toUpperCase()}`); }
  }, [appStore]);

  // ─── Filters ───────────────────────────────────────────────
  const applyFilters = useCallback(() => {
    const state = useAppStore.getState();
    const filtered = state.allRelPaths.filter((rel) => {
      if (subfolder !== '(Todos)' && !rel.startsWith(subfolder + '/')) return false;
      if (searchText && !rel.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
    appStore.setFilteredRelPaths(filtered); appStore.log(`Filtro: ${filtered.length} resultados`);
  }, [subfolder, searchText, appStore]);

  const subfolders = useMemo(() => {
    const subs = new Set<string>();
    for (const rel of appStore.allRelPaths) { const p = rel.split('/'); if (p.length > 1) subs.add(p[0]); }
    return ['(Todos)', ...Array.from(subs).sort()];
  }, [appStore.allRelPaths]);

  const titleCounter = useMemo(() => {
    const seq = appStore.filteredRelPaths.length ? appStore.filteredRelPaths : appStore.allRelPaths;
    const total = seq.length;
    const idx = appStore.currentRel ? seq.indexOf(appStore.currentRel) + 1 : 0;
    return total ? `${idx}/${total}` : '';
  }, [appStore.filteredRelPaths, appStore.allRelPaths, appStore.currentRel]);

  // ─── Keyboard shortcuts ────────────────────────────────────
  const shortcutActions = useMemo(() => ({
    loadFolder, newProject: saveProjectAs, openProject, saveProject, saveProjectAs,
    importJsonl: () => handleImport('jsonl'), importCoco: () => handleImport('coco'),
    exportJsonl: () => handleExport('jsonl'), exportCoco: () => handleExport('coco'),
    prevImage: navPrevImage, nextImage: navNextImage,
    openHelp: () => setShowHelp(true), openOptions: () => setShowOptions(true),
  }), [loadFolder, saveProjectAs, openProject, saveProject, handleImport, handleExport, navPrevImage, navNextImage]);
  useKeyboardShortcuts(shortcutActions);

  // ─── Delete annotation ─────────────────────────────────────
  const onDeleteAnnotation = useCallback(() => {
    const { currentRel } = useAppStore.getState();
    const { selectedAnnotationIndex } = useToolStore.getState();
    if (currentRel && selectedAnnotationIndex !== null) {
      appStore.removeAnnotation(currentRel, selectedAnnotationIndex);
      toolStore.setSelectedAnnotation(null); projectStore.setDirty(true);
      canvasStore.requestRender(false); appStore.log('Anotacion eliminada.');
    }
  }, [appStore, toolStore, projectStore, canvasStore]);

  // ─── Resizer ───────────────────────────────────────────────
  const onResizerDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); resizerRef.current = true;
    const startX = e.clientX; const startW = sidebarWidth;
    const onMove = (e: MouseEvent) => { if (!resizerRef.current) return; setSidebarWidth(Math.max(260, Math.min(600, startW + (e.clientX - startX)))); };
    const onUp = () => { resizerRef.current = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  }, [sidebarWidth]);

  const currentEntry = appStore.currentRel ? appStore.entries[appStore.currentRel] : null;
  const annotations = currentEntry?.annotations || [];

  // ─── Tree toggle ───────────────────────────────────────────
  const toggleTreeNode = useCallback((relPath: string) => {
    const root = appStore.treeRoot; if (!root) return;
    const toggle = (node: TreeNode): TreeNode => {
      if (node.relPath === relPath && node.type === 'folder') return { ...node, isOpen: !node.isOpen, children: node.children?.map(toggle) };
      if (node.children) return { ...node, children: node.children.map(toggle) };
      return node;
    };
    appStore.setTreeRoot(toggle(root));
  }, [appStore]);

  const renderTreeNode = useCallback((node: TreeNode, depth = 0): React.ReactNode => {
    if (node.type === 'folder') {
      return (
        <div key={`d-${node.relPath}`}>
          <div className="tree-folder" style={{ paddingLeft: `${depth * 14 + 8}px` }} onClick={() => toggleTreeNode(node.relPath)}>
            <span className="text-[9px] opacity-50">{node.isOpen ? '▾' : '▸'}</span>
            <span style={{ color: 'var(--accent-dim)' }}>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M1 3.5A1.5 1.5 0 012.5 2h3.879a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 009.62 4H13.5A1.5 1.5 0 0115 5.5v7a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 12.5v-9z"/></svg>
            </span>
            <span>{node.name}</span>
          </div>
          {node.isOpen && node.children?.map((c) => renderTreeNode(c, depth + 1))}
        </div>
      );
    }
    const isSelected = appStore.currentRel === node.relPath;
    return (
      <div key={`f-${node.relPath}`} className={`tree-file ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 14 + 22}px` }}
        onClick={() => { appStore.setCurrentRel(node.relPath); canvasStore.resetView(); }}>
        <span className="opacity-40 text-[10px]">◇</span>
        <span className="truncate">{node.name}</span>
      </div>
    );
  }, [appStore, canvasStore, toggleTreeNode]);

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="h-screen flex flex-col no-select" style={{ background: 'var(--bg-deep)' }}>
      {/* Hidden inputs */}
      <input ref={fileInputRef} type="file" className="hidden" {...{ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>} onChange={onFolderInputChange} />
      <input ref={labelsInputRef} type="file" accept=".json" className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0]; if (f) { const c = await f.text(); const l = parseLabelsJson(c); if (l.length) { appStore.setLabels(l); appStore.log(`${l.length} etiquetas`); } }
      }} />
      <input ref={importInputRef} type="file" accept=".jsonl,.json" className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0]; if (f) { const c = await f.text(); await processImport(importMode, c, f.name); }
      }} />

      {/* ═══ UNIFIED HEADER ═══ */}
      <header className="header-bar">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', boxShadow: '0 0 10px var(--accent-glow)' }}>
            <span className="text-[8px] font-black" style={{ color: 'var(--bg-deep)' }}>T</span>
          </div>
          <span className="logo-text text-[13px] hidden sm:inline">THEIA</span>
        </div>

        <div className="w-px h-4" style={{ background: 'var(--border)' }} />

        {/* File menu */}
        <MenuDropdown label="Archivo" items={[
          { label: 'Cargar carpeta…', shortcut: '⌘L', action: loadFolder },
          { label: 'Cargar etiquetas…', action: () => labelsInputRef.current?.click() },
          null,
          { label: 'Nuevo JSONL', shortcut: '⌘N', action: saveProjectAs },
          { label: 'Abrir JSONL…', shortcut: '⌘O', action: openProject },
          { label: 'Guardar', shortcut: '⌘S', action: saveProject },
          { label: 'Guardar como…', shortcut: '⌘⇧S', action: saveProjectAs },
          null,
          { label: 'Importar JSONL (Vertex)', action: () => handleImport('jsonl') },
          { label: 'Importar COCO', action: () => handleImport('coco') },
          null,
          { label: 'Exportar JSONL (Vertex)', action: () => handleExport('jsonl') },
          { label: 'Exportar COCO', action: () => handleExport('coco') },
          { label: 'Exportar YOLO', action: () => handleExport('yolo') },
          null,
          { label: 'Opciones Vertex…', shortcut: '⌘,', action: () => setShowOptions(true) },
          null,
          { label: 'Conectar GitHub…', action: () => setShowGitHubSetup(true) },
        ]} />

        <div className="flex-1" />

        {/* Center: project info */}
        <div className="flex items-center gap-2">
          {titleCounter && (
            <span className="badge text-[9px]">{titleCounter}</span>
          )}
          <span className="text-[10px] truncate max-w-[200px]" style={{ color: 'var(--fg-muted)' }}>
            {projectStore.projectName || 'Sin proyecto'}
          </span>
          {projectStore.dirty && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--warning)' }} />}
        </div>

        <div className="flex-1" />

        {/* Right: action buttons */}
        <div className="flex items-center gap-1">
          {/* Help */}
          <button className="tool-btn !w-7 !h-7 !rounded-md" onClick={() => setShowHelp(true)} title="Ayuda (F1)">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
          {/* About */}
          <button className="tool-btn !w-7 !h-7 !rounded-md" onClick={() => setShowAbout(true)} title="Acerca de">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </button>
          {/* Theme picker */}
          <div className="relative">
            <button className="tool-btn !w-7 !h-7 !rounded-md" onClick={() => setShowThemePicker(!showThemePicker)} title="Tema"
              onBlur={() => setTimeout(() => setShowThemePicker(false), 200)}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M4 2a2 2 0 00-2 2v1a1 1 0 002 0V4h1a1 1 0 000-2H4zm9 0a1 1 0 000 2h1v1a1 1 0 002 0V4a2 2 0 00-2-2h-1zM3 10a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm12 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 16v-1a1 1 0 10-2 0v1a2 2 0 002 2h1a1 1 0 100-2H4zm12-1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1a2 2 0 002-2v-1zM8 8a2 2 0 114 0 2 2 0 01-4 0z"/>
              </svg>
            </button>
            {showThemePicker && (
              <div className="absolute right-0 top-9 z-50 w-48 py-1.5 rounded-xl" style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)', animation: 'fade-in 0.15s ease-out',
              }}>
                {THEMES.map((theme) => (
                  <button key={theme.id} className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                    style={{ color: currentThemeId === theme.id ? 'var(--accent)' : 'var(--fg-secondary)', background: currentThemeId === theme.id ? 'var(--select-strong)' : 'transparent' }}
                    onClick={() => { setCurrentThemeId(theme.id); applyTheme(theme); saveThemeId(theme.id); setShowThemePicker(false); }}>
                    <div className="flex gap-0.5">{theme.preview.map((c, i) => <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}</div>
                    <span className="text-[11px] font-medium flex-1">{theme.name}</span>
                    {currentThemeId === theme.id && <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── SIDEBAR ── */}
        <div className="sidebar-panel" style={{ width: sidebarWidth }}>
          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
            <button className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`} onClick={() => setActiveTab('explorer')}>Explorador</button>
            <button className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>Busqueda</button>
          </div>

          {activeTab === 'explorer' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto py-1">
                {appStore.treeRoot ? renderTreeNode(appStore.treeRoot) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--select)', border: '2px dashed var(--border)' }}>
                      <span className="text-2xl" style={{ color: 'var(--fg-muted)' }}>{icons.folder}</span>
                    </div>
                    <p className="text-center text-[11px] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                      Carga una carpeta<br/>para comenzar a etiquetar
                    </p>
                    <button className="btn-primary text-[11px]" onClick={loadFolder}>Abrir carpeta local</button>
                    <button className="btn-ghost text-[11px]" onClick={() => setShowGitHubSetup(true)}>Conectar GitHub</button>
                  </div>
                )}
              </div>
              {/* Activity log */}
              <div style={{ borderTop: '1px solid var(--border)' }}>
                <div className="section-header">Actividad</div>
                <div className="h-28 overflow-auto px-3 pb-2">
                  {appStore.activityLog.map((msg, i) => (
                    <div key={i} className="text-[10px] leading-tight py-0.5 font-mono" style={{ color: 'var(--fg-muted)' }}>{msg}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3">
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Subcarpeta</label>
                  <select className="input-field mt-1" value={subfolder} onChange={(e) => setSubfolder(e.target.value)}>
                    {subfolders.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Contiene</label>
                  <input className="input-field mt-1" value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyFilters()} placeholder="Buscar archivos..." />
                </div>
                <button className="btn-primary w-full" onClick={applyFilters}>Aplicar filtro</button>
              </div>
              <div className="flex-1 overflow-auto">
                {appStore.filteredRelPaths.map((rel) => (
                  <div key={rel} className={`tree-file ${appStore.currentRel === rel ? 'selected' : ''}`}
                    onClick={() => { appStore.setCurrentRel(rel); canvasStore.resetView(); }}>
                    <span className="opacity-40 text-[10px]">◇</span>
                    <span className="truncate">{rel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resizer */}
        <div className="resizer" onMouseDown={onResizerDown} />

        {/* ── CONTENT AREA ── */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left tool strip */}
          <div className="tool-strip">
            <ToolBtn icon={icons.folder} tip="Cargar carpeta" onClick={loadFolder} />
            <ToolBtn icon={icons.fileOpen} tip="Abrir JSONL" onClick={openProject} />
            <ToolBtn icon={icons.save} tip="Guardar" onClick={saveProject} />
            <Divider />
            <ToolBtn icon={icons.chevUp} tip="Carpeta anterior" onClick={navPrevFolder} />
            <ToolBtn icon={icons.chevDown} tip="Carpeta siguiente" onClick={navNextFolder} />
            <ToolBtn icon={icons.arrowLeft} tip="Imagen anterior" onClick={navPrevImage} />
            <ToolBtn icon={icons.arrowRight} tip="Imagen siguiente" onClick={navNextImage} />
            <Divider />
            <ToolBtn icon={icons.hand} tip="PAN (P)" onClick={() => toolStore.setTool('pan')} active={toolStore.activeTool === 'pan'} />
            <ToolBtn icon={icons.adjust} tip="Ajustar (C)" onClick={() => toolStore.setTool('adjust')} active={toolStore.activeTool === 'adjust'} />
            <ToolBtn icon={icons.reset} tip="Reset" onClick={() => { canvasStore.resetView(); canvasStore.requestRender(false); }} />
            <ToolBtn icon={icons.plus} tip="Etiquetar (E)" onClick={() => toolStore.setTool('label')} active={toolStore.activeTool === 'label'} />
            <ToolBtn icon={icons.cursor} tip="Seleccionar (V)" onClick={() => toolStore.setTool('select')} active={toolStore.activeTool === 'select'} />
            <div className="flex-1" />
            <ToolBtn icon={icons.trash} tip="Eliminar" onClick={onDeleteAnnotation} danger />
          </div>

          {/* Viewer + annotations */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Canvas */}
            <ImageCanvas />

            {/* Annotations panel */}
            <div className="annotations-panel" style={{ height: 180 }}>
              <div className="section-header flex items-center justify-between">
                <span>Anotaciones</span>
                {annotations.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'var(--select-strong)', color: 'var(--accent)' }}>
                    {annotations.length}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-auto">
                {annotations.map((b, i) => {
                  const isSelected = toolStore.selectedAnnotationIndex === i;
                  const color = colorForLabel(b.displayName, appStore.labelColors);
                  return (
                    <div key={i} className={`ann-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => { toolStore.setSelectedAnnotation(i); canvasStore.requestRender(false); }}
                      onKeyDown={(e) => { if (e.key === 'Delete' || e.key === 'Backspace') onDeleteAnnotation(); }}
                      tabIndex={0}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="truncate">
                        <span style={{ color }}>{b.displayName}</span>
                        {' '}
                        <span className="opacity-50">({b.xMin.toFixed(3)}, {b.yMin.toFixed(3)}) → ({b.xMax.toFixed(3)}, {b.yMax.toFixed(3)})</span>
                      </span>
                    </div>
                  );
                })}
                {annotations.length === 0 && (
                  <div className="flex items-center justify-center h-full text-[11px]" style={{ color: 'var(--fg-muted)' }}>Sin anotaciones</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DIALOGS ═══ */}
      {showOptions && (
        <DialogModal onClose={() => setShowOptions(false)} title="Opciones Vertex / JSONL">
          <div className="space-y-4">
            <div><label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>GCS prefix</label>
              <input className="input-field mt-1" defaultValue={projectStore.gcsPrefix} onBlur={(e) => projectStore.setGcsPrefix(e.target.value)} /></div>
            <div><label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>ml_use</label>
              <select className="input-field mt-1" defaultValue={projectStore.defaultMlUse} onChange={(e) => projectStore.setDefaultMlUse(e.target.value)}>
                <option value="training">training</option><option value="validation">validation</option><option value="test">test</option><option value="">(vacio)</option>
              </select></div>
          </div>
        </DialogModal>
      )}

      {showAbout && (
        <DialogModal onClose={() => setShowAbout(false)} title="">
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', boxShadow: '0 0 24px var(--accent-glow)' }}>
              <span className="text-xl font-black text-[#050a0e]">T</span>
            </div>
            <div className="logo-text text-2xl">THEIA</div>
            <p className="text-[12px]" style={{ color: 'var(--fg-secondary)' }}>Image Annotation Platform</p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {['DICOM', 'JSONL', 'COCO', 'YOLO', 'MONAI'].map((f) => (
                <span key={f} className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase" style={{ background: 'var(--select-strong)', color: 'var(--accent)' }}>{f}</span>
              ))}
            </div>
          </div>
        </DialogModal>
      )}

      {showHelp && <HelpCenterDialog onClose={() => setShowHelp(false)} />}

      {/* GitHub Setup Dialog */}
      {showGitHubSetup && (
        <GitHubSetupDialog
          onClose={() => setShowGitHubSetup(false)}
          onConnect={async (config, dataPath) => {
            setShowGitHubSetup(false);
            await loadFromGitHub(config, dataPath);
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════

function ToolBtn({ icon, tip, onClick, active, danger }: { icon: React.ReactNode; tip: string; onClick: () => void; active?: boolean; danger?: boolean }) {
  return (
    <button
      className={`tool-btn ${active ? 'active' : ''}`}
      style={danger ? { color: 'var(--danger)', borderColor: 'rgba(255,68,102,0.3)' } : undefined}
      onClick={onClick}
      title={tip}
    >{icon}</button>
  );
}

function Divider() {
  return <div className="w-7 my-1.5" style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />;
}

function MenuDropdown({ label, items }: { label: string; items: (null | { label: string; shortcut?: string; action: () => void })[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button className="text-[11px] font-medium px-2 py-1 rounded-md transition-colors"
        style={{ color: open ? 'var(--accent)' : 'var(--fg-secondary)' }}
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      >{label}</button>
      {open && (
        <div className="absolute top-9 left-0 z-50 min-w-[260px] py-1.5 rounded-xl" style={{
          background: 'linear-gradient(145deg, var(--bg-elevated), var(--bg-primary))',
          border: '1px solid var(--border-bright)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 16px var(--accent-glow)',
          animation: 'fade-in 0.15s ease-out',
        }}>
          {items.map((item, i) => item === null ? (
            <div key={i} className="my-1 mx-3" style={{ height: 1, background: 'var(--border)' }} />
          ) : (
            <button key={i} className="menu-item" onClick={() => { setOpen(false); item.action(); }}>
              <span>{item.label}</span>
              {item.shortcut && <span className="text-[10px] font-mono" style={{ color: 'var(--fg-muted)' }}>{item.shortcut}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DialogModal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-panel" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="text-[13px] font-bold mb-4" style={{ color: 'var(--fg-primary)' }}>{title}</h2>}
        {children}
        <div className="flex justify-end mt-5 gap-2">
          <button className="btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function HelpCenterDialog({ onClose }: { onClose: () => void }) {
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [helpTopics, setHelpTopics] = useState<{ id: string; title: string; content: string }[]>([]);
  if (helpTopics.length === 0) {
    import('@/lib/help-content').then(({ HELP_TOPICS }) => setHelpTopics(HELP_TOPICS));
  }
  const topic = helpTopics[selectedTopic];
  return (
    <div className="dialog-overlay">
      <div className="flex overflow-hidden" style={{
        width: 960, height: 640,
        background: 'linear-gradient(145deg, var(--bg-elevated), var(--bg-primary))',
        border: '1px solid var(--border-bright)',
        borderRadius: 20,
        boxShadow: '0 0 60px rgba(0, 229, 153, 0.06), 0 24px 80px rgba(0, 0, 0, 0.5)',
      }}>
        <div className="flex flex-col" style={{ width: 300, borderRight: '1px solid var(--border)' }}>
          <div className="section-header flex items-center justify-between py-4 px-4">
            <span>Centro de ayuda</span>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--select)' }}>
              <span className="text-[10px]" style={{ color: 'var(--accent)' }}>?</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {helpTopics.map((t, i) => (
              <div key={t.id}
                className={`tree-file ${i === selectedTopic ? 'selected' : ''}`}
                style={{ paddingLeft: 16 }}
                onClick={() => setSelectedTopic(i)}>
                <span className="truncate">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[13px] font-bold" style={{ color: 'var(--accent)' }}>{topic?.title || ''}</span>
            <button className="btn-ghost text-[10px]" onClick={onClose}>Cerrar</button>
          </div>
          <div className="flex-1 overflow-auto p-5 text-[12px] whitespace-pre-wrap leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--fg-secondary)' }}>
            {topic?.content || ''}
          </div>
        </div>
      </div>
    </div>
  );
}

function GitHubSetupDialog({ onClose, onConnect }: { onClose: () => void; onConnect: (config: GitHubConfig, dataPath: string) => void }) {
  const [owner, setOwner] = useState('DruxMeaney');
  const [repo, setRepo] = useState('theia-web');
  const [branch, setBranch] = useState('main');
  const [token, setToken] = useState('');
  const [dataPath, setDataPath] = useState('public/data/MASTOGRAFIAS');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!owner || !repo || !token) { alert('Completa todos los campos.'); return; }
    setLoading(true);
    try { onConnect({ owner, repo, token, branch }, dataPath); }
    catch (err) { alert(`Error: ${err}`); }
    finally { setLoading(false); }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-panel" style={{ minWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--select-strong)', border: '1px solid var(--border-bright)' }}>
            <svg viewBox="0 0 16 16" fill="var(--accent)" className="w-5 h-5"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          </div>
          <div>
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--fg-primary)' }}>Conectar a GitHub</h2>
            <p className="text-[11px]" style={{ color: 'var(--fg-muted)' }}>Lee imagenes y guarda anotaciones en tu repositorio</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1"><label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Owner</label>
              <input className="input-field mt-1" value={owner} onChange={(e) => setOwner(e.target.value)} /></div>
            <div className="flex-1"><label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Repositorio</label>
              <input className="input-field mt-1" value={repo} onChange={(e) => setRepo(e.target.value)} /></div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1"><label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Branch</label>
              <input className="input-field mt-1" value={branch} onChange={(e) => setBranch(e.target.value)} /></div>
            <div className="flex-1"><label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Ruta de datos</label>
              <input className="input-field mt-1" value={dataPath} onChange={(e) => setDataPath(e.target.value)} /></div>
          </div>
          <div><label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Personal Access Token</label>
            <input className="input-field mt-1" type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_..." />
            <p className="text-[9px] mt-1" style={{ color: 'var(--fg-muted)' }}>Necesita permisos: repo (Contents read/write)</p></div>
        </div>
        <div className="flex justify-end mt-5 gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleConnect} disabled={loading}>{loading ? 'Conectando...' : 'Conectar'}</button>
        </div>
      </div>
    </div>
  );
}
