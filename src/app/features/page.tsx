'use client';

import Link from 'next/link';
import NavBar from '@/components/shared/NavBar';

/* ── SVG Icons ── */
const icons: Record<string, React.ReactNode> = {
  pencil: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
    </svg>
  ),
  cursor: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.963a5.03 5.03 0 01-.65.278 1 1 0 10.68 1.88A7.045 7.045 0 006.09 5.18l.271 1.012a1 1 0 001.932-.518l-.259-.963A5.038 5.038 0 009.29 4.61a1 1 0 00-.68-1.88 7.043 7.043 0 00-1.06.382l-.272-1.012-.306.174.306-.174zM4 10a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1zm9-1a1 1 0 100 2h2a1 1 0 100-2h-2zm-4 4a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clipRule="evenodd"/>
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
    </svg>
  ),
  magnifyingGlass: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
    </svg>
  ),
  hand: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v3.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd"/>
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
    </svg>
  ),
  arrowPath: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
    </svg>
  ),
  paintBrush: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v1a1 1 0 002 0V4h1a1 1 0 000-2H4zm9 0a1 1 0 000 2h1v1a1 1 0 002 0V4a2 2 0 00-2-2h-1zM3 10a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm12 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 16v-1a1 1 0 10-2 0v1a2 2 0 002 2h1a1 1 0 100-2H4zm12-1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1a2 2 0 002-2v-1zM8 8a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd"/>
    </svg>
  ),
  squares: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.07.28.22.882H15a1 1 0 110 2H5a1 1 0 110-2h2.82l.22-.882.07-.28.122-.489H5a2 2 0 01-2-2V5zm3.5 4a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd"/>
    </svg>
  ),
  hospital: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 012 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V7z" clipRule="evenodd"/>
    </svg>
  ),
  chartBar: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
    </svg>
  ),
  cog: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
    </svg>
  ),
  document: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
    </svg>
  ),
  archive: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
      <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H9a1 1 0 001-1v-.5z"/>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
    </svg>
  ),
  save: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h1v3l3-3h5a2 2 0 002-2V6a2 2 0 00-2-2H5zm4 5V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z"/>
    </svg>
  ),
  link: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
    </svg>
  ),
  folderOpen: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd"/>
      <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z"/>
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
    </svg>
  ),
  keyboard: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 1a1 1 0 000 2h1a1 1 0 000-2H5zm3 0a1 1 0 000 2h1a1 1 0 000-2H8zm3 0a1 1 0 000 2h1a1 1 0 000-2h-1zm3 0a1 1 0 000 2h1a1 1 0 100-2h-1zM5 9a1 1 0 000 2h1a1 1 0 000-2H5zm7 0a1 1 0 000 2h1a1 1 0 000-2h-1zm3 0a1 1 0 000 2h1a1 1 0 100-2h-1zM7 12a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M4 2a2 2 0 00-2 2v1a1 1 0 002 0V4h1a1 1 0 000-2H4zm9 0a1 1 0 000 2h1v1a1 1 0 002 0V4a2 2 0 00-2-2h-1zM3 10a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm12 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 16v-1a1 1 0 10-2 0v1a2 2 0 002 2h1a1 1 0 100-2H4zm12-1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1a2 2 0 002-2v-1zM8 8a2 2 0 114 0 2 2 0 01-4 0z"/>
    </svg>
  ),
  clipboardList: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
    </svg>
  ),
  questionMark: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
    </svg>
  ),
  github: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd"/>
    </svg>
  ),
};

