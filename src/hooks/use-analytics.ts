import { getAnalyticsInstance } from '@/lib/firebase';

export const useAnalytics = () => {
  const logEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
    // Only log on client side
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Get analytics instance
      const analyticsInstance = getAnalyticsInstance();
      
      if (analyticsInstance) {
        try {
          // Dynamically import and log event
          import('firebase/analytics').then(({ logEvent: firebaseLogEvent }) => {
            firebaseLogEvent(analyticsInstance, eventName, eventParams);
          }).catch(() => {
            // Failed to load analytics module
          });
        } catch (error) {
          console.warn('Error logging analytics event:', error);
        }
      } else {
        // Analytics not initialized yet, but that's okay
        // It will initialize automatically on next page load
      }
    } catch (error) {
      // Analytics error - fail silently
    }
  };

  return { logEvent };
};
