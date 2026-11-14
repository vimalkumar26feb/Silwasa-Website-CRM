'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When route changes, quickly finish progress bar and hide
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target &&
        target.href &&
        target.href.startsWith(window.location.origin) &&
        !target.href.includes('#') &&
        target.target !== '_blank'
      ) {
        const nextUrl = new URL(target.href);
        if (nextUrl.pathname !== window.location.pathname || nextUrl.search !== window.location.search) {
          setLoading(true);
          setProgress(30);
          setTimeout(() => setProgress(70), 150);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page route transition loader"
      className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#663399] via-[#D9F45F] to-[#663399] shadow-[0_0_10px_#D9F45F] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.3s 0.1s ease-in' : 'width 0.3s ease-out',
        }}
      />
    </div>
  );
}
