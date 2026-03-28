'use client';

import SiteNav from '@/components/shared/SiteNav';

export default function WhatPage() {
  return (
    <>
      <SiteNav />
      <main style={{ paddingTop: '72px', background: 'var(--bg-deep)', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <section className="site-section" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p className="site-heading">Plataforma</p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--fg-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Que es THEIA
          </h1>
          <p className="site-text" style={{ maxWidth: '640px' }}>
            Una plataforma de anotacion de imagenes medicas disenada para flujos de trabajo en vision computacional.
          </p>
        </section>

        {/* ── El problema ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Contexto</p>
          <h2 className="site-title">El problema</h2>
          <div className="accent-border-left">
            <p className="site-text">
              La anotacion de imagenes medicas exige precision, trazabilidad y compatibilidad de formatos.
              Las herramientas genericas no manejan DICOM, no exportan a pipelines de entrenamiento,
              y pierden contexto entre sesiones. El resultado: flujos fragmentados, coordenadas inconsistentes
              y tiempo perdido adaptando datos a cada framework.
            </p>
          </div>
        </section>

        {/* ── La solucion ── */}
        <section className="site-section" style={{ paddingBottom: '3rem' }}>
          <p className="site-heading">Propuesta</p>
          <h2 className="site-title">La solucion</h2>
          <div className="accent-border-left">
            <p className="site-text">
              THEIA ofrece un flujo completo de anotacion: cargar una carpeta, etiquetar imagenes con
              bounding boxes, guardar como JSONL, y exportar a COCO, YOLO o MONAI. Todo se almacena en
              coordenadas normalizadas (0-1) para independencia de resolucion. Un solo proyecto, multiples
              formatos de salida.
            </p>
          </div>
        </section>

        {/* ── Para quien es ── */}
        <section className="site-section" style={{ paddingBottom: '4rem' }}>
          <p className="site-heading">Audiencia</p>
          <h2 className="site-title">Para quien es</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="site-card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.75rem' }}>
                Investigadores medicos
              </h3>
              <p className="site-text">
                Estudian microcalcificaciones, lesiones y artefactos en mamografias. Necesitan precision
                a nivel de pixel y exportacion a formatos de entrenamiento.
              </p>
            </div>

            <div className="site-card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.75rem' }}>
                Equipos de ML/AI
              </h3>
              <p className="site-text">
                Construyen modelos de deteccion y segmentacion a partir de datos clinicos. Requieren
                COCO, YOLO o MONAI como entrada directa a sus pipelines.
              </p>
            </div>

            <div className="site-card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fg-primary)', marginBottom: '0.75rem' }}>
                Proyectos clinico-tecnicos
              </h3>
              <p className="site-text">
                Conectan flujos de radiologia con pipelines de vision computacional. Necesitan una
                herramienta que entienda DICOM y hable el lenguaje de ambos mundos.
              </p>
            </div>

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
