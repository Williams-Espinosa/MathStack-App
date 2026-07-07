import { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storeService } from '../services/storeService';
import { StoreItemResponse } from '../types/api';
import { toast } from 'sonner';

interface AvatarSelectorModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onAvatarSelected: (assetUrl: string) => void;
}

export default function AvatarSelectorModal({ userId, isOpen, onClose, onAvatarSelected }: AvatarSelectorModalProps) {
  const [ownedAvatares, setOwnedAvatares] = useState<(StoreItemResponse & { isEquipped: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [equippingId, setEquippingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [items, inventory] = await Promise.all([
          storeService.getItems(),
          storeService.getInventory(userId)
        ]);

        const inventoryMap = new Map(inventory.map(inv => [inv.itemId, inv.isEquipped]));

        const owned = items
          .filter(item => inventoryMap.has(item.id))
          .map(item => ({
            ...item,
            isEquipped: inventoryMap.get(item.id) || false
          }));

        setOwnedAvatares(owned);
      } catch (error) {
        toast.error('Error al cargar los avatares');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen, userId]);

  const handleEquip = async (item: StoreItemResponse) => {
    setEquippingId(item.id);
    try {
      await storeService.equipItem(userId, item.id);
      onAvatarSelected(item.assetUrl);
      toast.success('Avatar actualizado');
      onClose();
    } catch (error) {
      toast.error('Error al equipar el avatar');
    } finally {
      setEquippingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-card w-full max-w-md rounded-t-[32px] p-6 shadow-2xl flex flex-col max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Elige tu Avatar</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando tus avatares...</div>
            ) : ownedAvatares.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Aún no has comprado ningún avatar en la tienda.</div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {ownedAvatares.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleEquip(item)}
                    disabled={equippingId === item.id}
                    className={`relative aspect-square rounded-[20px] p-2 flex flex-col items-center justify-center transition-all ${
                      item.isEquipped
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-muted border-2 border-transparent hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-1">
                      {item.assetUrl && (item.assetUrl.startsWith('http') || item.assetUrl.startsWith('/')) ? (
                        <img src={item.assetUrl} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-4xl">{item.assetUrl || '👤'}</span>
                      )}
                    </div>
                    {item.isEquipped && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
