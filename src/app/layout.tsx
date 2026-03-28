import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THEIA — Image Annotation Platform',
  description: 'Professional medical image labeling tool for computer vision workflows',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050a0e] text-[#e5e7eb] antialiased">
        {children}
      </body>
    </html>
  );
}
