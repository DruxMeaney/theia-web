'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/shared/NavBar';

// Particle system for background
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; color: string }[] = [];
    const colors = ['#00e599', '#00d4ff', '#a78bfa', '#00ffaa', '#6366f1'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 153, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.a;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, p.color + '22');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      <NavBar />
      <ParticleCanvas />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
        {/* Radial glow behind logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full" style={{
            background: 'radial-gradient(circle, rgba(0,229,153,0.08) 0%, rgba(0,212,255,0.04) 40%, transparent 70%)',
          }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
          {/* Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-3xl opacity-20" style={{
              background: 'radial-gradient(circle, var(--accent), var(--accent-secondary))',
            }} />
            <div className="relative rounded-3xl overflow-hidden" style={{
              boxShadow: '0 0 60px rgba(0,229,153,0.12), 0 0 120px rgba(0,212,255,0.06)',
            }}>
              <Image
                src="/theia-logo.jpeg"
                alt="THEIA Logo"
                width={260}
                height={260}
                className="relative rounded-3xl"
                style={{
                  filter: 'invert(1) hue-rotate(180deg) brightness(1.5) contrast(1.2)',
                }}
                priority
              />
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-[13px] font-bold uppercase tracking-[6px] mb-4" style={{
            background: 'linear-gradient(135deg, var(--accent-bright), var(--accent-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Tactical Health Evaluation & Image Annotation
          </h1>

          {/* Description */}
          <p className="text-[15px] leading-relaxed max-w-2xl mb-3" style={{ color: 'var(--fg-secondary)' }}>
            Plataforma profesional de anotacion de imagenes medicas para flujos de trabajo
            en vision computacional. Etiquetado preciso, formatos clinicos y rendimiento real.
          </p>

          <p className="text-[12px] mb-10 max-w-xl" style={{ color: 'var(--fg-muted)' }}>
            DICOM nativo &bull; JSONL/COCO/YOLO/MONAI &bull; Zoom 1000% &bull; Coordenadas normalizadas &bull; GitHub sync
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mb-16">
            <Link href="/workspace" className="btn-primary text-[12px] px-8 py-3">
              Abrir Workspace
            </Link>
            <Link href="/features" className="btn-ghost text-[12px] px-6 py-3">
              Explorar capacidades
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-8">
            {[
              { value: '5', label: 'Formatos' },
              { value: '1000%', label: 'Zoom max' },
              { value: '6', label: 'Temas' },
              { value: 'DICOM', label: 'Nativo' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-[22px] font-black mb-1" style={{
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
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] uppercase tracking-[3px]" style={{ color: 'var(--fg-muted)' }}>Scroll</span>
          <svg viewBox="0 0 20 20" fill="var(--accent)" className="w-4 h-4 opacity-50">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[4px] mb-4" style={{ color: 'var(--accent)' }}>
              Herramientas de precision
            </h2>
            <p className="text-[24px] font-bold" style={{ color: 'var(--fg-primary)' }}>
              Todo lo que necesitas para etiquetar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Anotacion precisa',
                desc: 'Dibuja, mueve y redimensiona bounding boxes con coordenadas normalizadas 0-1. Hit-test por handles con prioridad de seleccion.',
              },
              {
                icon: '🏥',
                title: 'DICOM nativo',
                desc: 'Carga archivos DICOM directamente. Windowing automatico, RescaleSlope/Intercept, inversion MONOCHROME1 para mastografias.',
              },
              {
                icon: '📦',
                title: 'Multi-formato',
                desc: 'Importa y exporta en JSONL (Vertex AI), COCO, YOLO y MONAI. Compatibilidad total con pipelines de entrenamiento.',
              },
              {
                icon: '🔬',
                title: 'Zoom 1000%',
                desc: 'Zoom fluido con render optimizado. Modo rapido durante drag, alta calidad al soltar. Ideal para microcalcificaciones.',
              },
              {
                icon: '🎨',
                title: '6 temas visuales',
                desc: 'Personaliza la interfaz con paletas de Emerald, Cian, Violeta, Ambar, Rosa o Menta. Cada detalle se adapta.',
              },
              {
                icon: '☁️',
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
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: 'linear-gradient(145deg, var(--select-strong), transparent)',
                  boxShadow: '0 0 30px var(--accent-glow)',
                }} />
                <div className="relative">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-[13px] font-bold mb-2" style={{ color: 'var(--fg-primary)' }}>{feature.title}</h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative py-24 px-6" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,153,0.02), transparent)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[11px] font-bold uppercase tracking-[4px] mb-4" style={{ color: 'var(--accent)' }}>
            Flujo de trabajo
          </h2>
          <p className="text-[22px] font-bold mb-16" style={{ color: 'var(--fg-primary)' }}>
            De la imagen al modelo en 4 pasos
          </p>

          <div className="grid grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Carga', desc: 'Selecciona tu carpeta de imagenes o conecta GitHub' },
              { step: '02', title: 'Etiqueta', desc: 'Dibuja cajas con herramientas interactivas de precision' },
              { step: '03', title: 'Guarda', desc: 'Proyecto JSONL como fuente de verdad, con rutas relativas' },
              { step: '04', title: 'Exporta', desc: 'COCO, YOLO, MONAI o JSONL listo para Vertex AI' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-[18px] font-black" style={{
                  background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-surface))',
                  border: '1px solid var(--border-bright)',
                  color: 'var(--accent)',
                  boxShadow: '0 0 20px var(--accent-glow)',
                }}>
                  {step.step}
                </div>
                <h3 className="text-[12px] font-bold mb-1" style={{ color: 'var(--fg-primary)' }}>{step.title}</h3>
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute" style={{
                    width: '40px', height: '1px',
                    background: 'linear-gradient(90deg, var(--accent-glow), transparent)',
                    top: '50%', left: `${25 * (i + 1)}%`,
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-12 rounded-3xl relative overflow-hidden" style={{
            background: 'linear-gradient(145deg, var(--bg-elevated), var(--bg-deep))',
            border: '1px solid var(--border-bright)',
            boxShadow: '0 0 60px rgba(0,229,153,0.05)',
          }}>
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              opacity: 0.5,
            }} />
            <h2 className="text-[20px] font-bold mb-4" style={{ color: 'var(--fg-primary)' }}>
              Comienza a etiquetar ahora
            </h2>
            <p className="text-[12px] mb-8" style={{ color: 'var(--fg-muted)' }}>
              Sin instalacion. Sin cuenta. Abre tu navegador y empieza.
            </p>
            <Link href="/workspace" className="btn-primary text-[12px] px-10 py-3">
              Ir al Workspace
            </Link>
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
