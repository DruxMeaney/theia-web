'use client';

import SiteNav from '@/components/shared/SiteNav';

const COMPONENTS = [
  {
    title: 'Visor de imagenes',
    text: 'HTML5 Canvas 2D con renderizado basado en recorte (crop-based). Dos modos de calidad: bilinear durante arrastre, lanczos al soltar.',
  },
  {
    title: 'Motor de anotacion',
    text: 'Modelo BBox con normFix(), hit-test con prioridad de handles, transformaciones de coordenadas entre espacio de imagen y canvas.',
  },
  {
    title: 'Gestion de proyectos',
    text: 'JSONL como fuente de verdad. Flag de cambios no guardados (dirty), operaciones Guardar/Abrir/Guardar como, proyectos recientes.',
  },
  {
    title: 'Import/Export',
    text: 'Importadores y exportadores modulares: JSONL, COCO, YOLO, MONAI. Emparejamiento de rutas por sufijo y basename.',
  },
  {
    title: 'Soporte DICOM',
    text: 'dicom-parser con windowing, RescaleSlope/Intercept, inversion MONOCHROME1, y soporte para transfer syntax comprimidos.',
  },
  {
    title: 'Integracion GitHub',
    text: 'Lectura de imagenes desde URLs raw del repositorio. Escritura de JSONL via Contents API con commits automaticos.',
  },
];

const DETAILS = [
  {
    title: 'Coordenadas normalizadas',
    text: 'Todas las anotaciones usan coordenadas 0-1 para independencia de resolucion. La conversion a pixeles ocurre solo al exportar.',
  },
  {
    title: 'Renderizado optimizado',
    text: 'Solo la porcion visible se renderiza. Interpolacion bilinear durante arrastre para fluidez, lanczos al soltar para calidad maxima.',
  },
  {
    title: 'Sistema de temas',
    text: 'Seis paletas con mas de 20 variables CSS cada una. Cambio instantaneo via CSS custom properties sin recarga.',
  },
  {
    title: 'Atajos de teclado',
    text: 'P = PAN, E = Label, C = Ajustar brillo/contraste, V = Select, flechas = navegar imagenes, Ctrl+S = guardar.',
  },
];

export default function ArchitecturePage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: '72px', background: 'var(--bg-deep)', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <section className="site-section" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p className="site-heading">Sistema</p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--fg-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Arquitectura y capacidades
          </h1>
          <p className="site-text" style={{ maxWidth: '640px' }}>
            Los componentes internos que hacen posible la anotacion precisa de imagenes medicas.
          </p>
        </section>

        {/* ── Componentes del sistema ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Componentes</p>
          <h2 className="site-title">Componentes del sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPONENTS.map((comp) => (
              <div key={comp.title} className="site-card">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.75rem' }}>
                  {comp.title}
                </h3>
                <p className="site-text">{comp.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Detalles tecnicos ── */}
        <section className="site-section" style={{ paddingBottom: '4rem' }}>
          <p className="site-heading">Detalles</p>
          <h2 className="site-title">Detalles tecnicos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {DETAILS.map((d) => (
              <div key={d.title} className="accent-border-left">
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.375rem' }}>
                  {d.title}
                </h3>
                <p className="site-text">{d.text}</p>
              </div>
            ))}
          </div>
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
