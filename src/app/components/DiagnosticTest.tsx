import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { academicService } from '../services/academicService';
import { practiceService } from '../services/practiceService';
import { useAuth } from '../contexts/AuthContext';
import { ExerciseResponse, SubjectResponse, DiagnosticQuestionResponse } from '../types/api';
import { Brain, BookOpen, TrendingUp, Sigma, Calculator, Compass, Layers, Binary, Search } from 'lucide-react';
import { isMathEquivalent } from '../utils/mathUtils';

interface DiagnosticQuestion {
  subjectId: number;
  subjectName: string;
  exerciseId: string;
  displayContent: string;
  correctAnswer: string;
  options?: string[];
}

export default function DiagnosticTest() {
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{ subjectId: number, exerciseId: string, isCorrect: boolean }[]>([]);
  const [isIntroScreen, setIsIntroScreen] = useState(true);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);

  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth.user;

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) return;
        
        const [exercises, subjectsData] = await Promise.all([
          practiceService.generateDiagnosticQuiz(user.id),
          academicService.getSubjects()
        ]);
        
        setSubjects(subjectsData);

        if (exercises.length === 0) {
          setQuestions([]);
          return;
        }

        const loadedQuestions = exercises.map((randomExercise: DiagnosticQuestionResponse) => {
          let displayContent = randomExercise.content;
          let correctAnswer = randomExercise.conceptTested || '';
          let options: string[] | undefined = undefined;

          try {
            const parsed = JSON.parse(randomExercise.content);
            displayContent = parsed.question || displayContent;
            if (parsed.correctAnswer) {
              correctAnswer = parsed.correctAnswer;
            }
            if (parsed.options && Array.isArray(parsed.options)) {
              options = parsed.options;
            }
          } catch (e) {
          }

          return {
            subjectId: randomExercise.subjectId,
            subjectName: randomExercise.subjectName,
            exerciseId: randomExercise.id,
            displayContent,
            correctAnswer,
            options
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
  }, [navigate, user]);

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
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-bold text-xl mb-2">No hay preguntas disponibles</p>
          <p className="text-muted-foreground text-sm mb-6">Por el momento no tenemos ejercicios cargados en la base de datos para generar tu diagnóstico.</p>
          <button onClick={() => navigate('/dashboard')} className="bg-primary text-white py-3 px-8 rounded-full font-medium shadow-md hover:bg-blue-700 transition-colors">
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = async () => {
    const isCorrect = isMathEquivalent(answer, question.correctAnswer);

    const newResults = [...results, { subjectId: question.subjectId, exerciseId: question.exerciseId, isCorrect }];
    setResults(newResults);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
    } else {
      setIsSubmitting(true);
      try {
        if (user) {
          const finalResults = await practiceService.submitDiagnostic(user.id, newResults.map(r => ({ exerciseId: r.exerciseId, isCorrect: r.isCorrect })));
          await auth.refreshProfile();
          navigate('/diagnostic-results', { state: { results: finalResults } });
        } else {
          navigate('/diagnostic-results');
        }
      } catch (error) {
        toast.error('Error al guardar los resultados');
        navigate('/diagnostic-results');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getSubjectStyle = (subjectName: string, index: number) => {
    const name = subjectName.toLowerCase();
    if (name.includes('aritmética')) return { bg: 'bg-[#2563EB]', icon: <Calculator className="w-5 h-5 text-white" /> };
    if (name.includes('álgebra')) return { bg: 'bg-[#9333EA]', icon: <Sigma className="w-5 h-5 text-white" /> };
    if (name.includes('geometría')) return { bg: 'bg-[#16A34A]', icon: <Compass className="w-5 h-5 text-white" /> };
    if (name.includes('trigo')) return { bg: 'bg-[#EA580C]', icon: <TrendingUp className="w-5 h-5 text-white" /> };
    if (name.includes('cálculo')) return { bg: 'bg-[#DC2626]', icon: <Brain className="w-5 h-5 text-white" /> };
    
    const colors = ['bg-[#2563EB]', 'bg-[#9333EA]', 'bg-[#16A34A]', 'bg-[#EA580C]', 'bg-[#DC2626]'];
    return { bg: colors[index % colors.length], icon: <BookOpen className="w-5 h-5 text-white" /> };
  };

  if (isIntroScreen) {
    const subjectNames = subjects.map(s => s.name).join(', ');
    return (
      <div className="size-full flex flex-col bg-[#F8FAFC] overflow-auto pb-8">
        <div className="bg-[#2563EB] px-6 pt-10 pb-12 rounded-b-[40px] shadow-lg flex flex-col items-center">
          <div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Evaluación de Diagnóstico
          </h1>
          <p className="text-white/80 text-sm text-center">
            Descubramos tu nivel para crear tu ruta personalizada
          </p>
        </div>

        <div className="px-6 py-6 space-y-6 -mt-6 relative z-10 flex-1 flex flex-col">
          <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-2">
            <div className="flex items-start gap-4 p-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{questions.length} preguntas • {subjects.length} temas</h3>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{subjectNames || "Aritmética, Álgebra, Geometría..."}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Dificultad progresiva</h3>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">3 preguntas por tema: básico, intermedio y avanzado</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Sigma className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Ruta personalizada</h3>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">Al terminar generamos tu plan de estudio ideal</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {subjects.map((subject, idx) => {
              const style = getSubjectStyle(subject.name, idx);
              return (
                <div key={subject.id} className={`${style.bg} rounded-[16px] w-[70px] h-[75px] flex flex-col items-center justify-center gap-1.5 shadow-sm`}>
                  {style.icon}
                  <span className="text-[10px] font-bold text-white text-center leading-none px-1">
                    {subject.name.substring(0, 7)}{subject.name.length > 7 ? '.' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-[20px] p-5 mt-auto">
            <p className="text-blue-800 text-sm text-center font-medium leading-relaxed">
              No te preocupes si no sabes todas las respuestas — eso es exactamente lo que queremos detectar para ayudarte mejor.
            </p>
          </div>

          <button
            onClick={() => setIsIntroScreen(false)}
            className="w-full bg-[#2563EB] text-white py-4 rounded-[16px] font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            Comenzar evaluación
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

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

            {question.options ? (
              <div className="flex flex-col gap-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnswer(opt)}
                    className={`px-6 py-4 rounded-[20px] text-lg font-medium transition-all ${
                      answer === opt
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
            )}
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
