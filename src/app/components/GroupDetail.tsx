import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Users, Trophy, Medal, Crown, Flame, TrendingUp, Award, UserPlus, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { groupService, GroupDetailsResponse } from '../services/groupService';
import { toast } from 'sonner';

export default function GroupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rankingTab, setRankingTab] = useState<'group' | 'global'>('group');
  const [group, setGroup] = useState<GroupDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteIdentifier, setInviteIdentifier] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const fetchGroup = async () => {
    if (!id) return;
    try {
      const data = await groupService.getGroupDetails(id);
      setGroup(data);
    } catch (error) {
      toast.error('Error al cargar detalles del grupo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !inviteIdentifier.trim() || isInviting) return;

    setIsInviting(true);
    try {
      await groupService.addMember(id, inviteIdentifier);
      toast.success('Miembro añadido exitosamente');
      setInviteIdentifier('');
      setShowInviteModal(false);
      fetchGroup(); // Refrescar lista
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al añadir al miembro. Verifica si existe el usuario o si ya está en el grupo.');
    } finally {
      setIsInviting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="size-full flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Grupo no encontrado</p>
        <button onClick={() => navigate('/groups')} className="text-primary hover:underline">
          Volver a Mis Grupos
        </button>
      </div>
    );
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
                  <p className="text-xl font-bold text-white">{group.members.length} / {group.maxMembers}</p>
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

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Miembros del Grupo</h3>
                <p className="text-sm text-muted-foreground">Ranking por XP acumulado</p>
              </div>
              {group.members.length < group.maxMembers && (
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Invitar
                </button>
              )}
            </div>

            <div className="space-y-3">
              {group.members.map((member, idx) => {
                const rank = idx + 1;
                const badge = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : null;
                return (
                <div
                  key={member.userId}
                  className={`bg-card rounded-[20px] p-5 shadow-md border hover:shadow-lg transition-shadow border-border`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      rank === 1 ? 'bg-warning/20' :
                      rank === 2 ? 'bg-gray-200 dark:bg-gray-700' :
                      rank === 3 ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-muted'
                    }`}>
                      {rank === 1 ? (
                        <Crown className="w-6 h-6 text-warning" />
                      ) : (
                        <span className={getBadgeColor(badge)}>#{rank}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {member.username}
                        </h3>
                        {badge && (
                          <Medal className={`w-4 h-4 ${getBadgeColor(badge)}`} />
                        )}
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground ml-2">
                          {member.role === 'CREATOR' ? 'Creador' : 'Miembro'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Nivel {member.level}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {member.streak} días
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">{member.xp.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>
                </div>
              )})}
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
              <div className="text-center py-8 text-muted-foreground">
                El ranking global real pronto estará disponible.
              </div>

            </div>
          </>
        )}
      </div>

    {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card w-full max-w-sm rounded-[24px] p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-foreground mb-2">Añadir miembro</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Busca al usuario por su correo electrónico o su nombre de usuario exacto.
            </p>
            
            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="ej: usuario@email.com o NombreUsuario"
                  className="w-full px-4 py-3 bg-muted border-none rounded-[16px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  value={inviteIdentifier}
                  onChange={(e) => setInviteIdentifier(e.target.value)}
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                disabled={isInviting || !inviteIdentifier.trim()}
                className="w-full py-3 bg-primary text-white rounded-[16px] font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isInviting && <Loader2 className="w-4 h-4 animate-spin" />}
                Añadir al grupo
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
