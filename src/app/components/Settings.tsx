import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, Moon, Globe, Clock, UserIcon, Lock, FileText, Info, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { pushService } from '../services/pushService';
import { toast } from 'sonner';

interface SettingsProps {
  onLogout?: () => void;
}

export default function Settings({ onLogout }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [reminders, setReminders] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNotificationsChange = async (enabled: boolean) => {
    setNotifications(enabled);
    if (enabled && user) {
      const success = await pushService.registerPushToken(user.id);
      if (success) {
        toast.success('Notificaciones push activadas');
      } else {
        setNotifications(false);
        toast.error('No se pudieron activar las notificaciones');
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const settingsSections = [
    {
      title: 'Preferencias',
      items: [
        { icon: Bell, label: 'Notificaciones', hasToggle: true, value: notifications, onChange: handleNotificationsChange },
        { icon: Moon, label: 'Modo oscuro', hasToggle: true, value: darkMode, onChange: setDarkMode },
      ]
    },
    {
      title: 'Cuenta',
      items: [
        { icon: UserIcon, label: 'Gestión de cuenta', path: '/account' },
        { icon: Lock, label: 'Privacidad', path: '/privacy' },
        { icon: FileText, label: 'Términos y condiciones', path: '/terms' }
      ]
    },
    {
      title: 'Soporte',
      items: [
        { icon: Info, label: 'Acerca de', path: '/about' },
        { icon: HelpCircle, label: 'Ayuda', path: '/help' }
      ]
    }
  ];

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/profile')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Configuración</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                {section.title}
              </h3>
              <div className="bg-card rounded-[20px] shadow-sm border border-border overflow-hidden">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <button
                      onClick={() => {
                        if (item.path) {
                          navigate(item.path);
                        } else if (!item.hasToggle && item.onChange) {
                          item.onChange(!item.value);
                        }
                      }}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">{item.label}</p>
                          {item.value && typeof item.value === 'string' && (
                            <p className="text-sm text-muted-foreground">{item.value}</p>
                          )}
                        </div>
                      </div>

                      {item.hasToggle ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onChange && item.onChange(!item.value);
                          }}
                          className={`w-12 h-7 rounded-full transition-colors relative ${item.value ? 'bg-primary' : 'bg-muted'
                            }`}
                        >
                          <div
                            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${item.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {itemIndex < section.items.length - 1 && (
                      <div className="h-px bg-border mx-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              onClick={() => {
                logout();
                if (onLogout) onLogout();
                navigate('/login');
              }}
              className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive py-4 rounded-[20px] font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>

          <div className="text-center pt-4 pb-8">
            <p className="text-sm text-muted-foreground">
              MathStack v 1.0.1
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2026 MathStack. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
