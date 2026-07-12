import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ArrowRight, Trophy, BookOpen, AlertTriangle, Flame, Calculator, Compass, Layers, Binary, Search, PlusCircle } from 'lucide-react';
import { academicService } from '../services/academicService';
import { LessonResponse } from '../types/api';
import { toast } from 'sonner';

export default function DiagnosticResults() {
  const navigate = useNavigate();
  const location = useLocation();

  const safeResults = Array.isArray(location.state?.results) ? location.state.results : [];

  const [lessonsBySubject, setLessonsBySubject] = useState<Record<string, LessonResponse[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const subjectsData = await academicService.getSubjects();
        const lessonsMap: Record<string, LessonResponse[]> = {};

        for (const result of safeResults) {
          const subject = subjectsData.find(s => s.name.toLowerCase() === result.subject.toLowerCase() || s.id === result.subjectId);
          if (subject) {
            const subjectLessons = await academicService.getLessons(subject.id);
            lessonsMap[result.subject] = subjectLessons;
          } else {
            lessonsMap[result.subject] = [];
          }
        }
        setLessonsBySubject(lessonsMap);
      } catch (error) {
        console.error("Error loading lessons for route:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [safeResults]);

  const sortedResults = [...safeResults].sort((a, b) => a.score - b.score);
  const totalScore = safeResults.reduce((acc: number, curr: any) => acc + curr.score, 0);
  const averageScore = safeResults.length > 0 ? Math.round(totalScore / safeResults.length) : 0;
  const priorityAreas = safeResults.filter((r: any) => r.score <= 50).length;

  const totalLessonsInRoute = Object.values(lessonsBySubject).reduce((acc, curr) => acc + curr.length, 0);

  const getSubjectIcon = (subjectName: string, className: string = "w-5 h-5") => {
    const name = subjectName.toLowerCase();
    if (name.includes('aritmética')) return <Binary className={`text-slate-400 ${className}`} />;
    if (name.includes('álgebra')) return <Layers className={`text-blue-400 ${className}`} />;
    if (name.includes('geometría')) return <Compass className={`text-emerald-400 ${className}`} />;
    if (name.includes('trigonometría')) return <Search className={`text-purple-400 ${className}`} />;
    if (name.includes('cálculo')) return <Calculator className={`text-orange-400 ${className}`} />;
    return <BookOpen className={`text-slate-400 ${className}`} />;
  };

  const getStatusConfig = (score: number) => {
    if (score < 50) return {
      text: 'Necesita reforzamiento',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      barColor: 'bg-red-500',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />
    };
    if (score < 80) return {
      text: 'Puede mejorar',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      barColor: 'bg-yellow-500',
      icon: <Flame className="w-4 h-4 text-yellow-500" />
    };
    return {
      text: 'Dominado',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      barColor: 'bg-green-500',
      icon: <PlusCircle className="w-4 h-4 text-green-500" />
    };
  };

  return (
    <div className="size-full flex flex-col bg-[#F8FAFC] overflow-auto pb-32">
      <div className="bg-[#2563EB] px-6 pt-10 pb-12 rounded-b-[40px] shadow-lg flex flex-col items-center relative">
        <div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-1">
          Diagnóstico completado
        </h1>
        <p className="text-white/80 text-sm text-center mb-8">
          Tu ruta personalizada está lista
        </p>

        <div className="flex w-full justify-between items-center px-2">
          <div className="flex flex-col items-center flex-1">
            <span className="text-3xl font-bold text-white">{averageScore}%</span>
            <span className="text-white/80 text-xs text-center leading-tight mt-1">Promedio<br />general</span>
          </div>
          <div className="w-[1px] h-12 bg-white/20"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-3xl font-bold text-white">{isLoading ? '-' : totalLessonsInRoute}</span>
            <span className="text-white/80 text-xs text-center leading-tight mt-1">Lecciones en tu<br />ruta</span>
          </div>
          <div className="w-[1px] h-12 bg-white/20"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-3xl font-bold text-white">{priorityAreas}</span>
            <span className="text-white/80 text-xs text-center leading-tight mt-1">Áreas<br />prioritarias</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-8 -mt-6 relative z-10">

        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-1">Tu perfil de habilidades</h3>
          <p className="text-sm text-slate-500 mb-4">Basado en tus {safeResults.length * 3} respuestas</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={safeResults} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Puntuación" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 text-lg mb-4">Resultados por tema</h3>
          <div className="space-y-4">
            {sortedResults.map((item: any, index) => {
              const config = getStatusConfig(item.score);
              return (
                <div key={index} className={`${config.bgColor} rounded-[20px] p-5 shadow-sm border border-black/5`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getSubjectIcon(item.subject)}
                      <h4 className="font-bold text-slate-800">{item.subject}</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {config.icon}
                      <span className={`text-xs font-semibold ${config.textColor}`}>
                        {config.text}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${config.barColor}`}
                        style={{ width: `${Math.max(item.score, 5)}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-slate-800 text-sm w-8 text-right">{item.score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-lg">Tu ruta personalizada</h3>
          </div>

          <div className="space-y-4">
            {sortedResults.map((item: any, index) => {
              const subjectLessons = lessonsBySubject[item.subject] || [];
              if (subjectLessons.length === 0 && !isLoading) return null;

              const displayLessons = subjectLessons.slice(0, 3);
              const remainingLessons = subjectLessons.length - displayLessons.length;

              return (
                <div key={index} className="bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="bg-red-50/50 px-5 py-4 flex items-center justify-between border-b border-red-100/50">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium text-sm">#{index + 1}</span>
                      {getSubjectIcon(item.subject)}
                      <h4 className="font-bold text-slate-800">{item.subject}</h4>
                    </div>
                    {isLoading ? (
                      <span className="px-3 py-1 rounded-full bg-white text-slate-400 text-xs font-bold border border-slate-200">
                        ...
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-white text-red-500 text-xs font-bold border border-red-100">
                        {subjectLessons.length} lecciones
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {displayLessons.map((lesson, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-slate-400 mt-1">•</span>
                            {lesson.title}
                          </li>
                        ))}
                        {remainingLessons > 0 && (
                          <li className="text-sm text-slate-400 pl-3 mt-3">
                            +{remainingLessons} lecciones más...
                          </li>
                        )}
                        {subjectLessons.length === 0 && (
                          <li className="text-sm text-slate-400 italic">No hay lecciones disponibles aún.</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-50">
        <div className="bg-[#059669] rounded-[20px] p-5 shadow-xl flex flex-col gap-3">
          <div>
            <h3 className="text-white font-bold text-lg">¡Ruta generada!</h3>
            <p className="text-emerald-50 text-sm mt-1 leading-tight">
              {isLoading ? 'Calculando lecciones...' : `${totalLessonsInRoute} lecciones organizadas según tus áreas de mayor necesidad. ¡Empecemos!`}
            </p>
          </div>
          <button
            onClick={() => navigate('/learning-path')}
            className="w-full bg-white text-[#059669] py-3.5 rounded-[16px] font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
          >
            Comenzar mi ruta
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
