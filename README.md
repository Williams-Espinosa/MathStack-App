# MathStack Frontend App

Aplicación frontend principal de **MathStack**, una plataforma de práctica y gamificación de matemáticas. Diseñada para dispositivos móviles y web, ofrece a los estudiantes un entorno interactivo para resolver ejercicios, ver lecciones, participar en desafíos y comprar en la tienda de ítems con monedas ganadas.

Construida con **React** y **Vite**, e integrada con **Capacitor** para su empaquetado como aplicación móvil nativa. La interfaz utiliza **Tailwind CSS** y componentes accesibles como **Radix UI** y **MUI**, además de notificaciones PWA y Web Push para interacción en tiempo real.

---

## 📦 Stack técnico

| Componente | Tecnología |
|---|---|
| Framework UI | React 18 |
| Bundler & Dev Server | Vite |
| Estilos & Diseño | Tailwind CSS + Framer Motion |
| Componentes UI | Radix UI, Material UI (@mui), Lucide React |
| Enrutamiento | React Router |
| Empaquetado Móvil | Capacitor (Android / iOS) |
| Autenticación externa | `@react-oauth/google` |
| PWA & Service Workers | `vite-plugin-pwa` + Web Push API |
| Gráficos y Data | Recharts |

---

## 📡 Integración con el Backend

La aplicación se comunica con el backend de MathStack (Ktor) consumiendo los endpoints expuestos bajo `/api/v1`. 

Maneja funcionalidades como:
- Registro y Login (tradicional y vía Google)
- Diagnóstico inicial y selección de materias
- Práctica y resolución de ejercicios
- Tienda de avatares y recompensas

