'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

export function AnalyticsHead() {
  const [gaId, setGaId] = useState<string | null>(null);
  const [gtmId, setGtmId] = useState<string | null>(null);
  const [gVerification, setGVerification] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  // Apply cached favicon immediately on mount to prevent any delay
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('silwasa_favicon_url');
      if (cached) {
        setFaviconUrl(cached);
        const iconLinks = document.querySelectorAll("link[rel*='icon']");
        if (iconLinks.length > 0) {
          iconLinks.forEach((el) => el.setAttribute('href', cached));
        } else {
          const link = document.createElement('link');
          link.rel = 'icon';
          link.href = cached;
          document.head.appendChild(link);
        }
      }
    }
  }, []);

  useEffect(() => {
    async function loadPublicSettings() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/settings/public`);
        if (res.ok) {
          const json = await res.json();
          const seo = json.data?.seo;
          const fav =
            json.data?.general?.faviconUrl ||
            json.data?.branding?.faviconUrl ||
            null;

          if (fav) {
            setFaviconUrl(fav);
            if (typeof window !== 'undefined') {
              localStorage.setItem('silwasa_favicon_url', fav);
            }
            // Dynamically override any existing favicon link elements in document head
            const iconLinks = document.querySelectorAll("link[rel*='icon']");
            if (iconLinks.length > 0) {
              iconLinks.forEach((el) => el.setAttribute('href', fav));
            } else {
              const link = document.createElement('link');
              link.rel = 'icon';
              link.href = fav;
              document.head.appendChild(link);
            }
          } else {
            setFaviconUrl(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('silwasa_favicon_url');
            }
          }

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
    loadPublicSettings();
  }, []);

  return (
    <>
      {faviconUrl && (
        <>
          <link rel="icon" href={faviconUrl} />
          <link rel="shortcut icon" href={faviconUrl} />
          <link rel="apple-touch-icon" href={faviconUrl} />
        </>
      )}
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
            'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}
    </>
  );
}
