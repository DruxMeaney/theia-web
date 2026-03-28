'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { THEMES, getThemeById, applyTheme, saveThemeId, loadThemeId } from '@/lib/themes';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/what', label: 'Que es THEIA' },
  { href: '/how', label: 'Como funciona' },
  { href: '/outputs', label: 'Salidas' },
  { href: '/architecture', label: 'Capacidades' },
  { href: '/guide', label: 'Guia' },
  { href: '/about-project', label: 'Acerca de' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState('violet');
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      height: '56px',
      background: 'rgba(5, 10, 14, 0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      {/* Subtle accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent 5%, var(--accent) 30%, var(--accent-secondary) 70%, transparent 95%)',
        opacity: 0.15,
      }} />

      <div className="max-w-7xl mx-auto h-full flex items-center px-5">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
          }}>
            <span className="text-[10px] font-black" style={{ color: 'var(--bg-deep)' }}>T</span>
          </div>
          <span className="logo-text text-[14px]">THEIA</span>
        </Link>

        {/* Center: Navigation links */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200"
                style={{
                  fontSize: '11px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase' as const,
                  color: isActive ? 'var(--accent)' : 'var(--fg-muted)',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--fg-secondary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--fg-muted)';
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: CTA + Theme + Mobile hamburger */}
        <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
          {/* CTA button */}
          <Link
            href="/workspace"
            className="btn-primary hidden sm:inline-flex items-center"
            style={{
              fontSize: '10px',
              padding: '6px 16px',
              letterSpacing: '1px',
              textDecoration: 'none',
            }}
          >
            Ir al etiquetador
          </Link>

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
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2.5 2.5 0 002.5-2.5c0-.61-.23-1.21-.64-1.67-.08-.09-.13-.21-.13-.33 0-.35.28-.63.63-.63H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
              </svg>
            </button>

            {themeOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 py-2 rounded-xl overflow-hidden"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-bright)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  animation: 'fade-in 0.15s ease-out',
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

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            style={{ color: 'var(--fg-secondary)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              {mobileOpen
                ? <path d="M6 6l12 12M6 18L18 6" />
                : <path d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 py-3 px-5" style={{
          background: 'rgba(5, 10, 14, 0.96)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border)',
        }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3"
              style={{
                fontSize: '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase' as const,
                color: pathname === link.href ? 'var(--accent)' : 'var(--fg-secondary)',
                fontWeight: pathname === link.href ? 600 : 400,
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/workspace"
            className="btn-primary inline-flex items-center mt-3 mb-1"
            style={{
              fontSize: '10px',
              padding: '6px 16px',
              letterSpacing: '1px',
              textDecoration: 'none',
            }}
            onClick={() => setMobileOpen(false)}
          >
            Ir al etiquetador
          </Link>
        </div>
      )}
    </nav>
  );
}
