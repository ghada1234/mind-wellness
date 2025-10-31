import { analytics } from '@/lib/firebase';
import { logEvent as firebaseLogEvent } from 'firebase/analytics';

export const useAnalytics = () => {
  const logEvent = async (eventName: string, eventParams?: { [key: string]: any }) => {
    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      firebaseLogEvent(analyticsInstance, eventName, eventParams);
    } else {
      console.log(`Analytics not supported, but event fired: ${eventName}`, eventParams);
    }
  };

  return { logEvent };
};
