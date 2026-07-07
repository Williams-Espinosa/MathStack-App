import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Zap, BookOpen, Flame, Trophy } from 'lucide-react';
import { userService } from '../services/userService';
import { storeService } from '../services/storeService';
import { UserProfileResponse } from '../types/api';
import { toast } from 'sonner';

export default function PublicProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [activeAvatarUrl, setActiveAvatarUrl] = useState<string>('👤');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [profileData, items, inventory] = await Promise.all([
          userService.getUserById(id),
          storeService.getItems(),
          storeService.getInventory(id)
        ]);
        
        setProfile(profileData);
        
        const equipped = inventory.find(inv => inv.isEquipped);
        if (equipped) {
          const item = items.find(i => i.id === equipped.itemId);
          if (item) {
            setActiveAvatarUrl(item.assetUrl);
          }
        }
      } catch (error) {
        toast.error('Error al cargar el perfil del usuario');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Cargando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="size-full flex flex-col items-center justify-center bg-background p-6">
        <p className="text-muted-foreground text-lg mb-4">Usuario no encontrado.</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-background overflow-auto">
      <div className="bg-gradient-to-br from-primary to-blue-700 pt-8 pb-16 rounded-b-[40px] shadow-xl">
        <div className="px-6">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-white font-semibold text-lg">Perfil de Jugador</h1>
            <div className="w-10"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center backdrop-blur-sm mb-4 overflow-hidden">
              {activeAvatarUrl && (activeAvatarUrl.startsWith('http') || activeAvatarUrl.startsWith('/')) ? (
                <img src={activeAvatarUrl} alt="Avatar" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-5xl">{activeAvatarUrl || '👤'}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{profile.user.username}</h2>
            <p className="text-white/80 mb-4">{profile.user.email}</p>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="text-white font-semibold">Nivel {profile.gamificationStats.currentLevel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 pb-12">
        <div className="bg-card rounded-[20px] p-5 shadow-lg border border-border mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center border-r border-border">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 mx-auto mb-2">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <p className="text-2xl font-bold text-foreground">{profile.gamificationStats.xpPoints}</p>
              <p className="text-xs text-muted-foreground">XP Total</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mx-auto mb-2">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{profile.gamificationStats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Racha</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Estadísticas</h3>
          <div className="bg-card rounded-[20px] p-4 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="font-medium text-foreground">Lecciones completadas</span>
              </div>
              <span className="text-xl font-bold text-foreground">{profile.gamificationStats.lessonsCompletedCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
