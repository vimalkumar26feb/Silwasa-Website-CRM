import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLoader } from '../components/ui/PageLoader';
import { PromotionalPopup } from '../components/ui/PromotionalPopup';
import { AnalyticsHead } from '../components/layout/AnalyticsHead';
import { AnimationProvider } from '../components/animation/AnimationProvider';
import { getPublicSettingsServer } from '../lib/settings';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silwasa IT Solutions | AI-Powered Web, Mobile & Enterprise Software Development',
  description: 'Silwasa IT Solutions engineers scalable web applications, enterprise software, AI solutions, and high-performance digital platforms.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettingsServer();

  return (
    <html lang="en" className="dark">
      <head>
        <AnalyticsHead />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AnimationProvider initialSettings={settings?.animation}>
          <Suspense fallback={null}>
            <PageLoader />
          </Suspense>
          {children}
          <PromotionalPopup />
        </AnimationProvider>
      </body>
    </html>
  );
}
