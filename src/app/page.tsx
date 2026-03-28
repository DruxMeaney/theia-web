'use client';

import Link from 'next/link';
import NavBar from '@/components/shared/NavBar';

/* ── SVG Icon components ── */
function IconFormats() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
    </svg>
  );
}
function IconZoom() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
    </svg>
  );
}
function IconThemes() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M4 2a2 2 0 00-2 2v1a1 1 0 002 0V4h1a1 1 0 000-2H4zm9 0a1 1 0 000 2h1v1a1 1 0 002 0V4a2 2 0 00-2-2h-1zM3 10a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm12 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 16v-1a1 1 0 10-2 0v1a2 2 0 002 2h1a1 1 0 100-2H4zm12-1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1a2 2 0 002-2v-1zM8 8a2 2 0 114 0 2 2 0 01-4 0z"/>
    </svg>
  );
}
function IconDicom() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 012 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V7z" clipRule="evenodd"/>
    </svg>
  );
}

/* Feature card icons */
function IconAnnotation() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
    </svg>
  );
}
function IconMultiFormat() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm-2 4a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
    </svg>
  );
}
function IconGitHub() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd"/>
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      <NavBar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-60px' }}>
          <div className="w-[500px] h-[500px] rounded-full" style={{
            background: 'radial-gradient(circle, rgba(0,229,153,0.06) 0%, rgba(0,212,255,0.03) 40%, transparent 70%)',
          }} />
        </div>

        {/* Giant THEIA */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="blur-[80px] opacity-25" style={{
              width: '500px', height: '200px',
              background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--accent))',
            }} />
          </div>
          <h1 className="relative" style={{
            fontSize: 'clamp(72px, 14vw, 160px)',
            fontWeight: 900,
            letterSpacing: '0.12em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--accent-bright) 0%, var(--accent) 30%, var(--accent-secondary) 60%, var(--accent-bright) 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 6s ease infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px var(--accent-glow)) drop-shadow(0 0 60px rgba(0,212,255,0.15))',
          }}>
            THEIA
          </h1>
        </div>

        {/* Decorative line */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--accent))' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }} />
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
        </div>

        {/* Subtitle */}
        <h2 className="text-[11px] font-bold uppercase tracking-[5px] mb-5" style={{
          background: 'linear-gradient(90deg, var(--fg-muted), var(--accent), var(--fg-muted))',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 4s ease infinite',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Tactical Health Evaluation & Image Annotation
        </h2>

        {/* Description */}
        <p className="text-[14px] leading-relaxed max-w-2xl mb-10" style={{ color: 'var(--fg-secondary)' }}>
          Plataforma profesional de anotacion de imagenes medicas para flujos de trabajo
          en vision computacional. Etiquetado preciso, formatos clinicos y rendimiento real.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mb-20">
          <Link href="/workspace" className="btn-primary text-[12px] px-8 py-3">
            Abrir Workspace
          </Link>
          <Link href="/features" className="btn-ghost text-[12px] px-6 py-3">
            Explorar capacidades
          </Link>
        </div>
      </section>

      {/* Quick Stats Row */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <IconFormats />, value: '5', label: 'Formatos' },
            { icon: <IconZoom />, value: '1000%', label: 'Zoom max' },
            { icon: <IconThemes />, value: '6', label: 'Temas' },
            { icon: <IconDicom />, value: 'DICOM', label: 'Nativo' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-5 rounded-xl transition-all duration-300"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px var(--accent-glow)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
            >
              <div style={{ color: 'var(--accent)' }}>{stat.icon}</div>
              <div className="text-[20px] font-black" style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[2px] font-semibold" style={{ color: 'var(--fg-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Features Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[11px] font-bold uppercase tracking-[4px] mb-3" style={{ color: 'var(--accent)' }}>
              Herramientas de precision
            </h2>
            <p className="text-[22px] font-bold" style={{ color: 'var(--fg-primary)' }}>
              Todo lo que necesitas para etiquetar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                ),
                title: 'Anotacion precisa',
                desc: 'Dibuja, mueve y redimensiona bounding boxes con coordenadas normalizadas 0-1. Hit-test por handles con prioridad de seleccion.',
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 012 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V7z" clipRule="evenodd"/>
                  </svg>
                ),
                title: 'DICOM nativo',
                desc: 'Carga archivos DICOM directamente. Windowing automatico, RescaleSlope/Intercept, inversion MONOCHROME1 para mastografias.',
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm-2 4a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                  </svg>
                ),
                title: 'Multi-formato',
                desc: 'Importa y exporta en JSONL (Vertex AI), COCO, YOLO y MONAI. Compatibilidad total con pipelines de entrenamiento.',
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
                  </svg>
                ),
                title: 'Zoom 1000%',
                desc: 'Zoom fluido con render optimizado. Modo rapido durante drag, alta calidad al soltar. Ideal para microcalcificaciones.',
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M4 2a2 2 0 00-2 2v1a1 1 0 002 0V4h1a1 1 0 000-2H4zm9 0a1 1 0 000 2h1v1a1 1 0 002 0V4a2 2 0 00-2-2h-1zM3 10a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm12 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 16v-1a1 1 0 10-2 0v1a2 2 0 002 2h1a1 1 0 100-2H4zm12-1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1a2 2 0 002-2v-1zM8 8a2 2 0 114 0 2 2 0 01-4 0z"/>
                  </svg>
                ),
                title: '6 temas visuales',
                desc: 'Personaliza la interfaz con paletas de Emerald, Cian, Violeta, Ambar, Rosa o Menta. Cada detalle se adapta.',
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd"/>
                  </svg>
                ),
                title: 'GitHub sync',
                desc: 'Conecta tu repositorio para leer imagenes y guardar anotaciones directamente. Colaboracion sin fricciones.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl transition-all duration-500"
                style={{
                  background: 'linear-gradient(145deg, var(--bg-elevated), var(--bg-primary))',
                  border: '1px solid var(--border)',
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: 'linear-gradient(145deg, var(--select-strong), transparent)',
                  boxShadow: '0 0 30px var(--accent-glow)',
                }} />
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{
                    background: 'var(--select-strong)',
                    color: 'var(--accent)',
                  }}>
                    {feature.icon}
                  </div>
                  <h3 className="text-[13px] font-bold mb-2" style={{ color: 'var(--fg-primary)' }}>{feature.title}</h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
          }}>
            <span className="text-[7px] font-black" style={{ color: 'var(--bg-deep)' }}>T</span>
          </div>
          <span className="logo-text text-[12px]">THEIA</span>
        </div>
        <p className="text-[10px]" style={{ color: 'var(--fg-muted)' }}>
          Tactical Health Evaluation & Image Annotation
        </p>
      </footer>
    </div>
  );
}
