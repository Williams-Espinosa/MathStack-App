import { useNavigate, useLocation } from 'react-router';
import { Home, Trophy, Users, Store as StoreIcon, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard' },
    { icon: Trophy, label: 'Retos', path: '/challenges' },
    { icon: Users, label: 'Grupos', path: '/groups' },
    { icon: StoreIcon, label: 'Tienda', path: '/store' },
    { icon: User, label: 'Perfil', path: '/profile' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path ||
           (path === '/groups' && location.pathname.startsWith('/groups')) ||
           (path === '/profile' && (location.pathname === '/settings' || location.pathname === '/streak'));
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-50">
      <div className="bg-card/90 backdrop-blur-2xl border border-border/60 rounded-full shadow-2xl px-6 py-3 pointer-events-auto">
        <div className="flex items-center justify-center gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center justify-center p-3 rounded-full transition-all duration-300 ${
                  active ? 'bg-primary text-white scale-110' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
