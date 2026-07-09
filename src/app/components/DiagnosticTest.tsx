import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { academicService } from '../services/academicService';
import { practiceService } from '../services/practiceService';
import { useAuth } from '../contexts/AuthContext';
import { ExerciseResponse, SubjectResponse } from '../types/api';

interface DiagnosticQuestion {
  subjectId: number;
  subjectName: string;
  exerciseId: string;
  displayContent: string;
  correctAnswer: string;
}

export default function DiagnosticTest() {
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{ subjectId: number, exerciseId: string, isCorrect: boolean }[]>([]);

  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth.user;

  useEffect(() => {
    const loadData = async () => {
      try {
        const exercises = await practiceService.generateDiagnosticQuiz();

        if (exercises.length === 0) {
          setQuestions([]);
          return;
        }

        const loadedQuestions = exercises.map(randomExercise => {
          let displayContent = randomExercise.content;
          let correctAnswer = randomExercise.conceptTested || '';

          try {
            const parsed = JSON.parse(randomExercise.content);
            displayContent = parsed.question || displayContent;
            if (parsed.correctAnswer) {
              correctAnswer = parsed.correctAnswer;
            }
          } catch (e) {
          }

          return {
            subjectId: 0,
            subjectName: 'Diagnóstico',
            exerciseId: randomExercise.id,
            displayContent,
            correctAnswer
          };
        });

        setQuestions(loadedQuestions);
      } catch (error) {
        toast.error('Error al cargar la prueba diagnóstica');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="size-full flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Cargando prueba diagnóstica...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="size-full flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-muted-foreground text-lg mb-4">No hay preguntas disponibles.</p>
          <button onClick={() => navigate('/dashboard')} className="text-primary hover:underline font-medium">
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = async () => {
    const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

    const newResults = [...results, { subjectId: question.subjectId, exerciseId: question.exerciseId, isCorrect }];
    setResults(newResults);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
    } else {
      setIsSubmitting(true);
      try {
        if (user) {
          await practiceService.submitDiagnostic(user.id, newResults.map(r => ({ exerciseId: r.exerciseId, isCorrect: r.isCorrect })));
          await useAuth().refreshProfile();
        }
        navigate('/diagnostic-results');
      } catch (error) {
        toast.error('Error al guardar los resultados');
        navigate('/diagnostic-results');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="size-full flex flex-col bg-background">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <span className="text-sm text-muted-foreground">
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
            {question.subjectName}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col">
        <div className="flex-1">
          <div className="bg-card rounded-[20px] p-8 shadow-lg border border-border mb-8">
            <div className="text-center mb-6">
              <p className="text-2xl font-mono text-foreground whitespace-pre-wrap">
                {question.displayContent}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl text-foreground">x =</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Tu respuesta"
                className="flex-1 px-6 py-4 bg-background border-2 border-border rounded-[20px] text-xl text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
                autoFocus
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!answer.trim() || isSubmitting}
          className="w-full bg-primary hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg flex items-center justify-center gap-2 mt-8"
        >
          <span>{isSubmitting ? 'Guardando...' : (currentQuestion < questions.length - 1 ? 'Siguiente' : 'Ver resultados')}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
