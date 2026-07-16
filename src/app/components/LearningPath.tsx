import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Check, Circle, Zap } from 'lucide-react';
import { academicService } from '../services/academicService';
import { practiceService } from '../services/practiceService';
import { useAuth } from '../contexts/AuthContext';
import { SubjectResponse, LessonResponse } from '../types/api';
import { toast } from 'sonner';

export default function LearningPath() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [lessons, setLessons] = useState<(LessonResponse & { status: string, xp: number })[]>([]);
  const [currentSubject, setCurrentSubject] = useState<{id: number, name: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadLearningPath = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const pathData = await practiceService.getLearningPath(user.id);
        
        setCurrentSubject({ id: pathData.subjectId, name: pathData.subjectName });
        setLessons(pathData.lessons);

      } catch (error: any) {
        toast.error(error.message || 'Error al cargar la ruta de aprendizaje');
      } finally {
        setIsLoading(false);
      }
    };

    loadLearningPath();
  }, [user]);

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <Check className="w-6 h-6 text-white" />;
    if (status === 'available') return <Circle className="w-6 h-6 text-white" />;
    return <Lock className="w-5 h-5 text-white" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-success border-success';
    if (status === 'available') return 'bg-primary border-primary';
    return 'bg-muted-foreground/50 border-muted-foreground/50';
  };

  const totalXP = lessons.reduce((acc, curr) => acc + curr.xp, 0);

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Ruta de Aprendizaje</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">
            Cargando ruta de aprendizaje...
          </div>
        ) : !currentSubject ? (
          <div className="text-center py-10 text-muted-foreground">
            No hay materias disponibles
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-primary to-blue-700 rounded-[20px] p-6 mb-8 shadow-lg">
              <h2 className="text-white text-2xl font-bold mb-2">{currentSubject.name}</h2>
              <p className="text-white/80 text-sm mb-4">{lessons.length} lecciones · {totalXP} XP total</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '14%' }}></div>
                </div>
                <span className="text-white text-sm">1/{lessons.length}</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

              <div className="space-y-6">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`relative z-10 w-16 h-16 rounded-full border-4 ${getStatusColor(lesson.status)} flex items-center justify-center shadow-lg`}>
                        {getStatusIcon(lesson.status)}
                      </div>

                      <button
                        onClick={() => lesson.status !== 'locked' && navigate(`/lesson/${lesson.id}`)}
                        disabled={lesson.status === 'locked'}
                        className={`flex-1 bg-card rounded-[20px] p-5 shadow-md border border-border hover:shadow-lg transition-all ${lesson.status === 'locked' ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <h3 className="font-semibold text-foreground mb-1">
                              Lección {index + 1}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              {lesson.title}
                            </p>
                            {lesson.subjectName && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary mb-2">
                                {lesson.subjectName}
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-warning" />
                              <span className="text-sm font-medium text-warning">
                                +{lesson.xp} XP
                              </span>
                            </div>
                          </div>
                          {lesson.status === 'completed' && (
                            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
