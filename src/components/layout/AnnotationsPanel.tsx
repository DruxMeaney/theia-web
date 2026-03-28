'use client';

import React, { useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useToolStore } from '@/stores/tool-store';
import { bboxText } from '@/lib/utils';

export default function AnnotationsPanel() {
  const currentRel = useAppStore((s) => s.currentRel);
  const entries = useAppStore((s) => s.entries);
  const removeAnnotation = useAppStore((s) => s.removeAnnotation);
  const selectedAnnotationIndex = useToolStore((s) => s.selectedAnnotationIndex);
  const setSelectedAnnotation = useToolStore((s) => s.setSelectedAnnotation);

  const entry = currentRel ? entries[currentRel] : null;
  const annotations = entry?.annotations ?? [];

  const handleDelete = useCallback(() => {
    if (currentRel && selectedAnnotationIndex != null && selectedAnnotationIndex >= 0) {
      removeAnnotation(currentRel, selectedAnnotationIndex);
      setSelectedAnnotation(null);
    }
  }, [currentRel, selectedAnnotationIndex, removeAnnotation, setSelectedAnnotation]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only handle if not focused on an input
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        handleDelete();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleDelete]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 text-sm font-medium text-[#e5e7eb] border-b border-[#334155] flex-shrink-0">
        Anotaciones
        {annotations.length > 0 && (
          <span className="ml-2 text-xs opacity-50">({annotations.length})</span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {annotations.length === 0 ? (
          <div className="text-xs text-[#e5e7eb] opacity-40 p-4 text-center">
            Sin anotaciones
          </div>
        ) : (
          annotations.map((bbox, i) => (
            <div
              key={i}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer border-l-2 transition-colors ${
                i === selectedAnnotationIndex
                  ? 'bg-[#374151] border-l-[#0ea5e9] text-[#0ea5e9]'
                  : 'border-l-transparent hover:bg-[#374151]/50 text-[#e5e7eb]'
              }`}
              onClick={() => setSelectedAnnotation(i === selectedAnnotationIndex ? null : i)}
            >
              {bboxText(i, bbox)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
