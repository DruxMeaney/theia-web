'use client';

import React, { useState } from 'react';
import ExplorerTab from './ExplorerTab';
import SearchTab from './SearchTab';

interface SidebarProps {
  onSelectFile: (relPath: string) => void;
  onAction: (action: string) => void;
}

type TabId = 'explorer' | 'search';

export default function Sidebar({ onSelectFile, onAction }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>('explorer');

  return (
    <div className="flex flex-col h-full">
      {/* Tab buttons */}
      <div className="flex border-b border-[#334155] flex-shrink-0">
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'explorer'
              ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9] bg-[#0f172a]'
              : 'text-[#e5e7eb] opacity-60 hover:opacity-100'
          }`}
          onClick={() => setActiveTab('explorer')}
        >
          Explorador
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9] bg-[#0f172a]'
              : 'text-[#e5e7eb] opacity-60 hover:opacity-100'
          }`}
          onClick={() => setActiveTab('search')}
        >
          Búsqueda
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'explorer' && (
          <ExplorerTab onSelectFile={onSelectFile} />
        )}
        {activeTab === 'search' && (
          <SearchTab onSelectFile={onSelectFile} onAction={onAction} />
        )}
      </div>
    </div>
  );
}
