import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Zap, Coins, Trophy, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { socialService } from '../services/socialService';

interface Question {
  id: string | number;
  text: string;
  options: string[];
  correct: number;
  hint: string;
  xp: number;
}

interface ChallengeData {
  title: string;
  color: string;
  coins: number;
  questions: Question[];
}

export default function ChallengeExercise() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { user, gamificationStats, refreshProfile } = useAuth();

  const [data, setData] = useState<ChallengeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadChallenge = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [globalChallenges, exercises] = await Promise.all([
          socialService.getGlobalChallenges(),
          socialService.getChallengeExercises(id)
        ]);

        const challengeInfo = globalChallenges.find((c: any) => c.id === id);

        if (!exercises || exercises.length === 0) {
          setError('No hay ejercicios disponibles para este reto.');
          setIsLoading(false);
          return;
        }

        const questions = exercises.map((ex: any, index: number) => {
          let text = ex.content;
          let correctAnswerStr = ex.conceptTested || '';
          let options = ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
          let correct = 0;
          let hint = 'Analiza bien el problema.';

          try {
            const parsed = typeof ex.content === 'object' ? ex.content : JSON.parse(ex.content);
            text = parsed.question || text;
            if (parsed.correctAnswer) {
              correctAnswerStr = parsed.correctAnswer;
            }
            if (parsed.options && Array.isArray(parsed.options)) {
              options = parsed.options;
            }
            if (parsed.hint) {
              hint = parsed.hint;
            }
          } catch (e) {
          }

          if (!options.includes(correctAnswerStr)) {
            options[0] = correctAnswerStr;
          }

          correct = options.findIndex((opt: string) => opt === correctAnswerStr);
          if (correct === -1) correct = 0;

          return {
            id: ex.id,
            text,
            options,
            correct,
            hint,
            xp: 50
          };
        });

        const colorMap: Record<string, string> = {
          'beginner': 'from-green-500 to-green-700',
          'intermediate': 'from-blue-500 to-blue-700',
          'advanced': 'from-red-500 to-red-700'
        };

        const difficulty = challengeInfo?.difficulty?.toLowerCase() || 'intermediate';
        let color = colorMap[difficulty] || 'from-primary to-blue-700';

        setData({
          title: challengeInfo?.title || 'Reto de Práctica',
          color,
          coins: challengeInfo?.rewardCoins || 100,
          questions
        });

      } catch (err) {
        setError('Error al cargar los ejercicios del reto.');
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [id]);

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Cargando reto...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="size-full flex flex-col items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground text-lg mb-4">{error || 'Reto no encontrado'}</p>
        <button onClick={() => navigate('/challenges')} className="text-primary hover:underline font-medium">
          Volver a retos
        </button>
      </div>
    );
  }

  const question = data.questions[current];
  const isCorrect = selected === question.correct;
  const progress = ((current) / data.questions.length) * 100;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === question.correct) {
      setScore((s) => s + 1);
      setTotalXp((x) => x + question.xp);
    }
  };

  const handleNext = async () => {
    if (current + 1 >= data.questions.length) {
      setFinished(true);
      if (user && gamificationStats) {
        try {
          const earnedCoins = score === data.questions.length ? data.coins : Math.floor(data.coins * score / data.questions.length);
          await userService.updateGamificationStats(user.id, {
            xpPoints: gamificationStats.xpPoints + totalXp,
            coins: gamificationStats.coins + earnedCoins
          });

          if (id) {
            await socialService.submitChallengeResult(id, score, 0); // timeTakenSeconds = 0 for now
          }

          await refreshProfile();

          const completedIds = JSON.parse(localStorage.getItem('completed_challenges') || '[]');
          if (id && !completedIds.includes(id)) {
            completedIds.push(id);
            localStorage.setItem('completed_challenges', JSON.stringify(completedIds));
          }
        } catch (err) {
          console.error('Failed to update stats or submit result:', err);
        }
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
      setShowHint(false);
    }
  };

  if (finished) {
    const perfect = score === data.questions.length;
    return (
      <div className="size-full flex flex-col bg-background">
        <div className={`bg-gradient-to-br ${data.color} pt-16 pb-12 px-8 rounded-b-[40px] shadow-xl flex flex-col items-center`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {perfect ? '¡Perfecto!' : score >= data.questions.length / 2 ? '¡Bien hecho!' : '¡Sigue practicando!'}
          </h1>
          <p className="text-white/80 text-sm">{data.title}</p>
        </div>

        <div className="flex-1 px-6 py-8 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-[20px] p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{score}/{data.questions.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Correctas</p>
            </div>
            <div className="bg-card border border-border rounded-[20px] p-4 text-center">
              <p className="text-2xl font-bold text-primary">{totalXp}</p>
              <p className="text-xs text-muted-foreground mt-1">XP ganado</p>
            </div>
            <div className="bg-card border border-border rounded-[20px] p-4 text-center">
              <p className="text-2xl font-bold text-warning">{score === data.questions.length ? data.coins : Math.floor(data.coins * score / data.questions.length)}</p>
              <p className="text-xs text-muted-foreground mt-1">Monedas</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[20px] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Tu progreso</span>
              <span className="text-sm font-semibold text-foreground">{Math.round(score / data.questions.length * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${score / data.questions.length * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/challenges')}
            className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-[20px] font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            Volver a retos <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-background">
      <div className={`bg-gradient-to-r ${data.color} pt-12 pb-6 px-6`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/challenges')} className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">{totalXp} XP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-semibold">{data.coins}</span>
            </div>
          </div>
        </div>

        <p className="text-white/80 text-xs mb-1">{data.title}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold text-sm">Pregunta {current + 1} de {data.questions.length}</span>
          <span className="text-white/80 text-xs">{Math.round(progress)}% completado</span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            <div className="bg-card border border-border rounded-[20px] p-6 mb-5 shadow-sm">
              <p className="text-lg font-semibold text-foreground text-center leading-snug">{question.text}</p>
            </div>

            <div className="space-y-3 mb-5">
              {question.options.map((opt, i) => {
                let style = 'border-border bg-card text-foreground';
                if (confirmed) {
                  if (i === question.correct) style = 'border-green-500 bg-green-50 text-green-700';
                  else if (i === selected) style = 'border-red-400 bg-red-50 text-red-600';
                  else style = 'border-border bg-card text-muted-foreground opacity-50';
                } else if (selected === i) {
                  style = 'border-primary bg-blue-50 text-primary';
                }

                return (
                  <button
                    key={i}
                    disabled={confirmed}
                    onClick={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-[16px] border-2 text-left font-medium transition-all ${style}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${confirmed && i === question.correct ? 'bg-green-500 text-white' :
                        confirmed && i === selected && !isCorrect ? 'bg-red-400 text-white' :
                          selected === i && !confirmed ? 'bg-primary text-white' :
                            'bg-muted text-muted-foreground'
                      }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showHint && !confirmed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-[16px] p-4 mb-4 flex items-start gap-3"
              >
                <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">{question.hint}</p>
              </motion.div>
            )}

            {confirmed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-[16px] p-4 mb-4 flex items-center gap-3 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
              >
                {isCorrect
                  ? <><CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" /><div><p className="font-semibold text-green-700">¡Correcto!</p><p className="text-xs text-green-600">+{question.xp} XP ganado</p></div></>
                  : <><XCircle className="w-6 h-6 text-red-500 flex-shrink-0" /><div><p className="font-semibold text-red-600">Incorrecto</p><p className="text-xs text-red-500">La respuesta era: {question.options[question.correct]}</p></div></>
                }
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="space-y-3 mt-auto pt-2">
          {!confirmed && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="w-full bg-card border border-border text-muted-foreground py-3 rounded-[16px] text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
            >
              <Lightbulb className="w-4 h-4" /> Ver pista
            </button>
          )}

          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="w-full bg-primary hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-[20px] font-semibold transition-colors shadow-lg"
            >
              Comprobar
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-[20px] font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              {current + 1 >= data.questions.length ? 'Ver resultados' : 'Siguiente'} <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
