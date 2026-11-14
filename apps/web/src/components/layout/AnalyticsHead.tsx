'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

export function AnalyticsHead() {
  const [gaId, setGaId] = useState<string | null>(null);
  const [gtmId, setGtmId] = useState<string | null>(null);
  const [gVerification, setGVerification] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/settings/public`);
        if (res.ok) {
          const json = await res.json();
          const seo = json.data?.seo;
          if (seo?.googleAnalyticsId) setGaId(seo.googleAnalyticsId);
          if (seo?.googleTagManagerId) setGtmId(seo.googleTagManagerId);
          if (seo?.googleSearchConsoleVerification) {
            setGVerification(seo.googleSearchConsoleVerification);
          }
        }
      } catch {
        // Fallback
      }
    }
    loadAnalytics();
  }, []);

  return (
    <>
      {gVerification && (
        <meta name="google-site-verification" content={gVerification} />
      )}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
      {gtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}
    </>
  );
}
