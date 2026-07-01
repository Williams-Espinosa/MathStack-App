import { useEffect } from 'react';

export function usePWASetup() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => { });
    }

    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest.json';
      document.head.appendChild(link);
    }

    const metas: [string, string][] = [
      ['apple-mobile-web-app-capable', 'yes'],
      ['apple-mobile-web-app-status-bar-style', 'default'],
      ['apple-mobile-web-app-title', 'MathStack'],
      ['theme-color', '#2563EB'],
    ];
    metas.forEach(([name, content]) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const m = document.createElement('meta');
        m.name = name;
        m.content = content;
        document.head.appendChild(m);
      }
    });

    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const icon = document.createElement('link');
      icon.rel = 'apple-touch-icon';
      icon.href = '/icons/icon-180.png';
      document.head.appendChild(icon);
    }
  }, []);
}
