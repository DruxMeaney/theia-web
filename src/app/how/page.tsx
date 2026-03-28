'use client';

import SiteNav from '@/components/shared/SiteNav';

const STEPS = [
  {
    num: '01',
    title: 'Cargar carpeta',
    text: 'Selecciona una carpeta raiz con imagenes (JPG, PNG, DICOM). THEIA escanea recursivamente e indexa por ruta relativa.',
  },
  {
    num: '02',
    title: 'Cargar etiquetas',
    text: 'Carga labels.json con tu catalogo de clases. Soporta formato {"labels":["A","B"]} o ["A","B"].',
  },
  {
    num: '03',
    title: 'Etiquetar',
    text: 'Dibuja bounding boxes con la herramienta Label (E). Selecciona la clase desde el modal. Las cajas se almacenan como coordenadas normalizadas.',
  },
  {
    num: '04',
    title: 'Guardar proyecto',
    text: 'Guarda como JSONL (fuente de verdad). Las rutas relativas aseguran portabilidad entre equipos.',
  },
  {
    num: '05',
    title: 'Exportar',
    text: 'Exporta a COCO, YOLO, MONAI o JSONL (Vertex AI) para alimentar pipelines de entrenamiento.',
  },
];

const TOOLS = [
  { title: 'PAN (P)', text: 'Mover la vista arrastrando el canvas.' },
  { title: 'Zoom', text: 'Rueda del mouse en la posicion del cursor. Clic derecho con arrastre anclado. Rango: 20% a 1000%.' },
  { title: 'Brillo/Contraste (C)', text: 'Arrastre vertical para brillo, horizontal para contraste.' },
  { title: 'Select (V)', text: 'Mover y redimensionar cajas existentes mediante handles.' },
  { title: 'Label (E)', text: 'Dibujar nuevos bounding boxes sobre la imagen.' },
  { title: 'Reset', text: 'Doble clic o boton para restaurar vista, brillo y contraste.' },
];

export default function HowPage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: '72px', background: 'var(--bg-deep)', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <section className="site-section" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p className="site-heading">Flujo</p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--fg-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Como funciona
          </h1>
          <p className="site-text" style={{ maxWidth: '640px' }}>
            Desde la carga de imagenes hasta la exportacion a formatos de entrenamiento, en cinco pasos.
          </p>
        </section>

        {/* ── Flujo de trabajo ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Proceso</p>
          <h2 className="site-title">Flujo de trabajo</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {STEPS.map((step) => (
              <div key={step.num} className="accent-border-left">
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '2px', marginBottom: '0.25rem' }}>
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

        {/* ── Herramientas ── */}
        <section className="site-section" style={{ paddingBottom: '4rem' }}>
          <p className="site-heading">Interaccion</p>
          <h2 className="site-title">Herramientas de interaccion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TOOLS.map((tool) => (
              <div key={tool.title} className="accent-border-left">
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.375rem' }}>
                  {tool.title}
                </h3>
                <p className="site-text">{tool.text}</p>
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
