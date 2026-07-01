import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, BarChart3, Route, Trophy, Swords } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

function ChallengesIllustration() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 shadow-2xl shadow-orange-500/40" />

      <div className="absolute inset-0 rounded-full border-4 border-white/10" />
      <div className="absolute inset-4 rounded-full border-2 border-white/10" />

      <div className="absolute top-4 right-8 w-3 h-3 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/80" />
      <div className="absolute bottom-8 left-6 w-2 h-2 bg-white rounded-full shadow-md" />
      <div className="absolute top-12 left-5 w-1.5 h-1.5 bg-orange-200 rounded-full" />

      <div className="absolute -left-6 top-10 bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2 border border-orange-100 dark:border-orange-900/40">
        <span className="text-xl">⚡</span>
        <div>
          <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Reto diario</div>
          <div className="text-[10px] text-orange-500 font-semibold">+50 XP</div>
        </div>
      </div>

      <div className="absolute -right-6 bottom-12 bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2 border border-orange-100 dark:border-orange-900/40">
        <span className="text-xl">🔥</span>
        <div>
          <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Racha</div>
          <div className="text-[10px] text-orange-500 font-semibold">7 días</div>
        </div>
      </div>

      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
        Semana 3
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2">
        <Swords className="w-20 h-20 text-white drop-shadow-lg" strokeWidth={1.5} />
      </div>

      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full px-4 py-1.5 shadow-lg flex items-center gap-2 border border-orange-100 dark:border-orange-800">
        <span className="text-sm">🏆</span>
        <div className="w-24 h-2 rounded-full bg-orange-100 dark:bg-orange-900/40 overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
        </div>
        <span className="text-[10px] font-bold text-orange-500">75%</span>
      </div>
    </div>
  );
}

function RewardsIllustration() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-2xl shadow-yellow-500/40" />
      <div className="absolute inset-0 rounded-full border-4 border-white/10" />
      <div className="absolute inset-4 rounded-full border-2 border-white/10" />

      <div className="absolute top-5 right-6 w-3 h-3 bg-white rounded-full shadow-md" />
      <div className="absolute bottom-10 left-5 w-2 h-2 bg-yellow-200 rounded-full" />

      <div className="absolute -left-5 top-12 bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2 border border-yellow-100 dark:border-yellow-900/40">
        <span className="text-xl">🪙</span>
        <div>
          <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Monedas</div>
          <div className="text-[10px] text-yellow-500 font-semibold">+120</div>
        </div>
      </div>

      <div className="absolute -right-5 bottom-14 bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2 border border-yellow-100 dark:border-yellow-900/40">
        <span className="text-xl">🔥</span>
        <div>
          <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Racha</div>
          <div className="text-[10px] text-yellow-500 font-semibold">5 días</div>
        </div>
      </div>

      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
        Nivel 12
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2">
        <Trophy className="w-20 h-20 text-white drop-shadow-lg" strokeWidth={1.5} />
      </div>

      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full px-4 py-1.5 shadow-lg flex items-center gap-2 border border-yellow-100 dark:border-yellow-800">
        <span className="text-sm">⭐</span>
        <div className="w-24 h-2 rounded-full bg-yellow-100 dark:bg-yellow-900/40 overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" />
        </div>
        <span className="text-[10px] font-bold text-yellow-600">1840 XP</span>
      </div>
    </div>
  );
}

type SlideType = 'icon' | 'challenges' | 'rewards';

const slides: { type: SlideType; icon?: React.ElementType; color?: string; title: string; description: string }[] = [
  {
    type: 'icon',
    icon: BarChart3,
    title: 'Identifica tus áreas de mejora',
    description: 'MathStack detecta tus fortalezas y debilidades mediante una evaluación diagnóstica.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    type: 'icon',
    icon: Route,
    title: 'Ruta personalizada',
    description: 'Obtén ejercicios y lecciones adaptadas a tu nivel.',
    color: 'from-green-500 to-green-600'
  },
  {
    type: 'challenges',
    title: 'Retos y Desafíos',
    description: 'Supera retos diarios y semanales, compite con amigos y demuestra quién domina las matemáticas.',
  },
  {
    type: 'rewards',
    title: 'Aprende y gana recompensas',
    description: 'Mantén tu racha y desbloquea recompensas exclusivas.',
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
      navigate('/login');
    }
  };

  const handleSkip = () => {
    onComplete();
    navigate('/login');
  };

  const slide = slides[currentSlide];

  return (
    <div className="size-full flex flex-col bg-background">
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Saltar
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: 60 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 * direction }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-col items-center w-full"
          >
            {/* Ilustración */}
            <div className="mb-12 flex items-center justify-center" style={{ minHeight: '280px' }}>
              {slide.type === 'challenges' && <ChallengesIllustration />}
              {slide.type === 'rewards' && <RewardsIllustration />}
              {slide.type === 'icon' && slide.icon && (
                <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-2xl`}>
                  <slide.icon className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-center mb-6 text-foreground">
              {slide.title}
            </h2>

            <p className="text-center text-muted-foreground text-lg leading-relaxed max-w-sm">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-8 pb-12">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted'
                }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-[20px] flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <span className="font-medium text-lg">
            {currentSlide < slides.length - 1 ? 'Siguiente' : 'Comenzar'}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
