import { getAnalyticsInstance } from '@/lib/firebase';

export const useAnalytics = () => {
  const logEvent = async (eventName: string, eventParams?: { [key: string]: any }) => {
    // Only log on client side
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Get analytics instance (waits for initialization if needed)
      const analyticsInstance = await getAnalyticsInstance();
      
      if (analyticsInstance) {
        try {
          // Dynamically import logEvent to avoid SSR issues
          const { logEvent: firebaseLogEvent } = await import('firebase/analytics');
          firebaseLogEvent(analyticsInstance, eventName, eventParams);
        } catch (error) {
          console.warn('Error logging analytics event:', error);
        }
      } else {
        // Analytics not available, but that's okay - fail silently
        // Don't log to avoid console spam
      }
    } catch (error) {
      // Analytics not available or not supported - fail silently
      // Don't log to avoid console spam
    }
  };

  return { logEvent };
};
