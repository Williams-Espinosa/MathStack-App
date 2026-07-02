import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, BellOff, Trophy, Flame, Users, BookOpen, Star, Coins, Trash2, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type NotifType = 'achievement' | 'streak' | 'group' | 'lesson' | 'challenge' | 'reward' | 'system';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const ICON_MAP: Record<NotifType, { icon: React.ElementType; bg: string; color: string }> = {
  achievement: { icon: Trophy, bg: '#FEF9C3', color: '#CA8A04' },
  streak: { icon: Flame, bg: '#FEE2E2', color: '#DC2626' },
  group: { icon: Users, bg: '#DBEAFE', color: '#2563EB' },
  lesson: { icon: BookOpen, bg: '#D1FAE5', color: '#16A34A' },
  challenge: { icon: Star, bg: '#EDE9FE', color: '#7C3AED' },
  reward: { icon: Coins, bg: '#FEF3C7', color: '#D97706' },
  system: { icon: Bell, bg: '#F1F5F9', color: '#64748B' },
};

const MOCK: Notification[] = [];

type Filter = 'all' | 'unread';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK);
  const [filter, setFilter] = useState<Filter>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const visible = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const deleteNotif = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div className="size-full flex flex-col bg-background overflow-auto">
      <div className="bg-gradient-to-br from-primary to-blue-700 pt-14 pb-8 px-6 rounded-b-[32px] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Notificaciones</h1>
          {notifications.length > 0 ? (
            <button onClick={clearAll} className="bg-white/20 p-2 rounded-xl backdrop-blur-sm" title="Eliminar todas">
              <Trash2 className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex bg-white/10 rounded-2xl p-1 gap-1">
            {(['all', 'unread'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-white text-primary shadow' : 'text-white/80'
                  }`}
              >
                {f === 'all' ? 'Todas' : `Sin leer${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1 text-white/80 text-xs hover:text-white transition-colors">
              <CheckCheck className="w-4 h-4" />
              Marcar leídas
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-2 pb-6">
        <AnimatePresence initial={false}>
          {visible.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <BellOff className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center">
                {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
              </p>
            </motion.div>
          ) : (
            visible.map((notif) => {
              const { icon: Icon, bg, color } = ICON_MAP[notif.type];
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => markRead(notif.id)}
                  className={`relative flex gap-3 p-4 rounded-[20px] cursor-pointer transition-all ${notif.read ? 'bg-card border border-border' : 'bg-blue-50 border border-blue-200'
                    }`}
                >
                  {!notif.read && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary" />
                  )}

                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`text-sm leading-tight mb-0.5 ${notif.read ? 'text-foreground' : 'font-semibold text-foreground'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{notif.body}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">{notif.time}</p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                    className="absolute bottom-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