const sections = [
  {
    id: 'annotation',
    badge: 'Core',
    title: 'Herramientas de anotacion',
    items: [
      { icon: 'pencil', name: 'Dibujar cajas', desc: 'Crea bounding boxes con arrastre. Coordenadas normalizadas 0-1 automaticamente.' },
      { icon: 'cursor', name: 'Seleccionar y editar', desc: 'Mueve y redimensiona cajas desde handles (esquinas, bordes, centro). Hit-test inteligente.' },
      { icon: 'trash', name: 'Eliminar', desc: 'Borra anotaciones desde la lista o con tecla Delete. Confirmacion de seguridad.' },
      { icon: 'tag', name: 'Clases por etiqueta', desc: 'Sistema de labels.json con colores automaticos (cold-to-warm palette). Anade clases al vuelo.' },
    ]
  },
  {
    id: 'visualization',
    badge: 'Visor',
    title: 'Visualizacion avanzada',
    items: [
      { icon: 'magnifyingGlass', name: 'Zoom hasta 1000%', desc: 'Zoom con rueda del raton (al puntero) o arrastre con clic derecho (anclado). Limites 20%-1000%.' },
      { icon: 'hand', name: 'PAN fluido', desc: 'Desplazamiento con herramienta PAN, clic medio, o durante zoom. Sin perdida de rendimiento.' },
      { icon: 'sun', name: 'Brillo y contraste', desc: 'Ajuste en tiempo real arrastrando vertical (brillo) y horizontal (contraste). Factor 0.0015 como la app original.' },
      { icon: 'arrowPath', name: 'Reset instantaneo', desc: 'Doble clic o boton Reset para volver a vista original, brillo=1, contraste=1.' },
    ]
  },
  {
    id: 'rendering',
    badge: 'Engine',
    title: 'Motor de renderizado',
    items: [
      { icon: 'bolt', name: 'Crop-based rendering', desc: 'Solo renderiza la porcion visible de la imagen. Rendimiento estable con imagenes de alta resolucion.' },
      { icon: 'paintBrush', name: 'Doble calidad', desc: 'Modo rapido (bilinear) durante drag/zoom, modo final (lanczos) al soltar. 60fps constantes.' },
      { icon: 'squares', name: 'Coordenadas precisas', desc: 'imgToCanvas() y canvasToImgNorm() garantizan exactitud geometrica entre pantalla y datos.' },
      { icon: 'monitor', name: 'HUD overlay', desc: 'Indicadores de brillo, contraste y zoom siempre visibles. Indicador de herramienta activa.' },
    ]
  },
  {
    id: 'dicom',
    badge: 'Medico',
    title: 'Soporte DICOM',
    items: [
      { icon: 'hospital', name: 'Transfer Syntaxes', desc: 'Soporta sin comprimir (Implicit/Explicit VR), JPEG, JPEG 2000, JPEG-LS y RLE.' },
      { icon: 'chartBar', name: 'Windowing automatico', desc: 'WindowCenter/Width del DICOM. Si no existe, auto-window con min/max del pixel data.' },
      { icon: 'refresh', name: 'MONOCHROME1', desc: 'Inversion automatica para imagenes MONOCHROME1 (comun en mastografia).' },
      { icon: 'cog', name: 'Rescale Slope/Intercept', desc: 'Aplicacion correcta de pendiente e intercepto para modalidades CT y mas.' },
    ]
  },
  {
    id: 'formats',
    badge: 'I/O',
    title: 'Formatos de importacion y exportacion',
    items: [
      { icon: 'document', name: 'JSONL (Vertex AI)', desc: 'imageGcsUri + boundingBoxAnnotations + dataItemResourceLabels. Compatible con Google Cloud.' },
      { icon: 'archive', name: 'COCO', desc: 'images/annotations/categories estandar. Bbox en [x,y,w,h] pixeles.' },
      { icon: 'folder', name: 'YOLO', desc: 'Un .txt por imagen con class cx cy w h normalizado + classes.txt.' },
      { icon: 'brain', name: 'MONAI', desc: 'Mascaras PNG (segmentacion) + dataset_monai.json, o archivo Python con DATA/LABELS_MAP (deteccion).' },
    ]
  },
  {
    id: 'project',
    badge: 'Proyecto',
    title: 'Gestion de proyectos',
    items: [
      { icon: 'save', name: 'JSONL como fuente de verdad', desc: 'Guardar/Abrir/Guardar como. Rutas relativas para portabilidad total.' },
      { icon: 'link', name: 'Emparejamiento inteligente', desc: 'Coincidencia por sufijo de URI (gs://), luego por basename. Maneja colisiones.' },
      { icon: 'folderOpen', name: 'Explorador de archivos', desc: 'Arbol recursivo de carpetas, busqueda por subcarpeta y texto, filtrado en vivo.' },
      { icon: 'cloud', name: 'GitHub sync', desc: 'Lee imagenes desde raw.githubusercontent.com, guarda JSONL via GitHub Contents API.' },
    ]
  },
  {
    id: 'ux',
    badge: 'UX',
    title: 'Experiencia de usuario',
    items: [
      { icon: 'keyboard', name: 'Atajos de teclado', desc: 'P=PAN, E=Etiquetar, C=Ajustar, V=Seleccionar, flechas=navegar, Ctrl+S=guardar.' },
      { icon: 'palette', name: '6 temas', desc: 'Emerald, Cian, Violeta, Ambar, Rosa, Menta. Cambio instantaneo, persistido en localStorage.' },
      { icon: 'clipboardList', name: 'Log de actividad', desc: 'Bitacora de sesion con timestamps. Util para auditoria y trazabilidad.' },
      { icon: 'questionMark', name: '29 temas de ayuda', desc: 'Centro de ayuda integrado con tutoriales, glosario, FAQ y buenas practicas.' },
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
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{
                    background: 'var(--select-strong)',
                    color: 'var(--accent)',
                  }}>
                    {icons[item.icon]}
                  </div>
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
