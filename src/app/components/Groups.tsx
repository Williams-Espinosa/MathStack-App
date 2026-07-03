import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Users, Plus, TrendingUp, Trophy, Loader2 } from 'lucide-react';
import BottomNav from './BottomNav';
import { groupService, GroupListResponse } from '../services/groupService';
import { toast } from 'sonner';

export default function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<GroupListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getGroups();
        setGroups(data);
      } catch (error) {
        toast.error('Error al cargar grupos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Grupos de Estudio</h1>
          <button
            onClick={() => navigate('/groups/create')}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-[20px] p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Mis Grupos</h2>
              <p className="text-white/80 text-sm">{groups.length} grupos activos</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aún no perteneces a ningún grupo. ¡Crea uno para empezar!
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="bg-card rounded-[20px] shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-24 bg-gradient-to-r ${group.color} p-5 flex items-center justify-between`}>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{group.name}</h3>
                    <p className="text-white/80 text-sm">{group.subject}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Miembros</p>
                      <p className="text-xl font-semibold text-foreground">{group.members} / {group.maxMembers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Retos activos</p>
                      <p className="text-xl font-semibold text-foreground">{group.activeChallenges}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/groups/${group.id}`)}
                      className="flex-1 bg-primary hover:bg-blue-700 text-white py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      Ver grupo
                    </button>
                    <button
                      onClick={() => navigate(`/groups/${group.id}`)}
                      className="px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-full text-sm font-medium transition-colors"
                    >
                      <Trophy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate('/groups/create')}
          className="w-full border-2 border-dashed border-border hover:border-primary rounded-[20px] p-6 flex flex-col items-center justify-center gap-3 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground mb-1">Crear nuevo grupo</p>
            <p className="text-sm text-muted-foreground">Invita a tus amigos a estudiar juntos</p>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
