import React from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { getPublicSettingsServer } from '../../lib/settings';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettingsServer();
  const initialLogo = settings?.general?.logoUrl || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#151414] text-white">
      <Header initialLogo={initialLogo} />
      <main className="flex-1">
        {children}
      </main>
      <Footer initialLogo={initialLogo} />
    </div>
  );
}
