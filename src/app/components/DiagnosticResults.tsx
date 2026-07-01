import { useNavigate } from 'react-router';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';
import BottomNav from './BottomNav';

const results = [
  { subject: 'Álgebra', score: 65 },
  { subject: 'Aritmética', score: 45 },
  { subject: 'Cálculo', score: 30 },
  { subject: 'Geometría', score: 55 },
  { subject: 'Trigonometría', score: 40 }
];

export default function DiagnosticResults() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-gradient-to-br from-primary to-blue-700 px-6 pt-8 pb-12 rounded-b-[40px] shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Resultados del Diagnóstico
        </h1>
        <p className="text-white/80 text-center">
          Hemos analizado tu nivel
        </p>
      </div>

      <div className="flex-1 px-6 py-8 space-y-6">
        <div className="bg-card rounded-[20px] p-6 shadow-lg border border-border">
          <h3 className="font-semibold text-foreground mb-4 text-center">
            Tu perfil de habilidades
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={results}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar name="Puntuación" dataKey="score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Áreas a mejorar</h3>
          {results
            .sort((a, b) => a.score - b.score)
            .slice(0, 3)
            .map((item, index) => (
              <div key={index} className="bg-card rounded-[20px] p-5 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{item.subject}</h4>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    item.score < 40 ? 'bg-destructive/10 text-destructive' :
                    item.score < 60 ? 'bg-warning/10 text-warning-foreground' :
                    'bg-success/10 text-success'
                  }`}>
                    {item.score}%
                  </span>
                </div>
                <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      item.score < 40 ? 'bg-destructive' :
                      item.score < 60 ? 'bg-warning' :
                      'bg-success'
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>

        <div className="bg-gradient-to-r from-success to-green-600 rounded-[20px] p-6 shadow-lg">
          <h3 className="text-white font-semibold text-lg mb-2">
            Ruta de aprendizaje generada
          </h3>
          <p className="text-white/90 text-sm mb-4">
            Hemos creado un plan personalizado con 27 lecciones para mejorar tus habilidades
          </p>
          <button
            onClick={() => navigate('/learning-path')}
            className="w-full bg-white text-success py-3 rounded-[20px] font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            <span>Comenzar mi ruta</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
