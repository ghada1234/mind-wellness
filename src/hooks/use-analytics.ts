import { analytics } from '@/lib/firebase';
import { logEvent as firebaseLogEvent } from 'firebase/analytics';

export const useAnalytics = () => {
  const logEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
    if (analytics) {
      try {
        firebaseLogEvent(analytics, eventName, eventParams);
      } catch (error) {
        console.error('Error logging analytics event:', error);
      }
    } else {
      // Analytics not initialized yet, but that's okay
      // This happens during SSR or if analytics isn't supported
      console.log(`Analytics event: ${eventName}`, eventParams);
    }
  };

  return { logEvent };
};
