'use client';

import SiteNav from '@/components/shared/SiteNav';

const FORMATS = [
  {
    title: 'JSONL (Vertex AI)',
    text: 'Listo para Google Cloud AutoML. Cada linea contiene imageGcsUri con gcs_prefix + ruta relativa y las anotaciones del modelo BBox.',
  },
  {
    title: 'COCO',
    text: 'Formato estandar con secciones images, annotations y categories. El bbox se expresa como [x, y, w, h] en pixeles.',
  },
  {
    title: 'YOLO',
    text: 'Un archivo .txt por imagen con "class cx cy w h" normalizado, mas un classes.txt con el catalogo de clases.',
  },
  {
    title: 'MONAI',
    text: 'Dos modos: mascaras PNG (segmentacion, IDs de clase por pixel) o archivo Python (deteccion, con DATA y LABELS_MAP).',
  },
];

export default function OutputsPage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: '72px', background: 'var(--bg-deep)', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <section className="site-section" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p className="site-heading">Archivos</p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--fg-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Salidas y archivos
          </h1>
          <p className="site-text" style={{ maxWidth: '640px' }}>
            Todo lo que THEIA produce y para que sirve.
          </p>
        </section>

        {/* ── Proyecto JSONL ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Fuente de verdad</p>
          <h2 className="site-title">Proyecto JSONL</h2>
          <div className="accent-border-left">
            <p className="site-text" style={{ marginBottom: '0.75rem' }}>
              El archivo de proyecto es JSONL: una linea por imagen. Cada linea contiene los campos
              imageGcsUri, boundingBoxAnnotations (arreglo de objetos con displayName, xMin, yMin, xMax, yMax)
              y dataItemResourceLabels.
            </p>
            <p className="site-text">
              Este archivo es la fuente de verdad. Las operaciones Guardar, Abrir y Guardar como trabajan
              directamente sobre el. Los formatos de exportacion son derivados de este archivo.
            </p>
          </div>
        </section>

        {/* ── Formatos de exportacion ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Exportacion</p>
          <h2 className="site-title">Formatos de exportacion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FORMATS.map((fmt) => (
              <div key={fmt.title} className="site-card">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.75rem' }}>
                  {fmt.title}
                </h3>
                <p className="site-text">{fmt.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Emparejamiento de rutas ── */}
        <section className="site-section" style={{ paddingBottom: '4rem' }}>
          <p className="site-heading">Importacion</p>
          <h2 className="site-title">Emparejamiento de rutas</h2>
          <div className="accent-border-left">
            <p className="site-text" style={{ marginBottom: '0.75rem' }}>
              Al importar anotaciones, THEIA empareja cada registro con una imagen local mediante dos
              estrategias: primero intenta hacer match por sufijo desde URIs gs://, luego recurre al
              nombre base del archivo como fallback.
            </p>
            <p className="site-text">
              Es importante mantener nombres de archivo unicos dentro del proyecto para evitar
              ambiguedades en el emparejamiento.
            </p>
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
