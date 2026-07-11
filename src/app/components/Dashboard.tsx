import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Flame, Zap, Coins, BookOpen, ChevronRight, Award, User } from 'lucide-react';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { academicService } from '../services/academicService';
import { practiceService } from '../services/practiceService';
import { storeService } from '../services/storeService';
import { SubjectResponse } from '../types/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, gamificationStats } = useAuth();

  const [subjects, setSubjects] = useState<(SubjectResponse & { progress: number, lessons: number, total: number, color: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAvatarUrl, setActiveAvatarUrl] = useState<string>('');
  const hasUnreadNotifications = false;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const subjectsData = await academicService.getSubjects();

        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
        const subjectsWithProgress = subjectsData.map((sub, idx) => ({
          ...sub,
          progress: 0,
          lessons: 0,
          total: 10,
          color: colors[idx % colors.length]
        }));

        setSubjects(subjectsWithProgress);

        if (user) {
          const [items, inventory] = await Promise.all([
            storeService.getItems(),
            storeService.getInventory(user.id)
          ]);
          
          const equipped = inventory.find(inv => inv.isEquipped);
          if (equipped) {
            const item = items.find(i => i.id === equipped.itemId);
            if (item) {
              setActiveAvatarUrl(item.assetUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  useEffect(() => {
    if (gamificationStats && !isLoading) {
      const lastDiagnostic = gamificationStats.lastDiagnosticDate;
      const today = new Date();
      if (!lastDiagnostic) {
        navigate('/diagnostic');
      } else {
        const diagnosticDate = new Date(lastDiagnostic);
        const diffTime = Math.abs(today.getTime() - diagnosticDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 10) {
          toast('¡Es hora de evaluar tu progreso!', {
            description: 'Han pasado más de 10 días desde tu última prueba.',
          });
          navigate('/diagnostic');
        }
      }
    }
  }, [gamificationStats, isLoading, navigate]);

  const streak = gamificationStats?.currentStreak || 0;
  const xp = gamificationStats?.xpPoints || 0;
  const coins = gamificationStats?.coins || 0;

  return (
    <div className="size-full flex flex-col bg-background overflow-hidden">
      <div className="flex-1 overflow-auto pb-28">
        <div className="bg-gradient-to-br from-primary to-blue-700 px-6 pt-8 pb-12 rounded-b-[40px] shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                {activeAvatarUrl && (activeAvatarUrl.startsWith('http') || activeAvatarUrl.startsWith('/')) ? (
                  <img src={activeAvatarUrl} alt="Avatar" className="w-full h-full object-contain p-1" />
                ) : (
                  activeAvatarUrl ? <span className="text-2xl">{activeAvatarUrl}</span> : <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <p className="text-white/80 text-sm">Hola,</p>
                <h2 className="text-white text-xl font-semibold">{user?.username || 'Estudiante'}</h2>
              </div>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Bell className="w-6 h-6 text-white" />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full"></span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-4 border border-white/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 mb-2">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white">{streak}</p>
              <p className="text-white/70 text-xs">Racha</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-4 border border-white/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white">{xp}</p>
              <p className="text-white/70 text-xs">XP</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-4 border border-white/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20 mb-2">
                <Coins className="w-5 h-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-white">{coins}</p>
              <p className="text-white/70 text-xs">Monedas</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <button
            onClick={() => navigate('/learning-path')}
            className="w-full bg-gradient-to-r from-success to-green-600 rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg">Continuar aprendiendo</h3>
                  <p className="text-white text-sm">Lección sugerida · 5 min</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </button>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Tu progreso</h3>
              <button
                onClick={() => navigate('/learning-path')}
                className="text-primary text-sm hover:underline"
              >
                Ver todo
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">Cargando progreso...</div>
            ) : (
              <div className="space-y-3">
                {subjects.map((subject, index) => (
                  <div key={index} className="bg-card rounded-[20px] p-5 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{subject.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {subject.lessons}/{subject.total} lecciones
                      </span>
                    </div>
                    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${subject.color} rounded-full transition-all duration-500`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{subject.progress}% completado</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/challenges')}
            className="w-full bg-gradient-to-br from-warning via-yellow-400 to-orange-400 rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg">Reto Semanal</h3>
                  <p className="text-white text-sm">Completa 10 ejercicios · 3 días restantes</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
