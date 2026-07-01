import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: '¿Cuál es el resultado de 2x + 5 = 13?',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    difficulty: 'Fácil'
  },
  {
    id: 2,
    question: 'Resuelve: (3 + 5) × 2 - 4',
    options: ['12', '14', '16', '18'],
    difficulty: 'Medio'
  },
  {
    id: 3,
    question: '¿Cuál es la derivada de f(x) = x²?',
    options: ['x', '2x', 'x²', '2x²'],
    difficulty: 'Difícil'
  }
];

export default function DiagnosticTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const navigate = useNavigate();

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      navigate('/diagnostic-results');
    }
  };

  const difficultyColors = {
    'Fácil': 'bg-success text-success-foreground',
    'Medio': 'bg-warning text-warning-foreground',
    'Difícil': 'bg-destructive text-destructive-foreground'
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
          <span className={`px-3 py-1 rounded-full text-xs ${difficultyColors[question.difficulty as keyof typeof difficultyColors]}`}>
            {question.difficulty}
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
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full p-5 rounded-[20px] border-2 text-left transition-all ${
                  selectedAnswer === index
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-foreground">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="w-full bg-primary hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg flex items-center justify-center gap-2 mt-8"
        >
          <span>{currentQuestion < questions.length - 1 ? 'Siguiente' : 'Ver resultados'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
