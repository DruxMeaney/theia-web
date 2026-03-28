'use client';

import SiteNav from '@/components/shared/SiteNav';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/what', label: 'Que es THEIA' },
  { href: '/how', label: 'Como funciona' },
  { href: '/outputs', label: 'Salidas' },
  { href: '/architecture', label: 'Capacidades' },
  { href: '/guide', label: 'Guia' },
  { href: '/about-project', label: 'Acerca de' },
];

const INDICATORS = ['5 formatos', 'Zoom 1000%', 'DICOM nativo', '6 temas'];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', overflowY: 'auto', overflowX: 'hidden' }}>
      <SiteNav />

      {/* ── Hero ── */}
      <section
        className="flex flex-col items-center justify-center text-center px-6"
        style={{
          minHeight: '85vh',
          paddingTop: '56px',
          position: 'relative',
        }}
      >
        {/* Subtle radial glow behind hero */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          opacity: 0.12,
          pointerEvents: 'none',
        }} />

        {/* THEIA title */}
        <h1
          style={{
            fontSize: 'clamp(64px, 12vw, 140px)',
            fontWeight: 900,
            letterSpacing: '0.1em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--accent-bright), var(--accent), var(--accent-secondary))',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient-shift 8s ease infinite',
            filter: 'drop-shadow(0 0 30px var(--accent-glow))',
            position: 'relative',
          }}
        >
          THEIA
        </h1>

        {/* Decorative line */}
        <div style={{
          width: '120px',
          height: '1px',
          margin: '24px auto',
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
        }} />

        {/* Subtitle */}
        <p style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          color: 'var(--fg-muted)',
          marginBottom: '20px',
        }}>
          Tactical Health Evaluation &amp; Image Annotation
        </p>

        {/* Description */}
        <p style={{
          fontSize: '15px',
          maxWidth: '560px',
          color: 'var(--fg-secondary)',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}>
          Plataforma de anotacion de imagenes medicas para vision computacional.
          Precision clinica, formatos estandar y flujo de trabajo sin fricciones.
        </p>

        {/* Primary CTA */}
        <Link
          href="/workspace"
          className="btn-primary"
          style={{
            fontSize: '13px',
            padding: '14px 40px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Abrir THEIA
        </Link>

        {/* Indicators row */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          style={{
            marginTop: '48px',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--fg-muted)',
          }}
        >
          {INDICATORS.map((item, i) => (
            <span key={item} className="flex items-center gap-4">
              {i > 0 && <span style={{ opacity: 0.4 }}>&#xb7;</span>}
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Section 2: Brief overview ── */}
      <section className="site-section" style={{ paddingTop: '96px', paddingBottom: '96px' }}>
        <p className="site-heading">Plataforma</p>
        <h2 className="site-title">Una herramienta, un flujo completo</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ marginTop: '32px' }}>
          {/* Anotacion */}
          <div className="accent-border-left">
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              marginBottom: '8px',
            }}>
              Anotacion
            </h3>
            <p className="site-text">
              Dibuja bounding boxes normalizados sobre imagenes medicas de cualquier resolucion.
            </p>
          </div>

          {/* Formatos */}
          <div className="accent-border-left">
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              marginBottom: '8px',
            }}>
              Formatos
            </h3>
            <p className="site-text">
              Importa y exporta en JSONL, COCO, YOLO y MONAI. Compatibilidad directa con pipelines de entrenamiento.
            </p>
          </div>

          {/* Imagenes clinicas */}
          <div className="accent-border-left">
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              marginBottom: '8px',
            }}>
              Imagenes clinicas
            </h3>
            <p className="site-text">
              Soporte nativo para DICOM con windowing, Rescale y MONOCHROME1. JPG y PNG incluidos.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
          }}>
            <span style={{ fontSize: '7px', fontWeight: 900, color: 'var(--bg-deep)' }}>T</span>
          </div>
          <span className="logo-text" style={{ fontSize: '11px', letterSpacing: '3px' }}>THEIA</span>
        </div>
        <p style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: 'var(--fg-muted)',
          marginBottom: '20px',
        }}>
          Tactical Health Evaluation &amp; Image Annotation
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--fg-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fg-secondary)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fg-muted)'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
