import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Lock, Check, Circle, Zap, ShieldAlert, Loader2, Play } from 'lucide-react';
import { groupService, GroupDetailsResponse } from '../services/groupService';
import { academicService } from '../services/academicService';
import { SubjectResponse, LessonResponse } from '../types/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function GroupExercises() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [group, setGroup] = useState<GroupDetailsResponse | null>(null);
  const [subject, setSubject] = useState<SubjectResponse | null>(null);
  const [lessons, setLessons] = useState<(LessonResponse & { status: string, xp: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    const loadGroupExercises = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const groupData = await groupService.getGroupDetails(id);
        setGroup(groupData);

        const subjectsData = await academicService.getSubjects();
        const matchingSubject = subjectsData.find(s => s.name.toLowerCase() === groupData.subject.toLowerCase());

        if (matchingSubject) {
          setSubject(matchingSubject);

          const lessonsData = await academicService.getLessons(matchingSubject.id);

          const levelsData = lessonsData.slice(0, 3).map((lesson, idx) => {
            const isActive = groupData.activeLevelId === lesson.id;
            return {
              ...lesson,
              status: isActive ? 'active' : 'inactive',
              xp: lesson.difficultyLevel * 25
            };
          });

          setLessons(levelsData);
        }
      } catch (error: any) {
        toast.error('Error al cargar ejercicios del grupo');
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupExercises();
  }, [id]);

  const handleActivateLevel = async (lessonId: string) => {
    if (!id || isActivating) return;
    setIsActivating(true);
    try {
      await groupService.setActiveLevel(id, lessonId);
      toast.success('Nivel activado para todo el grupo');

      setLessons(prev => prev.map(l => ({
        ...l,
        status: l.id === lessonId ? 'active' : 'inactive'
      })));
      setGroup(prev => prev ? { ...prev, activeLevelId: lessonId } : null);
    } catch (error) {
      toast.error('Error al activar el nivel');
    } finally {
      setIsActivating(false);
    }
  };

  const isCreator = group && user && group.members.find(m => m.userId === user.id)?.role === 'CREATOR';

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group || !subject) {
    return (
      <div className="size-full flex flex-col items-center justify-center bg-background gap-4 px-6 text-center">
        <ShieldAlert className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          No se encontró la materia "{group?.subject}" para asignar niveles a este grupo.
        </p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline font-medium">
          Volver
        </button>
      </div>
    );
  }

  const activeLevel = lessons.find(l => l.status === 'active');

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(`/groups/${id}`)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Ejercicios del Grupo</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className={`bg-gradient-to-r ${group.color} rounded-[20px] p-6 mb-8 shadow-lg`}>
          <h2 className="text-white text-2xl font-bold mb-2">{group.name}</h2>
          <p className="text-white/80 text-sm mb-4">
            Materia: <span className="font-semibold text-white">{subject.name}</span>
          </p>

          {!isCreator && activeLevel && (
            <div className="bg-white/20 p-4 rounded-xl mt-4">
              <p className="text-white font-medium mb-1">Nivel Activo</p>
              <p className="text-white/90 text-sm mb-3">{activeLevel.title}</p>
              <button
                onClick={() => navigate(`/lesson/${activeLevel.id}`)}
                className="w-full bg-white text-primary py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <Play className="w-4 h-4" />
                Jugar Nivel
              </button>
            </div>
          )}

          {!isCreator && !activeLevel && (
            <div className="bg-white/20 p-4 rounded-xl mt-4 text-center text-white/90">
              <p>El creador del grupo aún no ha activado ningún nivel.</p>
            </div>
          )}
        </div>

        {isCreator && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-1">Gestión de Niveles</h3>
            <p className="text-sm text-muted-foreground">Activa el nivel que quieres que el grupo juegue.</p>
          </div>
        )}

        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            const isActive = lesson.status === 'active';

            return (
              <div
                key={lesson.id}
                className={`bg-card rounded-[20px] p-5 border-2 transition-all ${isActive ? 'border-primary shadow-md shadow-primary/20' : 'border-border'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-bold mb-1 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4 text-warning" />
                      <span className="font-medium text-warning">+{lesson.xp} XP</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex gap-3">
                  {isCreator && (
                    <button
                      onClick={() => handleActivateLevel(lesson.id)}
                      disabled={isActive || isActivating}
                      className={`flex-1 py-2.5 rounded-[12px] font-medium transition-colors ${isActive
                          ? 'bg-success/20 text-success cursor-default'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                    >
                      {isActive ? 'Nivel Activo' : 'Activar Nivel'}
                    </button>
                  )}

                  {(isActive || isCreator) && (
                    <button
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className={`flex-1 py-2.5 rounded-[12px] font-bold text-white transition-colors flex items-center justify-center gap-2 ${isActive ? 'bg-primary hover:bg-blue-700' : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                    >
                      <Play className="w-4 h-4" />
                      Jugar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
