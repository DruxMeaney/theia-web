'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/features', label: 'Capacidades' },
    { href: '/workspace', label: 'Workspace' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14" style={{
      background: 'rgba(5, 10, 14, 0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent 5%, var(--accent) 30%, var(--accent-secondary) 70%, transparent 95%)',
        opacity: 0.2,
      }} />

      <div className="max-w-7xl mx-auto h-full flex items-center px-6 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            boxShadow: '0 0 16px var(--accent-glow)',
          }}>
            <span className="text-[11px] font-black" style={{ color: 'var(--bg-deep)' }}>T</span>
          </div>
          <span className="logo-text text-[15px]">THEIA</span>
        </Link>

        {/* Desktop links */}
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

        {/* CTA */}
        <Link
          href="/workspace"
          className="hidden md:inline-flex btn-primary text-[10px] px-5 py-2"
        >
          Abrir Workspace
        </Link>

        {/* Mobile menu */}
        <button
          className="md:hidden text-[var(--fg-secondary)]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 py-2 px-4" style={{
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
    </nav>
  );
}
