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
  const [results, setResults] = useState<{ subject: string, score: number, subjectId: number }[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const subjectsData = await academicService.getSubjects();

        const questionsPromises = subjectsData.map(async (subject) => {
          try {
            const lessons = await academicService.getLessons(subject.id);
            if (lessons.length === 0) return null;

            const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
            const exercises = await academicService.getExercises(randomLesson.id);

            if (exercises.length === 0) return null;

            const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];

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
              subjectId: subject.id,
              subjectName: subject.name,
              exerciseId: randomExercise.id,
              displayContent,
              correctAnswer
            };
          } catch (e) {
            return null;
          }
        });

        const loadedQuestions = (await Promise.all(questionsPromises)).filter(Boolean) as DiagnosticQuestion[];

        const shuffled = [...loadedQuestions].sort(() => Math.random() - 0.5);

        setQuestions(shuffled);
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
    const score = isCorrect ? 100 : 0;

    const newResults = [...results, { subjectId: question.subjectId, subject: question.subjectName, score }];
    setResults(newResults);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
    } else {
      // Finish
      setIsSubmitting(true);
      try {
        if (user) {
          const promises = newResults.map(r =>
            practiceService.submitDiagnostic(user.id, r.subjectId, r.score)
          );
          await Promise.all(promises);
        }
        navigate('/diagnostic-results', { state: { results: newResults } });
      } catch (error) {
        toast.error('Error al guardar los resultados');
        navigate('/diagnostic-results', { state: { results: newResults } });
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
