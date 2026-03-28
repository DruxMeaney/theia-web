'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { THEMES, getThemeById, applyTheme, saveThemeId, loadThemeId } from '@/lib/themes';

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState('emerald');
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadThemeId();
    setActiveThemeId(saved);
    applyTheme(getThemeById(saved));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectTheme(id: string) {
    setActiveThemeId(id);
    const theme = getThemeById(id);
    applyTheme(theme);
    saveThemeId(id);
    setThemeOpen(false);
  }

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/features', label: 'Capacidades' },
    { href: '/help', label: 'Ayuda' },
    { href: '/workspace', label: 'Workspace' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-12" style={{
      background: 'rgba(5, 10, 14, 0.9)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    }}>
      {/* Accent glow line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent 5%, var(--accent) 30%, var(--accent-secondary) 70%, transparent 95%)',
        opacity: 0.25,
      }} />

      <div className="max-w-7xl mx-auto h-full flex items-center px-5 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            boxShadow: '0 0 12px var(--accent-glow)',
          }}>
            <span className="text-[10px] font-black" style={{ color: 'var(--bg-deep)' }}>T</span>
          </div>
          <span className="logo-text text-[14px]">THEIA</span>
        </Link>

        {/* Desktop nav buttons */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[2px] rounded-lg transition-all duration-300"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--fg-muted)',
                  background: isActive ? 'var(--select-strong)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--fg-secondary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--fg-muted)';
                }}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] rounded-full" style={{
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px var(--accent-glow)',
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Theme palette button */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              color: themeOpen ? 'var(--accent)' : 'var(--fg-muted)',
              background: themeOpen ? 'var(--select-strong)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!themeOpen) (e.currentTarget as HTMLElement).style.color = 'var(--fg-secondary)';
            }}
            onMouseLeave={(e) => {
              if (!themeOpen) (e.currentTarget as HTMLElement).style.color = 'var(--fg-muted)';
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M4 2a2 2 0 00-2 2v1a1 1 0 002 0V4h1a1 1 0 000-2H4zm9 0a1 1 0 000 2h1v1a1 1 0 002 0V4a2 2 0 00-2-2h-1zM3 10a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm12 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 16v-1a1 1 0 10-2 0v1a2 2 0 002 2h1a1 1 0 100-2H4zm12-1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1a2 2 0 002-2v-1zM8 8a2 2 0 114 0 2 2 0 01-4 0z"/>
            </svg>
          </button>

          {/* Theme dropdown */}
          {themeOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52 py-2 rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-bright)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                animation: 'fadeIn 0.15s ease-out',
              }}
            >
              {THEMES.map((theme) => {
                const isActive = theme.id === activeThemeId;
                return (
                  <button
                    key={theme.id}
                    onClick={() => selectTheme(theme.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150"
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--fg-secondary)',
                      background: isActive ? 'var(--select-strong)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    {/* 3 color circles */}
                    <div className="flex items-center gap-1 shrink-0">
                      {theme.preview.map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium flex-1">{theme.name}</span>
                    {isActive && (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent)' }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          style={{ color: 'var(--fg-secondary)' }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-12 left-0 right-0 py-2 px-4" style={{
          background: 'rgba(5, 10, 14, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-[12px] font-medium uppercase tracking-wider"
              style={{ color: pathname === link.href ? 'var(--accent)' : 'var(--fg-secondary)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
