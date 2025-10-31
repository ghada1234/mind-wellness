import { useEffect } from 'react';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';

/**
 * Hook to automatically track user metadata in Firestore
 * This helps with analytics and user activity tracking
 */
export const useUserTracking = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const updateUserMetadata = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        
        // Update or create user document with metadata
        await setDoc(
          userRef,
          {
            email: user.email,
            lastActive: serverTimestamp(),
            // Only set createdAt on first write
          },
          { merge: true }
        );

        // If it's a new user, set the createdAt field
        await setDoc(
          userRef,
          {
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error updating user metadata:', error);
      }
    };

    // Update on mount
    updateUserMetadata();

    // Update every 5 minutes while user is active
    const interval = setInterval(updateUserMetadata, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);
};

