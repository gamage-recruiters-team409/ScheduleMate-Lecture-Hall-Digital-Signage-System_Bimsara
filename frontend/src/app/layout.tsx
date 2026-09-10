import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScheduleMate — Lecture Hall Digital Signage System',
  description: 'Centralized lecture hall scheduling and digital display platform for Sparkline Academy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
