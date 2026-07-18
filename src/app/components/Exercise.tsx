import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { academicService } from '../services/academicService';
import { practiceService } from '../services/practiceService';
import { useAuth } from '../contexts/AuthContext';
import { ExerciseResponse, ExerciseContentJSON, StepByStepData } from '../types/api';
import StepByStepModal from './StepByStepModal';

export default function Exercise() {
  const navigate = useNavigate();
  const { id: lessonId } = useParams();
  const { user, refreshProfile } = useAuth();

  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showStepByStep, setShowStepByStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      if (!lessonId) return;
      try {
        const data = await academicService.getExercises(lessonId);
        setExercises(data);
      } catch (error) {
        toast.error('Error al cargar los ejercicios');
      } finally {
        setIsLoading(false);
      }
    };
    loadExercises();
  }, [lessonId]);

  const currentExercise = exercises[currentIndex];
  
  let parsedContent: ExerciseContentJSON | null = null;
  let displayContent = currentExercise?.content || '';
  let correctAns = currentExercise?.conceptTested || '7'; // legacy
  
  if (currentExercise?.content) {
    try {
      parsedContent = JSON.parse(currentExercise.content);
      displayContent = parsedContent?.question || displayContent;
      if (parsedContent?.correctAnswer) {
        correctAns = parsedContent.correctAnswer;
      }
    } catch (e) {
      // not json, leave as is
    }
  }

  const correctAnswer = correctAns;
  const xpReward = 50;

  const handleCheck = async () => {
    if (!currentExercise || !user) return;

    setIsSubmitting(true);
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.toLowerCase();

    try {
      await practiceService.registerAttempt(user.id, currentExercise.id, isCorrect);
      setShowResult(isCorrect ? 'correct' : 'incorrect');
      if (isCorrect) {
        refreshProfile();
      }
    } catch (error) {
      toast.error('Error al registrar intento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setShowResult(null);
      setShowHint(false);
    } else {
      toast.success('¡Has completado todos los ejercicios!');
      navigate('/learning-path');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando ejercicios...</div>;
  }

  if (!exercises.length) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <p className="text-muted-foreground mb-4">No hay ejercicios para esta lección.</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline">Volver</button>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-background">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/learning-path')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-2 bg-warning/10 px-4 py-2 rounded-full">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">+{xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col">
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Ejercicio {currentIndex + 1} de {exercises.length}
            </h2>
            <p className="text-muted-foreground">
              Resuelve el siguiente ejercicio
            </p>
          </div>

          <div className="bg-card rounded-[20px] p-8 shadow-lg border border-border mb-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-mono text-foreground whitespace-pre-wrap">
                {displayContent}
              </p>
            </div>

            {parsedContent?.options && Array.isArray(parsedContent.options) ? (
              <div className="flex flex-col gap-3">
                {parsedContent.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnswer(opt)}
                    className={`px-6 py-4 rounded-[20px] text-lg font-medium transition-all ${
                      answer === opt
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                    disabled={showResult === 'correct' || isSubmitting}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xl text-foreground">x =</span>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Tu respuesta"
                  className="flex-1 px-6 py-4 bg-background border-2 border-border rounded-[20px] text-xl text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={showResult === 'correct' || isSubmitting}
                />
              </div>
            )}
          </div>

          {showHint && (
            <div className="bg-blue-50 border-l-4 border-primary rounded-[20px] p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary mb-1">Pista</p>
                  <p className="text-sm text-muted-foreground">{parsedContent?.hint || `Concepto evaluado: ${currentExercise.conceptTested}`}</p>
                </div>
              </div>
            </div>
          )}

          {showResult && (
            <div className={`rounded-[20px] p-6 mb-6 ${showResult === 'correct' ? 'bg-success/10 border-2 border-success' : 'bg-destructive/10 border-2 border-destructive'
              }`}>
              <div className="flex items-center gap-3">
                {showResult === 'correct' ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-semibold text-success text-lg">¡Correcto!</p>
                      <p className="text-sm text-muted-foreground">Has ganado {xpReward} XP</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-destructive" />
                    <div>
                      <p className="font-semibold text-destructive text-lg">Incorrecto</p>
                      <p className="text-sm text-muted-foreground">Inténtalo de nuevo</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!showHint && showResult !== 'correct' && (
            <div className={`flex gap-3 ${parsedContent?.stepByStep ? 'grid grid-cols-2' : ''}`}>
              <button
                onClick={() => setShowHint(true)}
                className="w-full bg-card hover:bg-muted border border-border text-foreground py-4 rounded-[20px] font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-5 h-5" />
                <span>Ver pista</span>
              </button>
              
              {parsedContent?.stepByStep && (
                <button
                  onClick={() => setShowStepByStep(true)}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-4 rounded-[20px] font-semibold transition-colors flex items-center justify-center gap-2 border border-blue-200"
                >
                  <span className="font-serif italic text-lg font-bold">∑</span>
                  <span>Paso a paso</span>
                </button>
              )}
            </div>
          )}

          {showResult === 'correct' ? (
            <button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg"
            >
              {currentIndex < exercises.length - 1 ? 'Siguiente ejercicio' : 'Continuar'}
            </button>
          ) : (
            <button
              onClick={handleCheck}
              disabled={!answer.trim() || isSubmitting}
              className="w-full bg-primary hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg"
            >
              {isSubmitting ? 'Comprobando...' : 'Comprobar respuesta'}
            </button>
          )}
        </div>
      </div>

      {showStepByStep && parsedContent?.stepByStep && (
        <StepByStepModal 
          data={parsedContent.stepByStep} 
          onClose={() => setShowStepByStep(false)} 
        />
      )}
    </div>
  );
}
