
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';

interface WaterIntake {
  id: string; // YYYY-MM-DD
  userId: string;
  glasses: number;
  goal: number;
  date: string; // YYYY-MM-DD
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useWaterIntake = () => {
  const { user } = useAuth();
  const [waterIntake, setWaterIntake] = useState({ glasses: 0, goal: 8 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [docExists, setDocExists] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const todayId = getTodayDateString();

  const fetchWaterIntake = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, 'waterIntake', `${user.uid}_${todayId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as WaterIntake;
        setWaterIntake({ glasses: data.glasses, goal: data.goal });
        setDocExists(true);
      } else {
        setWaterIntake({ glasses: 0, goal: 8 });
        setDocExists(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch water intake')
      );
    } finally {
      setLoading(false);
    }
  }, [user, todayId]);

  useEffect(() => {
    fetchWaterIntake();
  }, [fetchWaterIntake]);
  
  const saveWaterIntake = useCallback(async (currentGlasses: number) => {
    if (!user) return;

    try {
        const docRef = doc(db, 'waterIntake', `${user.uid}_${todayId}`);
        if (docExists) {
            await updateDoc(docRef, {
                glasses: currentGlasses,
                updatedAt: Timestamp.now(),
            });
        } else {
            const newLog: WaterIntake = {
                id: todayId,
                userId: user.uid,
                glasses: currentGlasses,
                goal: 8, // You might want to make this configurable
                date: todayId,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };
            await setDoc(docRef, newLog);
            setDocExists(true);
        }
    } catch (err) {
         setError(
            err instanceof Error ? err : new Error('Failed to update water intake')
        );
    }
  }, [user, todayId, docExists]);


  const updateWaterIntake = (glasses: number) => {
    if (!user) throw new Error('User not authenticated');
    
    // Optimistic UI update
    setWaterIntake(prev => ({...prev, glasses}));

    // Clear previous timeout if it exists
    if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout to save data after 1.5 seconds of inactivity
    debounceTimeout.current = setTimeout(() => {
        saveWaterIntake(glasses);
    }, 1500);
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
    }
  }, []);

  return { waterIntake, loading, error, updateWaterIntake };
};
