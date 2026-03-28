'use client';

import Link from 'next/link';
import NavBar from '@/components/shared/NavBar';

const sections = [
  {
    id: 'annotation',
    badge: 'Core',
    title: 'Herramientas de anotacion',
    items: [
      { icon: '✏️', name: 'Dibujar cajas', desc: 'Crea bounding boxes con arrastre. Coordenadas normalizadas 0-1 automaticamente.' },
      { icon: '🖱️', name: 'Seleccionar y editar', desc: 'Mueve y redimensiona cajas desde handles (esquinas, bordes, centro). Hit-test inteligente.' },
      { icon: '🗑️', name: 'Eliminar', desc: 'Borra anotaciones desde la lista o con tecla Delete. Confirmacion de seguridad.' },
      { icon: '🏷️', name: 'Clases por etiqueta', desc: 'Sistema de labels.json con colores automaticos (cold-to-warm palette). Añade clases al vuelo.' },
    ]
  },
  {
    id: 'visualization',
    badge: 'Visor',
    title: 'Visualizacion avanzada',
    items: [
      { icon: '🔍', name: 'Zoom hasta 1000%', desc: 'Zoom con rueda del raton (al puntero) o arrastre con clic derecho (anclado). Limites 20%-1000%.' },
      { icon: '✋', name: 'PAN fluido', desc: 'Desplazamiento con herramienta PAN, clic medio, o durante zoom. Sin perdida de rendimiento.' },
      { icon: '☀️', name: 'Brillo y contraste', desc: 'Ajuste en tiempo real arrastrando vertical (brillo) y horizontal (contraste). Factor 0.0015 como la app original.' },
      { icon: '↺', name: 'Reset instantaneo', desc: 'Doble clic o boton Reset para volver a vista original, brillo=1, contraste=1.' },
    ]
  },
  {
    id: 'rendering',
    badge: 'Engine',
    title: 'Motor de renderizado',
    items: [
      { icon: '⚡', name: 'Crop-based rendering', desc: 'Solo renderiza la porcion visible de la imagen. Rendimiento estable con imagenes de alta resolucion.' },
      { icon: '🎨', name: 'Doble calidad', desc: 'Modo rapido (bilinear) durante drag/zoom, modo final (lanczos) al soltar. 60fps constantes.' },
      { icon: '📐', name: 'Coordenadas precisas', desc: 'imgToCanvas() y canvasToImgNorm() garantizan exactitud geometrica entre pantalla y datos.' },
      { icon: '🖥️', name: 'HUD overlay', desc: 'Indicadores de brillo, contraste y zoom siempre visibles. Indicador de herramienta activa.' },
    ]
  },
  {
    id: 'dicom',
    badge: 'Medico',
    title: 'Soporte DICOM',
    items: [
      { icon: '🏥', name: 'Transfer Syntaxes', desc: 'Soporta sin comprimir (Implicit/Explicit VR), JPEG, JPEG 2000, JPEG-LS y RLE.' },
      { icon: '📊', name: 'Windowing automatico', desc: 'WindowCenter/Width del DICOM. Si no existe, auto-window con min/max del pixel data.' },
      { icon: '🔄', name: 'MONOCHROME1', desc: 'Inversion automatica para imagenes MONOCHROME1 (comun en mastografia).' },
      { icon: '⚙️', name: 'Rescale Slope/Intercept', desc: 'Aplicacion correcta de pendiente e intercepto para modalidades CT y mas.' },
    ]
  },
  {
    id: 'formats',
    badge: 'I/O',
    title: 'Formatos de importacion y exportacion',
    items: [
      { icon: '📋', name: 'JSONL (Vertex AI)', desc: 'imageGcsUri + boundingBoxAnnotations + dataItemResourceLabels. Compatible con Google Cloud.' },
      { icon: '📦', name: 'COCO', desc: 'images/annotations/categories estandar. Bbox en [x,y,w,h] pixeles.' },
      { icon: '📁', name: 'YOLO', desc: 'Un .txt por imagen con class cx cy w h normalizado + classes.txt.' },
      { icon: '🧠', name: 'MONAI', desc: 'Mascaras PNG (segmentacion) + dataset_monai.json, o archivo Python con DATA/LABELS_MAP (deteccion).' },
    ]
  },
  {
    id: 'project',
    badge: 'Proyecto',
    title: 'Gestion de proyectos',
    items: [
      { icon: '💾', name: 'JSONL como fuente de verdad', desc: 'Guardar/Abrir/Guardar como. Rutas relativas para portabilidad total.' },
      { icon: '🔗', name: 'Emparejamiento inteligente', desc: 'Coincidencia por sufijo de URI (gs://), luego por basename. Maneja colisiones.' },
      { icon: '📂', name: 'Explorador de archivos', desc: 'Arbol recursivo de carpetas, busqueda por subcarpeta y texto, filtrado en vivo.' },
      { icon: '☁️', name: 'GitHub sync', desc: 'Lee imagenes desde raw.githubusercontent.com, guarda JSONL via GitHub Contents API.' },
    ]
  },
  {
    id: 'ux',
    badge: 'UX',
    title: 'Experiencia de usuario',
    items: [
      { icon: '⌨️', name: 'Atajos de teclado', desc: 'P=PAN, E=Etiquetar, C=Ajustar, V=Seleccionar, flechas=navegar, Ctrl+S=guardar.' },
      { icon: '🎨', name: '6 temas', desc: 'Emerald, Cian, Violeta, Ambar, Rosa, Menta. Cambio instantaneo, persistido en localStorage.' },
      { icon: '📝', name: 'Log de actividad', desc: 'Bitacora de sesion con timestamps. Util para auditoria y trazabilidad.' },
      { icon: '❓', name: '29 temas de ayuda', desc: 'Centro de ayuda integrado con tutoriales, glosario, FAQ y buenas practicas.' },
    ]
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      <NavBar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="badge mb-4 inline-block">Capacidades completas</span>
          <h1 className="text-[28px] font-bold mt-4 mb-4" style={{ color: 'var(--fg-primary)' }}>
            Todo lo que THEIA puede hacer
          </h1>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
            Cada funcion del etiquetador original de escritorio, reconstruida para la web
            con mejoras de arquitectura, rendimiento y experiencia de usuario.
          </p>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section, si) => (
        <section key={section.id} className="py-16 px-6" style={{
          background: si % 2 === 1 ? 'linear-gradient(180deg, transparent, rgba(0,229,153,0.015), transparent)' : undefined,
        }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="badge">{section.badge}</span>
              <h2 className="text-[18px] font-bold" style={{ color: 'var(--fg-primary)' }}>
                {section.title}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {section.items.map((item, i) => (
                <div key={i} className="group flex gap-4 p-5 rounded-xl transition-all duration-300" style={{
                  background: 'linear-gradient(145deg, var(--bg-elevated), var(--bg-primary))',
                  border: '1px solid var(--border)',
                }}>
                  <div className="text-2xl shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <h3 className="text-[12px] font-bold mb-1" style={{ color: 'var(--fg-primary)' }}>{item.name}</h3>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <Link href="/workspace" className="btn-primary text-[12px] px-10 py-3">
          Ir al Workspace
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-center gap-3 mb-2">
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
