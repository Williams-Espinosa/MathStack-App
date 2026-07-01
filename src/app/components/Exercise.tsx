import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Zap } from 'lucide-react';

export default function Exercise() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);

  const question = {
    text: 'Resuelve la ecuación: 3x - 7 = 14',
    hint: 'Primero suma 7 a ambos lados, luego divide por 3',
    correctAnswer: '7',
    xpReward: 75
  };

  const handleCheck = () => {
    if (answer.trim() === question.correctAnswer) {
      setShowResult('correct');
    } else {
      setShowResult('incorrect');
    }
  };

  return (
    <div className="size-full flex flex-col bg-background">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/learning-path')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-2 bg-warning/10 px-4 py-2 rounded-full">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">+{question.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col">
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Ejercicio 1
            </h2>
            <p className="text-muted-foreground">
              Resuelve la siguiente ecuación
            </p>
          </div>

          <div className="bg-card rounded-[20px] p-8 shadow-lg border border-border mb-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-mono text-foreground">
                {question.text}
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
                disabled={showResult === 'correct'}
              />
            </div>
          </div>

          {showHint && (
            <div className="bg-blue-50 border-l-4 border-primary rounded-[20px] p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary mb-1">Pista</p>
                  <p className="text-sm text-muted-foreground">{question.hint}</p>
                </div>
              </div>
            </div>
          )}

          {showResult && (
            <div className={`rounded-[20px] p-6 mb-6 ${
              showResult === 'correct' ? 'bg-success/10 border-2 border-success' : 'bg-destructive/10 border-2 border-destructive'
            }`}>
              <div className="flex items-center gap-3">
                {showResult === 'correct' ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-semibold text-success text-lg">¡Correcto!</p>
                      <p className="text-sm text-muted-foreground">Has ganado {question.xpReward} XP</p>
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
            <button
              onClick={() => setShowHint(true)}
              className="w-full bg-card hover:bg-muted border border-border text-foreground py-4 rounded-[20px] font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Ver pista</span>
            </button>
          )}

          {showResult === 'correct' ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleCheck}
              disabled={!answer.trim()}
              className="w-full bg-primary hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg"
            >
              Comprobar respuesta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
