import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Trophy, Medal, Award, User } from 'lucide-react';
import BottomNav from './BottomNav';

const leaderboardData = [
  { rank: 1, name: 'Ana García', xp: 8450, coins: 2340, lessons: 45, avatar: '👩‍🎓' },
  { rank: 2, name: 'Carlos López', xp: 7890, coins: 2100, lessons: 42, avatar: '👨‍🎓' },
  { rank: 3, name: 'María Rodríguez', xp: 7320, coins: 1980, lessons: 40, avatar: '👩‍🎓' },
  { rank: 4, name: 'Tú', xp: 1240, coins: 350, lessons: 12, avatar: '👤', isCurrentUser: true },
  { rank: 5, name: 'Pedro Martínez', xp: 980, coins: 280, lessons: 10, avatar: '👨‍🎓' },
  { rank: 6, name: 'Laura Sánchez', xp: 870, coins: 240, lessons: 9, avatar: '👩‍🎓' }
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const navigate = useNavigate();

  const getPodiumIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-warning" />;
    if (rank === 2) return <Medal className="w-7 h-7 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return null;
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Clasificación</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex gap-2 bg-muted p-1 rounded-full">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'daily' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Diaria
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'weekly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Mensual
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="flex items-end justify-center gap-4 mb-8">
          {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((user, index) => {
            const actualRank = user.rank;
            const heights = ['h-28', 'h-36', 'h-24'];
            const bgColors = ['from-gray-300 to-gray-400', 'from-warning to-yellow-500', 'from-orange-400 to-orange-500'];

            return (
              <div key={user.rank} className="flex-1 flex flex-col items-center">
                <div className="text-4xl mb-2">{user.avatar}</div>
                <p className="text-xs font-medium text-foreground mb-2 text-center truncate w-full px-1">
                  {user.name.split(' ')[0]}
                </p>
                <div className={`w-full ${heights[index]} bg-gradient-to-b ${bgColors[index]} rounded-t-[20px] flex flex-col items-center justify-start pt-3 shadow-lg`}>
                  <div className="mb-2">
                    {getPodiumIcon(actualRank)}
                  </div>
                  <p className="text-white font-bold text-lg">{user.xp}</p>
                  <p className="text-white/80 text-xs">XP</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {leaderboardData.slice(3).map((user) => (
            <div
              key={user.rank}
              className={`rounded-[20px] p-4 shadow-sm border transition-all ${
                user.isCurrentUser
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 text-center">
                  <span className="text-xl font-bold text-foreground">#{user.rank}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.lessons} lecciones</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{user.xp}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
