import { useNavigate } from 'react-router';
import { ArrowLeft, Flame, Trophy, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

const calendar = [
  { day: 'L', active: true },
  { day: 'M', active: true },
  { day: 'X', active: true },
  { day: 'J', active: true },
  { day: 'V', active: true },
  { day: 'S', active: true },
  { day: 'D', active: true }
];

const heatmapData = Array.from({ length: 12 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    active: Math.random() > 0.3,
    intensity: Math.floor(Math.random() * 4)
  }))
);

export default function Streak() {
  const navigate = useNavigate();
  const currentStreak = 7;
  const bestStreak = 15;

  return (
    <div className="size-full flex flex-col bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Tu Racha</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative mb-6"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-2xl">
              <Flame className="w-20 h-20 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-warning flex items-center justify-center shadow-lg"
            >
              <span className="text-xl font-bold text-white">{currentStreak}</span>
            </motion.div>
          </motion.div>

          <h2 className="text-4xl font-bold text-foreground mb-2">
            {currentStreak} días
          </h2>
          <p className="text-muted-foreground text-center max-w-xs">
            ¡Increíble! Llevas una semana completa aprendiendo sin parar
          </p>
        </div>

        <div className="bg-card rounded-[20px] p-6 shadow-lg border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Esta semana</h3>
            </div>
            <span className="text-sm text-success font-medium">7/7 días</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendar.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.active ? 'bg-success' : 'bg-muted'
                }`}>
                  {item.active && <Flame className="w-5 h-5 text-white" />}
                </div>
                <span className="text-xs text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-[20px] p-6 shadow-lg border border-border mb-6">
          <h3 className="font-semibold text-foreground mb-4">Historial de actividad</h3>
          <div className="overflow-x-auto">
            <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}>
              {heatmapData.map((week, weekIndex) =>
                week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${
                      day.active
                        ? day.intensity === 0 ? 'bg-success/20' :
                          day.intensity === 1 ? 'bg-success/40' :
                          day.intensity === 2 ? 'bg-success/70' :
                          'bg-success'
                        : 'bg-muted'
                    }`}
                    title={`Día ${weekIndex * 7 + dayIndex + 1}`}
                  />
                ))
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Menos</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted"></div>
              <div className="w-3 h-3 rounded-sm bg-success/20"></div>
              <div className="w-3 h-3 rounded-sm bg-success/40"></div>
              <div className="w-3 h-3 rounded-sm bg-success/70"></div>
              <div className="w-3 h-3 rounded-sm bg-success"></div>
            </div>
            <span className="text-xs text-muted-foreground">Más</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-warning to-yellow-500 rounded-[20px] p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Récord personal</p>
              <p className="text-white text-2xl font-bold">{bestStreak} días</p>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            ¡Sigue así y pronto superarás tu mejor marca!
          </p>
        </div>
      </div>

    </div>
  );
}
