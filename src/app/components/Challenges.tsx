import { useState, useEffect } from 'react';
import { socialService } from '../services/socialService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Trophy, Clock, Coins, Zap, Users, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from './BottomNav';

interface Challenge {
  id: string | number;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  timeLeft: string;
  reward: { coins: number; xp: number };
  progress: number;
  participants: number;
  joined: boolean;
}

const INITIAL: Challenge[] = [];

const DIFFICULTY_STYLES = {
  Fácil: { pill: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
  Medio: { pill: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-500' },
  Difícil: { pill: 'bg-red-100 text-red-700', bar: 'bg-red-500' },
};

type Toast = { id: number; title: string; joined: boolean };

export default function Challenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await socialService.getGlobalChallenges();
        const formatted: Challenge[] = data.map(c => {
          let diffStr = c.difficulty || 'Fácil';
          const lower = diffStr.toLowerCase();
          if (lower === 'easy' || lower.includes('fácil')) diffStr = 'Fácil';
          else if (lower === 'medium' || lower.includes('medio')) diffStr = 'Medio';
          else if (lower === 'hard' || lower.includes('dif')) diffStr = 'Difícil';
          else diffStr = 'Fácil';

          return {
            id: c.id,
            title: c.title,
            description: c.description,
            difficulty: diffStr as any,
            timeLeft: c.endDate ? new Date(c.endDate).toLocaleDateString() : 'Sin límite',
            reward: { coins: c.rewardCoins || 0, xp: c.rewardXP || 0 },
            progress: 0,
            participants: c.participants || 0,
            joined: false
          };
        });
        setChallenges(formatted);
      } catch (err) {
        toast.error('Error al cargar los retos');
      }
    };
    fetchChallenges();
  }, []);

  const showToast = (title: string, joined: boolean) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, joined }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const handleJoin = (challenge: Challenge) => {
    if (loading) return;
    setLoading(challenge.id);
    setTimeout(() => {
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === challenge.id
            ? {
              ...c,
              joined: !c.joined,
              participants: c.joined ? c.participants - 1 : c.participants + 1,
              progress: c.joined ? 0 : c.progress,
            }
            : c
        )
      );
      showToast(challenge.title, !challenge.joined);
      setLoading(null);
    }, 700);
  };

  const joined = challenges.filter((c) => c.joined);
  const available = challenges.filter((c) => !c.joined);

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-semibold text-foreground">Retos Semanales</h1>
        </div>
      </div>

      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-72">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-white text-sm font-medium ${t.joined ? 'bg-primary' : 'bg-muted-foreground'
                }`}
            >
              {t.joined ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <X className="w-4 h-4 flex-shrink-0" />}
              <span>{t.joined ? `Te uniste a "${t.title}"` : `Abandonaste "${t.title}"`}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        <div className="bg-gradient-to-r from-warning to-yellow-500 rounded-[20px] p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">Retos Activos</h2>
            <p className="text-white/80 text-sm">
              {joined.length} unido{joined.length !== 1 ? 's' : ''} · {available.length} disponible{available.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {joined.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Mis retos</h2>
            <div className="space-y-4">
              {joined.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  loading={loading === challenge.id}
                  onAction={() => handleJoin(challenge)}
                  onContinue={() => navigate(`/challenges/${challenge.id}/exercise`)}
                />
              ))}
            </div>
          </section>
        )}
        {available.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Disponibles</h2>
            <div className="space-y-4">
              {available.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  loading={loading === challenge.id}
                  onAction={() => handleJoin(challenge)}
                  onContinue={() => navigate(`/challenges/${challenge.id}/exercise`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function ChallengeCard({
  challenge,
  loading,
  onAction,
  onContinue,
}: {
  challenge: Challenge;
  loading: boolean;
  onAction: () => void;
  onContinue: () => void;
}) {
  const styles = DIFFICULTY_STYLES[challenge.difficulty] || DIFFICULTY_STYLES['Fácil'];

  return (
    <motion.div
      layout
      className={`bg-card rounded-[20px] p-5 shadow-md border transition-shadow hover:shadow-lg ${challenge.joined ? 'border-primary/30' : 'border-border'
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <div className="flex items-center gap-2 mb-1">
            {challenge.joined && (
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
            )}
            <h3 className="font-semibold text-foreground leading-tight">{challenge.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${styles.pill}`}>
          {challenge.difficulty}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground">{challenge.timeLeft}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-warning flex-shrink-0" />
          <span className="text-xs font-semibold text-warning">{challenge.reward.coins}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-xs font-semibold text-primary">{challenge.reward.xp} XP</span>
        </div>
      </div>

      {/* Progress bar — only if joined */}
      {challenge.joined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Progreso</span>
            <span className="text-xs font-semibold text-foreground">{challenge.progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${styles.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${challenge.progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{challenge.participants} participantes</span>
        </div>

        {challenge.joined ? (
          <button
            onClick={onContinue}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-primary hover:bg-blue-700 text-white shadow-md shadow-primary/30 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Continuar
          </button>
        ) : (
          <button
            onClick={onAction}
            disabled={loading}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-muted hover:bg-border text-foreground disabled:opacity-60 flex items-center gap-2 transition-all"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : 'Unirse'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
