import { useState, useEffect } from 'react';

export default function CookieWall() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mathstack_cookies_accepted');
    if (!consent) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('mathstack_cookies_accepted', 'true');
    setShowModal(false);
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/85 flex justify-center items-center z-[99999] backdrop-blur-[5px]">
      <div className="bg-white p-8 rounded-xl max-w-lg w-[90%] text-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] font-sans">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Uso de Cookies 🍪</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Para poder utilizar <strong>MathStack</strong>, es necesario que aceptes el uso de cookies
          para gestionar tu sesión y optimizar tu experiencia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleAccept}
            className="bg-[#2563eb] hover:bg-blue-700 text-white border-none py-3 px-6 rounded-xl cursor-pointer font-bold transition-colors shadow-lg"
          >
            Aceptar y Continuar
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white border-none py-3 px-6 rounded-xl cursor-pointer font-bold transition-colors shadow-lg"
          >
            Rechazar y Salir
          </button>
        </div>
      </div>
    </div>
  );
}
