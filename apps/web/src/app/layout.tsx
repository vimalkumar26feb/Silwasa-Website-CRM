import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLoader } from '../components/ui/PageLoader';
import { PromotionalPopup } from '../components/ui/PromotionalPopup';
import { AnalyticsHead } from '../components/layout/AnalyticsHead';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silwasa IT Solutions | AI-Powered Web, Mobile & Enterprise Software Development',
  description: 'Silwasa IT Solutions engineers scalable web applications, enterprise software, AI solutions, and high-performance digital platforms.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <AnalyticsHead />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        {children}
        <PromotionalPopup />
      </body>
    </html>
  );
}
