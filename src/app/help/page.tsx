'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/shared/NavBar';

export default function HelpPage() {
  const [topics, setTopics] = useState<{ id: string; title: string; content: string }[]>([]);
  const [selected, setSelected] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    import('@/lib/help-content').then(({ HELP_TOPICS }) => setTopics(HELP_TOPICS));
  }, []);

  const filtered = searchQuery
    ? topics.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics;

  const activeTopic = searchQuery ? filtered[selected] : topics[selected];

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg-deep)' }}>
      <NavBar />

      <div className="flex-1 flex overflow-hidden pt-[48px]">
        {/* Sidebar */}
        <div className="w-[320px] flex flex-col shrink-0" style={{
          background: 'linear-gradient(180deg, var(--bg-primary), var(--bg-deep))',
          borderRight: '1px solid var(--border)',
        }}>
          {/* Header */}
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: 'var(--select-strong)',
                border: '1px solid var(--border-bright)',
              }}>
                <svg viewBox="0 0 20 20" fill="var(--accent)" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-[13px] font-bold" style={{ color: 'var(--fg-primary)' }}>Centro de ayuda</h1>
                <p className="text-[10px]" style={{ color: 'var(--fg-muted)' }}>{topics.length} temas disponibles</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <svg viewBox="0 0 20 20" fill="var(--fg-muted)" className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                className="input-field pl-9 text-[11px]"
                placeholder="Buscar en la ayuda..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelected(0); }}
              />
            </div>
          </div>

          {/* Topic list */}
          <div className="flex-1 overflow-auto px-2 pb-4">
            {(searchQuery ? filtered : topics).map((t, i) => {
              const isActive = searchQuery ? filtered[selected]?.id === t.id : selected === i;
              return (
                <button
                  key={t.id}
                  className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 mb-0.5 flex items-center gap-3"
                  style={{
                    background: isActive ? 'linear-gradient(90deg, var(--select-strong), transparent)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--fg-secondary)',
                    borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                  onClick={() => setSelected(searchQuery ? topics.indexOf(t) : i)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 shrink-0 opacity-40">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[11px] font-medium truncate">{t.title}</span>
                </button>
              );
            })}
            {searchQuery && filtered.length === 0 && (
              <div className="text-center py-8 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
                Sin resultados para &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content header */}
          {activeTopic && (
            <div className="px-8 py-4 flex items-center gap-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
              }}>
                <svg viewBox="0 0 20 20" fill="var(--bg-deep)" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-[14px] font-bold" style={{ color: 'var(--fg-primary)' }}>{activeTopic.title}</h2>
            </div>
          )}

          {/* Content body */}
          <div className="flex-1 overflow-auto px-8 py-6">
            {activeTopic ? (
              <div className="max-w-3xl text-[12px] leading-relaxed whitespace-pre-wrap" style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--fg-secondary)',
              }}>
                {activeTopic.content}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[12px]" style={{ color: 'var(--fg-muted)' }}>
                Selecciona un tema
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
