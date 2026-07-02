import { userService } from './userService';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'TU_VAPID_PUBLIC_KEY';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const pushService = {
  async subscribe() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Notificaciones push no soportadas en este navegador.');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permiso de notificaciones denegado.');
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      if (VAPID_PUBLIC_KEY === 'TU_VAPID_PUBLIC_KEY') {
        console.warn('VAPID_PUBLIC_KEY no está configurado. La suscripción Push fallará en un entorno real.');
      }
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    return subscription;
  },

  async registerPushToken(userId: string) {
    try {
      const subscription = await this.subscribe();
      await userService.registerPushToken(userId, subscription);
      return true;
    } catch (e) {
      console.error('Error suscribiendo a push:', e);
      return false;
    }
  }
};
