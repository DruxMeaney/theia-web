'use client';

import React, { useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import type { TreeNode } from '@/lib/types';
import ActivityLog from './ActivityLog';

interface ExplorerTabProps {
  onSelectFile: (relPath: string) => void;
}

function TreeNodeItem({
  node,
  depth,
  selectedRel,
  onSelectFile,
  onToggleFolder,
}: {
  node: TreeNode;
  depth: number;
  selectedRel: string | null;
  onSelectFile: (relPath: string) => void;
  onToggleFolder: (relPath: string) => void;
}) {
  const isFolder = node.type === 'folder';
  const isSelected = !isFolder && node.relPath === selectedRel;

  return (
    <>
      <div
        className={`flex items-center cursor-pointer py-0.5 px-1 text-sm hover:bg-[#374151] rounded transition-colors ${
          isSelected ? 'bg-[#374151] text-[#0ea5e9]' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={() => {
          if (isFolder) {
            onToggleFolder(node.relPath);
          } else {
            onSelectFile(node.relPath);
          }
        }}
      >
        {/* Icon */}
        {isFolder ? (
          <span className="mr-1.5 text-xs w-4 text-center flex-shrink-0">
            {node.isOpen ? '▼' : '▶'}
          </span>
        ) : (
          <span className="mr-1.5 text-xs w-4 text-center flex-shrink-0 opacity-50">
            ◻
          </span>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {/* Children */}
      {isFolder && node.isOpen && node.children?.map((child) => (
        <TreeNodeItem
          key={child.relPath}
          node={child}
          depth={depth + 1}
          selectedRel={selectedRel}
          onSelectFile={onSelectFile}
          onToggleFolder={onToggleFolder}
        />
      ))}
    </>
  );
}

export default function ExplorerTab({ onSelectFile }: ExplorerTabProps) {
  const treeRoot = useAppStore((s) => s.treeRoot);
  const currentRel = useAppStore((s) => s.currentRel);
  const setTreeRoot = useAppStore((s) => s.setTreeRoot);
  const allRelPaths = useAppStore((s) => s.allRelPaths);
  const filteredRelPaths = useAppStore((s) => s.filteredRelPaths);

  const toggleFolder = useCallback(
    (relPath: string) => {
      if (!treeRoot) return;

      function toggle(node: TreeNode): TreeNode {
        if (node.relPath === relPath && node.type === 'folder') {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: node.children.map(toggle) };
        }
        return node;
      }

      setTreeRoot(toggle(treeRoot));
    },
    [treeRoot, setTreeRoot],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Tree */}
      <div className="flex-1 min-h-0 overflow-y-auto p-1">
        {treeRoot ? (
          treeRoot.children?.map((child) => (
            <TreeNodeItem
              key={child.relPath}
              node={child}
              depth={0}
              selectedRel={currentRel}
              onSelectFile={onSelectFile}
              onToggleFolder={toggleFolder}
            />
          ))
        ) : (
          <div className="text-sm text-[#e5e7eb] opacity-40 p-4 text-center">
            No hay carpeta cargada
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex-shrink-0 px-2 py-1 text-xs text-[#e5e7eb] opacity-50 border-t border-[#334155]">
        {allRelPaths.length > 0
          ? `${filteredRelPaths.length} / ${allRelPaths.length} imágenes`
          : 'Sin imágenes'}
      </div>

      {/* Activity log */}
      <div className="flex-shrink-0 h-[160px] border-t border-[#334155]">
        <ActivityLog />
      </div>
    </div>
  );
}
