'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { clamp } from '@/lib/utils';

interface AppShellProps {
  sidebar: React.ReactNode;
  leftControls: React.ReactNode;
  viewer: React.ReactNode;
  annotationsPanel: React.ReactNode;
  menuBar: React.ReactNode;
}

export default function AppShell({
  sidebar,
  leftControls,
  viewer,
  annotationsPanel,
  menuBar,
}: AppShellProps) {
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(380);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      setSidebarWidth(clamp(startW.current + delta, 280, 640));
    };
    const onMouseUp = () => {
      dragging.current = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="no-select flex flex-col h-screen w-screen overflow-hidden bg-[#0f172a] text-[#e5e7eb]">
      {/* Menu bar */}
      {menuBar}

      {/* Main body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div
          className="flex-shrink-0 overflow-hidden bg-[#1f2937] border-r border-[#334155]"
          style={{ width: sidebarWidth }}
        >
          {sidebar}
        </div>

        {/* Resizer */}
        <div
          className="w-[6px] cursor-col-resize bg-[#334155] hover:bg-[#0ea5e9] transition-colors flex-shrink-0"
          onMouseDown={onMouseDown}
        />

        {/* Content area */}
        <div className="flex flex-1 min-w-0">
          {/* Left controls */}
          <div className="flex-shrink-0 w-[70px] bg-[#0b0f14] border-r border-[#334155] overflow-y-auto">
            {leftControls}
          </div>

          {/* Viewer + Annotations */}
          <div className="flex flex-1 min-w-0 flex-col">
            <div className="flex flex-1 min-h-0">
              {/* Canvas viewer */}
              <div className="flex-1 min-w-0 bg-[#0b0f14]">
                {viewer}
              </div>

              {/* Annotations panel */}
              <div className="w-[260px] flex-shrink-0 bg-[#1f2937] border-l border-[#334155] overflow-hidden">
                {annotationsPanel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
