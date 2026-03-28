'use client';

import Link from 'next/link';
import SiteNav from '@/components/shared/SiteNav';

const FIRST_STEPS = [
  {
    num: '01',
    title: 'Abrir fuente de imagenes',
    text: 'Abre THEIA y selecciona "Abrir carpeta local" para usar File System Access API, o "Conectar GitHub" para leer desde un repositorio.',
  },
  {
    num: '02',
    title: 'Cargar etiquetas',
    text: 'Si labels.json esta en la raiz de la carpeta, se carga automaticamente. De lo contrario, usa Archivo > Cargar etiquetas.',
  },
  {
    num: '03',
    title: 'Anotar una imagen',
    text: 'Selecciona una imagen, presiona E para activar la herramienta Label, dibuja una caja y elige la clase correspondiente.',
  },
  {
    num: '04',
    title: 'Guardar el proyecto',
    text: 'Presiona Ctrl+S para guardar tu proyecto como JSONL. Este archivo es la fuente de verdad de todas tus anotaciones.',
  },
];

const TIPS = [
  {
    title: 'Flujo rapido',
    text: 'Etiquetar una imagen, pasar a la siguiente, etiquetar, guardar cada pocos minutos. Ctrl+S se vuelve reflejo.',
  },
  {
    title: 'Precision',
    text: 'Acercate con la rueda del mouse para detalles finos. Usa PAN para centrar el area de interes y luego dibuja la caja.',
  },
  {
    title: 'Consistencia',
    text: 'Define criterios antes de etiquetar en volumen. Revisa 10-20 imagenes periodicamente para mantener coherencia.',
  },
  {
    title: 'Respaldo',
    text: 'Guarda versiones por fecha: lote01_2025-01-20.jsonl. Asi puedes volver a cualquier punto sin perder trabajo.',
  },
];

export default function GuidePage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: '72px', background: 'var(--bg-deep)', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <section className="site-section" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p className="site-heading">Inicio</p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--fg-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Guia rapida
          </h1>
          <p className="site-text" style={{ maxWidth: '640px' }}>
            Todo lo que necesitas para empezar a usar THEIA.
          </p>
        </section>

        {/* ── Antes de empezar ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Requisitos</p>
          <h2 className="site-title">Antes de empezar</h2>
          <div className="accent-border-left">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <li className="site-text" style={{ paddingLeft: '1rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>--</span>
                Prepara una carpeta con imagenes (JPG, PNG o DICOM)
              </li>
              <li className="site-text" style={{ paddingLeft: '1rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>--</span>
                Crea un labels.json con los nombres de tus clases
              </li>
              <li className="site-text" style={{ paddingLeft: '1rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>--</span>
                Usa Chrome o Edge para soporte completo de File System Access API
              </li>
            </ul>
          </div>
        </section>

        {/* ── Primeros pasos ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Pasos</p>
          <h2 className="site-title">Primeros pasos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FIRST_STEPS.map((step) => (
              <div key={step.num} className="site-card">
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '2px', marginBottom: '0.375rem' }}>
                  PASO {step.num}
                </p>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.5rem' }}>
                  {step.title}
                </h3>
                <p className="site-text">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Consejos practicos ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Consejos</p>
          <h2 className="site-title">Consejos practicos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {TIPS.map((tip) => (
              <div key={tip.title} className="accent-border-left">
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.375rem' }}>
                  {tip.title}
                </h3>
                <p className="site-text">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="site-section" style={{ paddingBottom: '4rem', textAlign: 'center' }}>
          <p className="site-heading">Listo</p>
          <h2 className="site-title">Acceder al etiquetador</h2>
          <Link
            href="/workspace"
            className="btn-primary"
            style={{ display: 'inline-block', padding: '12px 32px', fontSize: '12px', textDecoration: 'none' }}
          >
            Abrir THEIA
          </Link>
        </section>

        {/* ── Footer ── */}
        <footer className="site-footer site-section">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--bg-deep)' }}>T</span>
            </div>
            <span className="logo-text">THEIA</span>
          </div>
          <p className="site-text" style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
            Tactical Health Evaluation &amp; Image Annotation
          </p>
        </footer>

      </main>
    </>
  );
}
