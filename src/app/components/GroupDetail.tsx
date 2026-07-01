import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Users, Trophy, Medal, Crown, Flame, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';

const groupsData = {
  '1': {
    id: 1,
    name: 'Matemáticas Avanzadas',
    members: 24,
    subject: 'Cálculo',
    level: 'Avanzado',
    activeChallenges: 3,
    color: 'from-purple-500 to-purple-600',
    totalXP: 45600,
    members_list: [
      { rank: 1, name: 'Ana Torres', level: 48, xp: 3200, streak: 21, badge: 'gold', completedLessons: 45 },
      { rank: 2, name: 'Carlos Méndez', level: 45, xp: 2950, streak: 18, badge: 'silver', completedLessons: 42 },
      { rank: 3, name: 'Laura Jiménez', level: 43, xp: 2800, streak: 25, badge: 'bronze', completedLessons: 40 },
      { rank: 4, name: 'Pedro Sánchez', level: 42, xp: 2650, streak: 15, badge: null, completedLessons: 38 },
      { rank: 5, name: 'Estudiante', level: 40, xp: 2500, streak: 7, badge: null, completedLessons: 35 },
      { rank: 6, name: 'María López', level: 38, xp: 2300, streak: 12, badge: null, completedLessons: 33 },
      { rank: 7, name: 'José Ramírez', level: 36, xp: 2100, streak: 9, badge: null, completedLessons: 30 },
      { rank: 8, name: 'Carmen Silva', level: 35, xp: 1950, streak: 14, badge: null, completedLessons: 28 }
    ]
  },
  '2': {
    id: 2,
    name: 'Álgebra para Todos',
    members: 45,
    subject: 'Álgebra',
    level: 'Intermedio',
    activeChallenges: 5,
    color: 'from-blue-500 to-blue-600',
    totalXP: 38200,
    members_list: [
      { rank: 1, name: 'Roberto Díaz', level: 38, xp: 2100, streak: 28, badge: 'gold', completedLessons: 35 },
      { rank: 2, name: 'Elena Vargas', level: 36, xp: 1980, streak: 22, badge: 'silver', completedLessons: 32 },
      { rank: 3, name: 'Miguel Ángel', level: 35, xp: 1850, streak: 19, badge: 'bronze', completedLessons: 30 },
      { rank: 4, name: 'Sofía Ruiz', level: 33, xp: 1720, streak: 16, badge: null, completedLessons: 28 },
      { rank: 5, name: 'Estudiante', level: 32, xp: 1650, streak: 7, badge: null, completedLessons: 26 }
    ]
  },
  '3': {
    id: 3,
    name: 'Aritmética Básica',
    members: 67,
    subject: 'Aritmética',
    level: 'Principiante',
    activeChallenges: 2,
    color: 'from-green-500 to-green-600',
    totalXP: 52400,
    members_list: [
      { rank: 1, name: 'Lucía Fernández', level: 25, xp: 1400, streak: 35, badge: 'gold', completedLessons: 22 },
      { rank: 2, name: 'Diego Castro', level: 24, xp: 1320, streak: 29, badge: 'silver', completedLessons: 20 },
      { rank: 3, name: 'Valentina Ortiz', level: 23, xp: 1250, streak: 24, badge: 'bronze', completedLessons: 19 },
      { rank: 4, name: 'Estudiante', level: 22, xp: 1180, streak: 7, badge: null, completedLessons: 18 },
      { rank: 5, name: 'Gabriel Moreno', level: 21, xp: 1100, streak: 15, badge: null, completedLessons: 17 }
    ]
  }
};

const globalRankings = [
  { rank: 1, name: 'María González', level: 45, xp: 12400, streak: 28, badge: 'gold' },
  { rank: 2, name: 'Carlos Ramírez', level: 42, xp: 11800, streak: 21, badge: 'silver' },
  { rank: 3, name: 'Ana Martínez', level: 40, xp: 10950, streak: 35, badge: 'bronze' },
  { rank: 4, name: 'Luis Fernández', level: 38, xp: 9800, streak: 14, badge: null },
  { rank: 5, name: 'Estudiante', level: 35, xp: 9240, streak: 7, badge: null },
  { rank: 6, name: 'Laura Silva', level: 33, xp: 8650, streak: 19, badge: null },
  { rank: 7, name: 'Pedro Jiménez', level: 31, xp: 8100, streak: 12, badge: null },
  { rank: 8, name: 'Sofia Torres', level: 30, xp: 7890, streak: 8, badge: null }
];

