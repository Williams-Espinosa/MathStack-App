import { motion } from 'motion/react';

export default function SplashScreen() {
  return (
    <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-primary via-blue-600 to-blue-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-white/30 text-4xl">∑</div>
        <div className="absolute top-32 right-16 text-white/30 text-3xl">∫</div>
        <div className="absolute bottom-40 left-20 text-white/30 text-5xl">π</div>
        <div className="absolute bottom-20 right-10 text-white/30 text-4xl">√</div>
        <div className="absolute top-1/2 left-1/4 text-white/30 text-3xl">∞</div>
        <div className="absolute top-1/3 right-1/3 text-white/30 text-4xl">α</div>
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center z-10"
      >
        <div className="mb-8 bg-white/10 p-3 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
          <img src="/icons/LogoFelizSinFondo.png" alt="MathStack Logo" className="w-32 h-32 object-contain scale-125" />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl font-bold text-white mb-4"
        >
          MathStack
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white/90 text-lg"
        >
          Aprende matemáticas a tu ritmo
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-12"
      >
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </motion.div>
    </div>
  );
}
