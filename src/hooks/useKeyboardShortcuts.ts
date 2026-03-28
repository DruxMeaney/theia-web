'use client';

import { useEffect } from 'react';
import { useToolStore } from '@/stores/tool-store';

interface ShortcutActions {
  loadFolder: () => void;
  newProject: () => void;
  openProject: () => void;
  saveProject: () => void;
  saveProjectAs: () => void;
  importJsonl: () => void;
  importCoco: () => void;
  exportJsonl: () => void;
  exportCoco: () => void;
  prevImage: () => void;
  nextImage: () => void;
  openHelp: () => void;
  openOptions: () => void;
}

export function useKeyboardShortcuts(actions: ShortcutActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept when typing in inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const key = e.key.toLowerCase();

      // Tool shortcuts (no modifier)
      if (!ctrl && !shift && !e.altKey) {
        switch (key) {
          case 'p':
            e.preventDefault();
            useToolStore.getState().setTool('pan');
            return;
          case 'e':
            e.preventDefault();
            useToolStore.getState().setTool('label');
            return;
          case 'c':
            e.preventDefault();
            useToolStore.getState().setTool('adjust');
            return;
          case 'v':
            e.preventDefault();
            useToolStore.getState().setTool('select');
            return;
          case 'arrowleft':
          case 'arrowup':
            e.preventDefault();
            actions.prevImage();
            return;
          case 'arrowright':
          case 'arrowdown':
            e.preventDefault();
            actions.nextImage();
            return;
          case 'f1':
            e.preventDefault();
            actions.openHelp();
            return;
        }
      }

      // Ctrl/Cmd shortcuts
      if (ctrl && !shift) {
        switch (key) {
          case 'l':
            e.preventDefault();
            actions.loadFolder();
            return;
          case 'n':
            e.preventDefault();
            actions.newProject();
            return;
          case 'o':
            e.preventDefault();
            actions.openProject();
            return;
          case 's':
            e.preventDefault();
            actions.saveProject();
            return;
          case 'i':
            e.preventDefault();
            actions.importJsonl();
            return;
          case 'e':
            e.preventDefault();
            actions.exportJsonl();
            return;
          case ',':
            e.preventDefault();
            actions.openOptions();
            return;
        }
      }

      // Ctrl+Shift shortcuts
      if (ctrl && shift) {
        switch (key) {
          case 's':
            e.preventDefault();
            actions.saveProjectAs();
            return;
          case 'c':
            e.preventDefault();
            actions.importCoco();
            return;
          case 'e':
            e.preventDefault();
            actions.exportCoco();
            return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);
}
