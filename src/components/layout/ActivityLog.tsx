'use client';

import React, { useRef, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';

export default function ActivityLog() {
  const activityLog = useAppStore((s) => s.activityLog);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activityLog]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-1 text-xs font-medium text-[#e5e7eb] opacity-60 flex-shrink-0 border-b border-[#334155]">
        Actividad de la sesión
      </div>
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-1 font-mono text-[11px] text-[#e5e7eb] opacity-70 bg-[#0b0f14]"
      >
        {activityLog.length === 0 ? (
          <div className="text-center opacity-40 pt-2">Sin actividad</div>
        ) : (
          activityLog.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap break-all leading-tight py-px">
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
