'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { dirname } from '@/lib/utils';

interface SearchTabProps {
  onSelectFile: (relPath: string) => void;
  onAction: (action: string) => void;
}

export default function SearchTab({ onSelectFile, onAction }: SearchTabProps) {
  const allRelPaths = useAppStore((s) => s.allRelPaths);
  const filteredRelPaths = useAppStore((s) => s.filteredRelPaths);
  const currentRel = useAppStore((s) => s.currentRel);
  const setFilteredRelPaths = useAppStore((s) => s.setFilteredRelPaths);

  const [subfolder, setSubfolder] = useState('');
  const [contains, setContains] = useState('');

  // Extract unique subfolders
  const subfolders = useMemo(() => {
    const dirs = new Set<string>();
    dirs.add(''); // "all"
    allRelPaths.forEach((p) => {
      const d = dirname(p);
      if (d) dirs.add(d);
    });
    return Array.from(dirs).sort();
  }, [allRelPaths]);

  const applyFilter = useCallback(() => {
    let result = allRelPaths;

    if (subfolder) {
      result = result.filter((p) => p.startsWith(subfolder + '/') || dirname(p) === subfolder);
    }

    if (contains.trim()) {
      const term = contains.trim().toLowerCase();
      result = result.filter((p) => p.toLowerCase().includes(term));
    }

    setFilteredRelPaths(result);
  }, [allRelPaths, subfolder, contains, setFilteredRelPaths]);

  return (
    <div className="flex flex-col h-full p-2 gap-2">
      {/* Subfolder select */}
      <div>
        <label className="block text-xs text-[#e5e7eb] opacity-60 mb-1">Subcarpeta</label>
        <select
          className="w-full bg-[#374151] border border-[#334155] rounded px-2 py-1 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#0ea5e9]"
          value={subfolder}
          onChange={(e) => setSubfolder(e.target.value)}
        >
          {subfolders.map((sf) => (
            <option key={sf} value={sf}>
              {sf || '(Todas)'}
            </option>
          ))}
        </select>
      </div>

      {/* Contains input */}
      <div>
        <label className="block text-xs text-[#e5e7eb] opacity-60 mb-1">Contiene</label>
        <input
          type="text"
          className="w-full bg-[#374151] border border-[#334155] rounded px-2 py-1 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#0ea5e9]"
          value={contains}
          onChange={(e) => setContains(e.target.value)}
          placeholder="Nombre de archivo..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyFilter();
          }}
        />
      </div>

      {/* Apply button */}
      <button
        className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium py-1.5 px-4 rounded transition-colors"
        onClick={applyFilter}
      >
        Aplicar
      </button>

      {/* File list */}
      <div className="flex-1 min-h-0 overflow-y-auto border border-[#334155] rounded bg-[#0f172a]">
        {filteredRelPaths.length === 0 ? (
          <div className="text-xs text-[#e5e7eb] opacity-40 p-3 text-center">
            Sin resultados
          </div>
        ) : (
          filteredRelPaths.map((rel) => (
            <div
              key={rel}
              className={`px-2 py-1 text-xs cursor-pointer truncate hover:bg-[#374151] transition-colors ${
                rel === currentRel ? 'bg-[#374151] text-[#0ea5e9]' : 'text-[#e5e7eb]'
              }`}
              onClick={() => onSelectFile(rel)}
              title={rel}
            >
              {rel}
            </div>
          ))
        )}
      </div>

      {/* Count */}
      <div className="text-xs text-[#e5e7eb] opacity-50 flex-shrink-0">
        {filteredRelPaths.length} de {allRelPaths.length}
      </div>
    </div>
  );
}
