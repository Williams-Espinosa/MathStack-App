import { useState } from 'react';
import { X, Download, Smartphone, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onInstall: () => void;
  isIOS?: boolean;
}

export default function InstallBanner({ onInstall, isIOS }: Props) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50"
        >
          <div className="bg-primary rounded-[20px] p-4 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Instala MathStack</p>
              {isIOS ? (
                <p className="text-white/75 text-xs">Toca <Share className="inline w-3 h-3 mx-1" /> y selecciona "Añadir a inicio"</p>
              ) : (
                <p className="text-white/75 text-xs">Accede rápido desde tu pantalla de inicio</p>
              )}
            </div>
            {!isIOS && (
              <button
                onClick={onInstall}
                className="bg-white text-primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 hover:bg-blue-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Instalar
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-white/60 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
