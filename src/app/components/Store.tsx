import { useState } from 'react';
import { Coins, CheckCircle2, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from './BottomNav';

interface Avatar {
  id: number;
  name: string;
  icon: string;
  price: number;
  owned: boolean;
}

const INITIAL_AVATARS: Avatar[] = [
  { id: 1, name: 'Avatar Científico', icon: '🧑‍🔬', price: 150, owned: false },
  { id: 2, name: 'Avatar Estudiante', icon: '👨‍🎓', price: 100, owned: true },
  { id: 3, name: 'Avatar Profesor', icon: '👨‍🏫', price: 200, owned: false },
  { id: 4, name: 'Avatar Genio', icon: '🧠', price: 300, owned: false },
  { id: 5, name: 'Avatar Matemático', icon: '🤓', price: 180, owned: false },
  { id: 6, name: 'Avatar Artista', icon: '🎨', price: 220, owned: false },
  { id: 7, name: 'Avatar Deportista', icon: '⚽', price: 150, owned: false },
  { id: 8, name: 'Avatar Músico', icon: '🎵', price: 200, owned: false },
  { id: 9, name: 'Avatar Chef', icon: '👨‍🍳', price: 170, owned: false },
  { id: 10, name: 'Avatar Astronauta', icon: '👨‍🚀', price: 350, owned: false },
  { id: 11, name: 'Avatar Ninja', icon: '🥷', price: 400, owned: false },
  { id: 12, name: 'Avatar Robot', icon: '🤖', price: 500, owned: false },
];

export default function Store() {
  const [avatars, setAvatars] = useState<Avatar[]>(INITIAL_AVATARS);
  const [coins, setCoins] = useState(350);
  const [pending, setPending] = useState<Avatar | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleBuy = () => {
    if (!pending) return;
    setAvatars((prev) =>
      prev.map((a) => a.id === pending.id ? { ...a, owned: true } : a)
    );
    setCoins((c) => c - pending.price);
    showToast(`¡"${pending.name}" añadido a tu inventario!`);
    setPending(null);
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Tienda de Avatares</h1>
          <div className="flex items-center gap-2 bg-warning/10 px-3 py-2 rounded-full">
            <Coins className="w-5 h-5 text-warning" />
            <span className="font-semibold text-warning">{coins}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pending && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setPending(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-6"
            >
              <div className="bg-card rounded-[28px] p-6 shadow-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground">Confirmar compra</h2>
                  <button
                    onClick={() => setPending(null)}
                    className="p-2 hover:bg-muted rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex items-center gap-4 bg-muted rounded-[20px] p-4 mb-5">
                  <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">{pending.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{pending.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Coins className="w-4 h-4 text-warning" />
                      <span className="text-warning font-bold">{pending.price} monedas</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Saldo restante: {coins - pending.price} monedas
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center mb-5">
                  ¿Seguro que quieres comprar este avatar?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPending(null)}
                    className="flex-1 py-3.5 rounded-[16px] border border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors"
                  >
                    No, cancelar
                  </button>
                  <button
                    onClick={handleBuy}
                    className="flex-1 py-3.5 rounded-[16px] bg-primary hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Sí, comprar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 px-6 py-6">
        <p className="text-sm text-muted-foreground mb-4">Personaliza tu perfil con avatares únicos</p>

        <div className="grid grid-cols-2 gap-4">
          {avatars.map((item) => (
            <div
              key={item.id}
              className={`rounded-[20px] p-5 shadow-md border transition-all ${item.owned ? 'bg-success/10 border-success' : 'bg-card border-border hover:shadow-lg'
                }`}
            >
              <div className="aspect-square bg-gradient-to-br from-muted to-background rounded-[15px] flex items-center justify-center mb-3">
                <span className="text-6xl">{item.icon}</span>
              </div>

              <h3 className="font-medium text-foreground mb-2 text-sm text-center">{item.name}</h3>

              {item.owned ? (
                <div className="bg-success text-success-foreground text-center py-2 rounded-full text-sm font-medium flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  En inventario
                </div>
              ) : (
                <button
                  onClick={() => setPending(item)}
                  disabled={coins < item.price}
                  className={`w-full py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 ${coins >= item.price
                      ? 'bg-primary hover:bg-blue-700 text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>{item.price}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {!pending && <BottomNav />}
    </div>
  );
}
