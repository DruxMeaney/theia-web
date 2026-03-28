import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THEIA — Tactical Health Evaluation & Image Annotation',
  description: 'Plataforma profesional de anotacion de imagenes medicas para vision computacional. DICOM, JSONL, COCO, YOLO, MONAI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ background: 'var(--bg-deep)', color: 'var(--fg-primary)' }}>
        {children}
      </body>
    </html>
  );
}
