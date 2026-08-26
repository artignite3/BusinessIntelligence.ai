import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BusinessIntelligence.ai — Governed KPI Intelligence Canvas',
  description: 'AI Reinvention Made Real — Accenture Innovation Challenge 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
