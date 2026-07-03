import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (window.confirm('Hay una nueva versión de MathStack disponible. ¿Deseas actualizar ahora?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    }).catch(err => console.error('Service worker registration failed', err));
  });
}

createRoot(document.getElementById("root")!).render(<App />);
