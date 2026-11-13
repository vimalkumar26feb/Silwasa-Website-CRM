import type { Metadata } from 'next';
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
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
