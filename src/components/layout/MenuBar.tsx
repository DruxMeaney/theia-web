'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useProjectStore } from '@/stores/project-store';

interface MenuBarProps {
  onAction: (action: string) => void;
}

type MenuItem = {
  label: string;
  action?: string;
  separator?: never;
  submenu?: MenuItem[];
} | {
  separator: true;
  label?: string;
  action?: never;
  submenu?: never;
};

const fileMenuItems: MenuItem[] = [
  { label: 'Cargar carpeta', action: 'load-folder' },
  { label: 'Cargar etiquetas', action: 'load-labels' },
  { separator: true },
  { label: 'Nuevo JSONL', action: 'new-jsonl' },
  { label: 'Abrir JSONL', action: 'open-jsonl' },
  { label: 'Guardar', action: 'save' },
  { label: 'Guardar como', action: 'save-as' },
  { separator: true },
  {
    label: 'Importar',
    submenu: [
      { label: 'JSONL Vertex', action: 'import-vertex' },
      { label: 'COCO', action: 'import-coco' },
      { label: 'YOLO', action: 'import-yolo' },
    ],
  },
  {
    label: 'Exportar',
    submenu: [
      { label: 'JSONL Vertex', action: 'export-vertex' },
      { label: 'COCO', action: 'export-coco' },
      { label: 'YOLO', action: 'export-yolo' },
      { label: 'MONAI', action: 'export-monai' },
    ],
  },
  { separator: true },
  { label: 'Opciones Vertex', action: 'vertex-options' },
  { separator: true },
  { label: 'Salir', action: 'quit' },
];

const helpMenuItems: MenuItem[] = [
  { label: 'Centro de ayuda', action: 'help-center' },
  { separator: true },
  { label: 'Acerca de', action: 'about' },
];

function MenuDropdown({
  label,
  items,
  onAction,
  isOpen,
  onToggle,
  onClose,
}: {
  label: string;
  items: MenuItem[];
  onAction: (action: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
        setSubmenuOpen(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        className={`px-3 py-1 text-sm hover:bg-[#374151] rounded transition-colors ${
          isOpen ? 'bg-[#374151]' : ''
        }`}
        onClick={onToggle}
      >
        {label}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-[#1f2937] border border-[#334155] rounded shadow-lg z-50">
          {items.map((item, i) => {
            if (item.separator) {
              return <div key={i} className="border-t border-[#334155] my-1" />;
            }
            if (item.submenu) {
              return (
                <div
                  key={i}
                  className="relative"
                  onMouseEnter={() => setSubmenuOpen(item.label)}
                  onMouseLeave={() => setSubmenuOpen(null)}
                >
                  <button className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#374151] flex justify-between items-center">
                    <span>{item.label}</span>
                    <span className="ml-4 text-xs opacity-60">&#9654;</span>
                  </button>
                  {submenuOpen === item.label && (
                    <div className="absolute left-full top-0 min-w-[180px] bg-[#1f2937] border border-[#334155] rounded shadow-lg">
                      {item.submenu.map((sub, j) => (
                        <button
                          key={j}
                          className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#374151]"
                          onClick={() => {
                            if (sub.action) onAction(sub.action);
                            onClose();
                            setSubmenuOpen(null);
                          }}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button
                key={i}
                className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#374151]"
                onClick={() => {
                  if (item.action) onAction(item.action);
                  onClose();
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MenuBar({ onAction }: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const projectName = useProjectStore((s) => s.projectName);
  const dirty = useProjectStore((s) => s.dirty);

  const toggleMenu = useCallback(
    (menu: string) => {
      setOpenMenu((prev) => (prev === menu ? null : menu));
    },
    [],
  );

  const closeAll = useCallback(() => setOpenMenu(null), []);

  return (
    <div className="flex items-center h-9 px-2 bg-[#0b0f14] border-b border-[#334155] flex-shrink-0">
      {/* Logo */}
      <span className="font-bold text-[#0ea5e9] text-base tracking-wider mr-4 select-none">
        THEIA
      </span>

      {/* Menus */}
      <div className="flex items-center gap-1">
        <MenuDropdown
          label="Archivo"
          items={fileMenuItems}
          onAction={onAction}
          isOpen={openMenu === 'file'}
          onToggle={() => toggleMenu('file')}
          onClose={closeAll}
        />
        <MenuDropdown
          label="Ayuda"
          items={helpMenuItems}
          onAction={onAction}
          isOpen={openMenu === 'help'}
          onToggle={() => toggleMenu('help')}
          onClose={closeAll}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Project name + dirty indicator */}
      <div className="flex items-center gap-2 text-sm mr-2">
        {projectName && (
          <>
            <span className="text-[#e5e7eb] opacity-70">{projectName}</span>
            {dirty && (
              <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block" title="Sin guardar" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
