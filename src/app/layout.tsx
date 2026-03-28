import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THEIA — Image Annotation Platform',
  description: 'Professional medical image labeling tool for computer vision workflows',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#0f172a] text-[#e5e7eb] antialiased">
        {children}
      </body>
    </html>
  );
}
