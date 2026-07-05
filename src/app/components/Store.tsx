import { useState, useEffect } from 'react';
import { Coins, CheckCircle2, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { storeService } from '../services/storeService';
import { StoreItemResponse } from '../types/api';
import { toast } from 'sonner';

interface StoreItemUI extends StoreItemResponse {
  owned: boolean;
}

export default function Store() {
  const { user, gamificationStats, refreshProfile } = useAuth();

  const [items, setItems] = useState<StoreItemUI[]>([]);
  const [pending, setPending] = useState<StoreItemUI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoreData = async () => {
      if (!user) return;
      try {
        const [storeItems, inventory] = await Promise.all([
          storeService.getItems(),
          storeService.getInventory(user.id)
        ]);

        const inventorySet = new Set(inventory.map(inv => inv.itemId));

        const itemsWithOwnership = storeItems.map(item => ({
          ...item,
          owned: inventorySet.has(item.id)
        }));

        setItems(itemsWithOwnership);
      } catch (error) {
        toast.error('Error al cargar la tienda');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, [user]);

  const coins = gamificationStats?.coins || 0;

  const handleBuy = async () => {
    if (!pending || !user) return;

    try {
      await storeService.buyItem(user.id, pending.id);

      setItems((prev) =>
        prev.map((a) => a.id === pending.id ? { ...a, owned: true } : a)
      );

      await refreshProfile();

      toast.success(`¡"${pending.name}" añadido a tu inventario!`);
      setPending(null);
    } catch (error: any) {
      toast.error(error.message || 'Error al comprar el objeto');
    }
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
                  <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {pending.assetUrl && (pending.assetUrl.startsWith('http') || pending.assetUrl.startsWith('/')) ? (
                      <img src={pending.assetUrl} alt={pending.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-4xl">{pending.assetUrl || '🎁'}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{pending.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Coins className="w-4 h-4 text-warning" />
                      <span className="text-warning font-bold">{pending.cost} monedas</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Saldo restante: {coins - pending.cost} monedas
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center mb-5">
                  ¿Seguro que quieres comprar este artículo?
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

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Cargando tienda...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">No hay artículos disponibles en la tienda.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-[20px] p-5 shadow-md border transition-all ${item.owned ? 'bg-success/10 border-success' : 'bg-card border-border hover:shadow-lg'
                  }`}
              >
                <div className="aspect-square bg-gradient-to-br from-muted to-background rounded-[15px] flex items-center justify-center mb-3 overflow-hidden p-2">
                  {item.assetUrl && (item.assetUrl.startsWith('http') || item.assetUrl.startsWith('/')) ? (
                    <img src={item.assetUrl} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-6xl">{item.assetUrl || '🎁'}</span>
                  )}
                </div>

                <h3 className="font-medium text-foreground mb-2 text-sm text-center truncate">{item.name}</h3>

                {item.owned ? (
                  <div className="bg-success text-success-foreground text-center py-2 rounded-full text-sm font-medium flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    En inventario
                  </div>
                ) : (
                  <button
                    onClick={() => setPending(item)}
                    disabled={coins < item.cost}
                    className={`w-full py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 ${coins >= item.cost
                      ? 'bg-primary hover:bg-blue-700 text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>{item.cost}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!pending && <BottomNav />}
    </div>
  );
}
