import { useNavigate } from 'react-router';
import { ArrowLeft, Settings, Zap, Coins, BookOpen, Flame, Trophy, Award } from 'lucide-react';
import BottomNav from './BottomNav';

const achievements: any[] = [];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-gradient-to-br from-primary to-blue-700 pt-8 pb-16 rounded-b-[40px] shadow-xl">
        <div className="px-6">
          <div className="flex items-center justify-end mb-8">
            <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center backdrop-blur-sm mb-4">
              <span className="text-5xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Estudiante</h2>
            <p className="text-white/80 mb-4">estudiante@email.com</p>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="text-white font-semibold">Nivel 1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8">
        <div className="bg-card rounded-[20px] p-5 shadow-lg border border-border mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 mx-auto mb-2">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">XP Total</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 mx-auto mb-2">
                <Coins className="w-6 h-6 text-warning" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Monedas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mx-auto mb-2">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Racha</p>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progreso al nivel 2</span>
              <span className="text-sm font-medium text-foreground">0%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">100 XP restantes</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Estadísticas</h3>
            <button
              onClick={() => navigate('/streak')}
              className="text-primary text-sm hover:underline"
            >
              Ver racha
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-[20px] p-4 shadow-sm border border-border">
              <BookOpen className="w-8 h-8 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Lecciones completadas</p>
            </div>
            <div className="bg-card rounded-[20px] p-4 shadow-sm border border-border">
              <Award className="w-8 h-8 text-success mb-2" />
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Logros desbloqueados</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Logros</h3>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`aspect-square rounded-[20px] p-4 flex flex-col items-center justify-center shadow-sm border transition-all ${achievement.unlocked
                      ? 'bg-card border-border'
                      : 'bg-muted/50 border-muted grayscale opacity-50'
                    }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <p className="text-xs text-center font-medium text-foreground">
                    {achievement.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-[20px] p-6 text-center shadow-sm border border-border">
              <span className="text-4xl block mb-2">🏆</span>
              <p className="text-sm font-medium text-foreground mb-1">Aún no tienes insignias</p>
              <p className="text-xs text-muted-foreground">¡Sigue practicando para desbloquear tu primer logro!</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
