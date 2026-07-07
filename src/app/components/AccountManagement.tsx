import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { toast } from 'sonner';

export default function AccountManagement() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [name, setName] = useState(user?.username || 'Estudiante');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmDelete = window.confirm(
      '¿Estás completamente seguro de que deseas eliminar tu cuenta permanentemente? Esta acción no se puede deshacer y perderás todo tu progreso, insignias y monedas.'
    );
    
    if (confirmDelete) {
      setIsDeleting(true);
      try {
        await userService.deleteUser(user.id);
        toast.success('Cuenta eliminada exitosamente');
        logout();
        navigate('/login');
      } catch (error) {
        toast.error('Ocurrió un error al intentar eliminar la cuenta');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/settings')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Gestión de Cuenta</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="space-y-6">
          <div className="bg-card rounded-[20px] p-6 shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-4">Información Personal</h3>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm mb-2 text-foreground">
                  <User className="w-4 h-4" />
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button className="w-full mt-6 bg-primary hover:bg-blue-700 text-white py-3 rounded-[20px] font-medium transition-colors">
              Guardar cambios
            </button>
          </div>

          <div className="bg-card rounded-[20px] p-6 shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-4">Seguridad</h3>

            <button onClick={() => navigate('/change-password')} className="w-full flex items-center justify-between px-4 py-3 bg-background hover:bg-muted border border-border rounded-[20px] transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-foreground">Cambiar contraseña</span>
              </div>
            </button>
          </div>

          <div className="bg-card rounded-[20px] p-6 shadow-sm border border-border">
            <h3 className="font-semibold text-destructive mb-2">Zona de Peligro</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
            </p>

            <button 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-[20px] transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">{isDeleting ? 'Eliminando...' : 'Eliminar cuenta'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
