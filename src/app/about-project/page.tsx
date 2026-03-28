'use client';

import SiteNav from '@/components/shared/SiteNav';

export default function AboutProjectPage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: '72px', background: 'var(--bg-deep)', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <section className="site-section" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p className="site-heading">Proyecto</p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--fg-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Acerca del proyecto
          </h1>
          <p className="site-text" style={{ maxWidth: '640px' }}>
            El origen, la filosofia y la direccion de THEIA.
          </p>
        </section>

        {/* ── Vision ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Proposito</p>
          <h2 className="site-title">Vision</h2>
          <div className="accent-border-left">
            <p className="site-text">
              THEIA nace de la necesidad de anotar imagenes medicas con precision clinica y trazabilidad.
              Las herramientas genericas no entienden DICOM, no manejan coordenadas normalizadas, y no
              exportan a pipelines de entrenamiento. THEIA resuelve eso con un flujo disenado desde
              cero para vision computacional medica.
            </p>
          </div>
        </section>

        {/* ── Filosofia ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Principios</p>
          <h2 className="site-title">Filosofia</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div className="accent-border-left">
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.375rem' }}>
                Carpeta como universo
              </h3>
              <p className="site-text">
                La carpeta raiz define el alcance del proyecto. Todo se referencia con rutas relativas,
                lo que permite mover el proyecto entre equipos sin romper nada.
              </p>
            </div>

            <div className="accent-border-left">
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.375rem' }}>
                Guardar no es Exportar
              </h3>
              <p className="site-text">
                El proyecto JSONL es la fuente de verdad. Las exportaciones a COCO, YOLO o MONAI son
                salidas derivadas para alimentar pipelines de entrenamiento. Separar ambos conceptos
                evita perdida de datos.
              </p>
            </div>

            <div className="accent-border-left">
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.375rem' }}>
                Precision sin complejidad
              </h3>
              <p className="site-text">
                Herramientas profesionales para anotacion medica, sin la sobrecarga de plataformas
                empresariales. Una interfaz directa que prioriza el flujo de trabajo del anotador.
              </p>
            </div>

          </div>
        </section>

        {/* ── Origen ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Historia</p>
          <h2 className="site-title">Origen</h2>
          <div className="accent-border-left">
            <p className="site-text">
              THEIA es la evolucion web de Etiquetador Minerva, una aplicacion de escritorio de 5975
              lineas en Python/Tkinter. Migrado a Next.js, TypeScript y HTML5 Canvas, preservando
              cada funcionalidad mientras mejora la arquitectura, el rendimiento y la experiencia
              de usuario.
            </p>
          </div>
        </section>

        {/* ── Hacia donde crece ── */}
        <section className="site-section" style={{ paddingBottom: '4rem' }}>
          <p className="site-heading">Futuro</p>
          <h2 className="site-title">Hacia donde crece</h2>
          <div className="accent-border-left">
            <p className="site-text">
              THEIA esta disenado para crecer: soporte de segmentacion, anotacion colaborativa,
              etiquetado asistido por modelo e integracion DICOM mas profunda son pasos naturales
              en la evolucion de la plataforma.
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
