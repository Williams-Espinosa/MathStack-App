import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Zap, Coins, Trophy, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  hint: string;
  xp: number;
}

const CHALLENGE_DATA: Record<string, { title: string; color: string; coins: number; questions: Question[] }> = {
  '1': {
    title: 'Maratón de Álgebra',
    color: 'from-blue-500 to-blue-700',
    coins: 100,
    questions: [
      { id: 1, text: 'Resuelve: 3x - 7 = 14', options: ['x = 6', 'x = 7', 'x = 5', 'x = 8'], correct: 1, hint: 'Suma 7 a ambos lados, luego divide entre 3', xp: 50 },
      { id: 2, text: 'Simplifica: 2(x + 3) - x', options: ['x + 6', 'x + 3', '2x + 6', 'x - 6'], correct: 0, hint: 'Distribuye el 2 primero y luego combina términos semejantes', xp: 60 },
      { id: 3, text: '¿Cuál es el valor de x en: x/4 = 3?', options: ['x = 12', 'x = 7', 'x = 3', 'x = 0.75'], correct: 0, hint: 'Multiplica ambos lados por 4', xp: 55 },
      { id: 4, text: 'Factoriza: x² - 9', options: ['(x+3)(x-3)', '(x-3)²', '(x+9)(x-1)', 'No factoriza'], correct: 0, hint: 'Es una diferencia de cuadrados: a² - b² = (a+b)(a-b)', xp: 70 },
      { id: 5, text: 'Si 2x + y = 10 e y = 4, ¿cuánto vale x?', options: ['x = 3', 'x = 7', 'x = 4', 'x = 2'], correct: 0, hint: 'Sustituye y = 4 en la primera ecuación', xp: 65 },
    ],
  },
  '2': {
    title: 'Desafío de Cálculo',
    color: 'from-red-500 to-red-700',
    coins: 250,
    questions: [
      { id: 1, text: "¿Cuál es la derivada de f(x) = x²?", options: ['f\'(x) = 2x', 'f\'(x) = x', 'f\'(x) = 2', 'f\'(x) = x²'], correct: 0, hint: 'Usa la regla de la potencia: d/dx(xⁿ) = n·xⁿ⁻¹', xp: 80 },
      { id: 2, text: "Deriva: g(x) = 3x³ - 2x + 1", options: ["g'(x) = 9x² - 2", "g'(x) = 3x² - 2", "g'(x) = 9x² - 2x", "g'(x) = 6x - 2"], correct: 0, hint: 'Aplica la regla de la potencia a cada término', xp: 90 },
      { id: 3, text: "¿Cuál es la derivada de sin(x)?", options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct: 0, hint: 'Es una derivada trigonométrica fundamental', xp: 85 },
      { id: 4, text: "Deriva: h(x) = eˣ + ln(x)", options: ['eˣ + 1/x', 'eˣ + ln(x)', 'eˣ - 1/x', '1/x'], correct: 0, hint: 'La derivada de eˣ es eˣ y la de ln(x) es 1/x', xp: 95 },
      { id: 5, text: '¿En qué punto f(x) = x² - 4x tiene mínimo?', options: ['x = 2', 'x = 0', 'x = 4', 'x = -2'], correct: 0, hint: "Iguala la derivada a 0 y resuelve", xp: 100 },
    ],
  },
  '3': {
    title: 'Sprint de Aritmética',
    color: 'from-yellow-500 to-orange-500',
    coins: 150,
    questions: [
      { id: 1, text: '¿Cuánto es 15% de 240?', options: ['36', '24', '48', '30'], correct: 0, hint: 'Multiplica 240 × 0.15', xp: 40 },
      { id: 2, text: 'Calcula el MCM de 12 y 18', options: ['36', '6', '72', '24'], correct: 0, hint: 'El MCM es el mínimo múltiplo común', xp: 45 },
      { id: 3, text: '¿Cuánto es 2³ × 3²?', options: ['72', '36', '48', '64'], correct: 0, hint: '2³ = 8 y 3² = 9', xp: 42 },
      { id: 4, text: 'Si un artículo cuesta $80 con 20% de descuento, ¿cuál era el precio original?', options: ['$100', '$96', '$88', '$104'], correct: 0, hint: '80 = precio × (1 - 0.20)', xp: 55 },
      { id: 5, text: '¿Cuál es el MCD de 48 y 36?', options: ['12', '6', '24', '9'], correct: 0, hint: 'Busca el mayor divisor común usando descomposición factorial', xp: 50 },
    ],
  },
  '4': {
    title: 'Reto de Geometría',
    color: 'from-purple-500 to-purple-700',
    coins: 180,
    questions: [
      { id: 1, text: '¿Cuánto mide el área de un círculo con radio 5?', options: ['25π', '10π', '5π', '50π'], correct: 0, hint: 'A = π·r²', xp: 55 },
      { id: 2, text: 'Un triángulo tiene base 8 y altura 6. ¿Cuál es su área?', options: ['24', '48', '12', '36'], correct: 0, hint: 'A = (base × altura) / 2', xp: 50 },
      { id: 3, text: 'En un triángulo rectángulo con catetos 3 y 4, ¿cuánto mide la hipotenusa?', options: ['5', '7', '6', '√7'], correct: 0, hint: 'Usa el teorema de Pitágoras: c² = a² + b²', xp: 60 },
      { id: 4, text: '¿Cuántos grados tiene la suma de ángulos internos de un pentágono?', options: ['540°', '360°', '720°', '480°'], correct: 0, hint: 'Fórmula: (n-2) × 180°', xp: 65 },
      { id: 5, text: '¿Cuánto mide el perímetro de un cuadrado con área 49?', options: ['28', '14', '56', '21'], correct: 0, hint: 'Primero encuentra el lado: lado = √49', xp: 58 },
    ],
  },
  '5': {
    title: 'Estadística Express',
    color: 'from-green-500 to-green-700',
    coins: 120,
    questions: [
      { id: 1, text: 'Calcula la media de: 4, 8, 6, 10, 2', options: ['6', '8', '5', '7'], correct: 0, hint: 'Suma todos y divide entre la cantidad de datos', xp: 45 },
      { id: 2, text: '¿Cuál es la mediana de: 3, 7, 1, 9, 5?', options: ['5', '3', '7', '9'], correct: 0, hint: 'Ordena los datos y busca el valor del centro', xp: 48 },
      { id: 3, text: '¿Qué probabilidad hay de sacar un 6 en un dado?', options: ['1/6', '1/3', '1/2', '1/4'], correct: 0, hint: 'Un dado tiene 6 caras, solo una es el 6', xp: 42 },
      { id: 4, text: '¿Cuál es la moda de: 2, 4, 4, 6, 8, 4, 2?', options: ['4', '2', '6', '8'], correct: 0, hint: 'La moda es el valor que más se repite', xp: 44 },
      { id: 5, text: 'Si lanzas una moneda 2 veces, ¿cuánto es P(2 caras)?', options: ['1/4', '1/2', '1/3', '3/4'], correct: 0, hint: 'Cada lanzamiento es independiente: 1/2 × 1/2', xp: 50 },
    ],
  },
};

const DEFAULT = {
  title: 'Reto',
  color: 'from-primary to-blue-700',
  coins: 100,
  questions: CHALLENGE_DATA['1'].questions,
};

export default function ChallengeExercise() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const data = (id && CHALLENGE_DATA[id]) ? CHALLENGE_DATA[id] : DEFAULT;

  const { user, gamificationStats, refreshProfile } = useAuth();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [finished, setFinished] = useState(false);

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
          await refreshProfile();
        } catch (error) {
          console.error('Failed to update stats:', error);
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
          <button
            onClick={() => { setCurrent(0); setSelected(null); setConfirmed(false); setShowHint(false); setScore(0); setTotalXp(0); setFinished(false); }}
            className="w-full bg-card border border-border text-foreground py-4 rounded-[20px] font-medium transition-colors"
          >
            Reintentar reto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-background">
      {/* Header */}
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

      {/* Question */}
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
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      confirmed && i === question.correct ? 'bg-green-500 text-white' :
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

            {/* Hint */}
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

            {/* Feedback */}
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-[16px] p-4 mb-4 flex items-center gap-3 ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
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

        {/* Actions */}
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