export default function GroupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rankingTab, setRankingTab] = useState<'group' | 'global'>('group');

  const group = groupsData[id as keyof typeof groupsData];

  if (!group) {
    return <div>Grupo no encontrado</div>;
  }

  const getBadgeColor = (badge: string | null) => {
    if (badge === 'gold') return 'text-warning';
    if (badge === 'silver') return 'text-gray-400';
    if (badge === 'bronze') return 'text-orange-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/groups')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Ranking del Grupo</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setRankingTab('group')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              rankingTab === 'group'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            Ranking Grupo
          </button>
          <button
            onClick={() => setRankingTab('global')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              rankingTab === 'global'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            Ranking Global
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        {rankingTab === 'group' ? (
          <>
            <div className={`bg-gradient-to-r ${group.color} rounded-[20px] p-6 mb-6 shadow-lg`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">{group.name}</h2>
                  <p className="text-white text-sm">{group.subject} · {group.level}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-3 border border-white/20">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 mb-2">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xl font-bold text-white">{group.members}</p>
                  <p className="text-white/80 text-xs">Miembros</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-3 border border-white/20">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 mb-2">
                    <Trophy className="w-4 h-4 text-warning" />
                  </div>
                  <p className="text-xl font-bold text-white">{group.activeChallenges}</p>
                  <p className="text-white/80 text-xs">Retos</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-3 border border-white/20">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 mb-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-xl font-bold text-white">{group.totalXP.toLocaleString()}</p>
                  <p className="text-white/80 text-xs">XP Total</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">Miembros del Grupo</h3>
              <p className="text-sm text-muted-foreground">Ranking por XP acumulado</p>
            </div>

            <div className="space-y-3">
              {group.members_list.map((member) => (
                <div
                  key={member.rank}
                  className={`bg-card rounded-[20px] p-5 shadow-md border hover:shadow-lg transition-shadow ${
                    member.name === 'Estudiante' ? 'border-primary border-2' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      member.rank === 1 ? 'bg-warning/20' :
                      member.rank === 2 ? 'bg-gray-200 dark:bg-gray-700' :
                      member.rank === 3 ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-muted'
                    }`}>
                      {member.rank === 1 ? (
                        <Crown className="w-6 h-6 text-warning" />
                      ) : (
                        <span className={getBadgeColor(member.badge)}>#{member.rank}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${member.name === 'Estudiante' ? 'text-primary' : 'text-foreground'}`}>
                          {member.name}
                          {member.name === 'Estudiante' && <span className="text-xs ml-1">(Tú)</span>}
                        </h3>
                        {member.badge && (
                          <Medal className={`w-4 h-4 ${getBadgeColor(member.badge)}`} />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Nivel {member.level}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {member.streak} días
                        </span>
                        <span>·</span>
                        <span>{member.completedLessons} lecciones</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">{member.xp.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-r from-warning via-yellow-400 to-orange-400 rounded-[20px] p-6 mb-6 shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">Ranking Global</h2>
                  <p className="text-white text-sm">Todos los jugadores</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">Top Jugadores</h3>
              <p className="text-sm text-muted-foreground">Clasificación general por XP</p>
            </div>

            <div className="space-y-3">
              {globalRankings.map((player) => (
                <div
                  key={player.rank}
                  className={`bg-card rounded-[20px] p-5 shadow-md border hover:shadow-lg transition-shadow ${
                    player.name === 'Estudiante' ? 'border-primary border-2' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      player.rank === 1 ? 'bg-warning/20' :
                      player.rank === 2 ? 'bg-gray-200 dark:bg-gray-700' :
                      player.rank === 3 ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-muted'
                    }`}>
                      {player.rank === 1 ? (
                        <Crown className="w-6 h-6 text-warning" />
                      ) : (
                        <span className={getBadgeColor(player.badge)}>#{player.rank}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${player.name === 'Estudiante' ? 'text-primary' : 'text-foreground'}`}>
                          {player.name}
                          {player.name === 'Estudiante' && <span className="text-xs ml-1">(Tú)</span>}
                        </h3>
                        {player.badge && (
                          <Medal className={`w-4 h-4 ${getBadgeColor(player.badge)}`} />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Nivel {player.level}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {player.streak} días de racha
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">{player.xp.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
