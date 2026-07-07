import { useEffect } from 'react';
import { toast } from 'sonner';

export function usePWASetup() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                toast('Hay una nueva versión disponible.', {
                  description: 'Actualiza para ver los últimos cambios.',
                  action: {
                    label: 'Actualizar',
                    onClick: () => window.location.reload()
                  },
                  duration: Infinity,
                });
              }
            });
          }
        });
      }).catch(() => { });
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
      icon.href = '/icons/LogoFelizSinFondo.png';
      document.head.appendChild(icon);
    }
  }, []);
}
