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
        <div className="mb-8 bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="10" y="60" width="25" height="50" rx="4" fill="#FACC15" />
            <rect x="40" y="40" width="25" height="70" rx="4" fill="#22C55E" />
            <rect x="70" y="20" width="25" height="90" rx="4" fill="#60A5FA" />
            <path d="M 10 60 L 52.5 50 L 82.5 30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="60" r="4" fill="white" />
            <circle cx="52.5" cy="50" r="4" fill="white" />
            <circle cx="82.5" cy="30" r="4" fill="white" />
          </svg>
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
