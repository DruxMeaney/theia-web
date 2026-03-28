'use client';

import React from 'react';
import { useToolStore } from '@/stores/tool-store';
import type { ToolMode } from '@/lib/types';

interface LeftControlsProps {
  onAction: (action: string) => void;
}

interface ControlButton {
  id: string;
  icon: string;
  tooltip: string;
  action: string;
  /** If set, this button reflects an active tool */
  tool?: ToolMode;
}

const buttons: ControlButton[] = [
  { id: 'load-folder', icon: '📂', tooltip: 'Cargar carpeta', action: 'load-folder' },
  { id: 'load-jsonl', icon: '📄', tooltip: 'Abrir JSONL', action: 'open-jsonl' },
  { id: 'save-jsonl', icon: '💾', tooltip: 'Guardar JSONL', action: 'save' },
  { id: 'prev-folder', icon: '⏮', tooltip: 'Carpeta anterior', action: 'prev-folder' },
  { id: 'next-folder', icon: '⏭', tooltip: 'Carpeta siguiente', action: 'next-folder' },
  { id: 'prev-image', icon: '◀', tooltip: 'Imagen anterior', action: 'prev-image' },
  { id: 'next-image', icon: '▶', tooltip: 'Imagen siguiente', action: 'next-image' },
  { id: 'pan', icon: '✋', tooltip: 'Pan (P)', action: 'tool-pan', tool: 'pan' },
  { id: 'adjust', icon: '☀', tooltip: 'Ajustar brillo/contraste (C)', action: 'tool-adjust', tool: 'adjust' as ToolMode },
  { id: 'reset', icon: '↺', tooltip: 'Restablecer vista', action: 'reset-view' },
  { id: 'label', icon: '▣', tooltip: 'Etiquetar (E)', action: 'tool-label', tool: 'label' },
  { id: 'select', icon: '⬚', tooltip: 'Seleccionar (V)', action: 'tool-select', tool: 'select' },
  { id: 'delete', icon: '🗑', tooltip: 'Eliminar selección', action: 'delete-annotation' },
];

export default function LeftControls({ onAction }: LeftControlsProps) {
  const activeTool = useToolStore((s) => s.activeTool);

  return (
    <div className="flex flex-col items-center gap-1 py-2">
      {buttons.map((btn) => {
        const isActive = btn.tool != null && btn.tool === activeTool;
        return (
          <button
            key={btn.id}
            className={`w-11 h-11 flex items-center justify-center rounded text-lg transition-colors border ${
              isActive
                ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#0ea5e9]'
                : 'border-transparent hover:bg-[#374151] text-[#e5e7eb]'
            }`}
            onClick={() => onAction(btn.action)}
            title={btn.tooltip}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
}
