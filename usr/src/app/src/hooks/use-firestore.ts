
import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';

interface Document {
  id: string;
  [key: string]: any;
}

interface FirestoreOptions {
    daily?: boolean;
}

export const useFirestore = <T extends Document>(path: string, options: FirestoreOptions = {}) => {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    };

    setLoading(true);
    setError(null);

    try {
      const constraints: QueryConstraint[] = [
        where('userId', '==', user.uid),
      ];
      
      if (options.daily) {
        const today = new Date();
        const startOfToday = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        const endOfToday = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
        
        constraints.push(where('createdAt', '>=', startOfToday));
        constraints.push(where('createdAt', '<', endOfToday));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(collection(db, path), ...constraints);
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      setData(documents);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  }, [user, path, options.daily]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addDocument = async (docData: Omit<T, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');

    const tempId = `temp_${Date.now()}`;
    const newDoc = { 
        id: tempId, 
        ...docData, 
        userId: user.uid, 
        createdAt: new Date() 
    } as T;

    // Optimistic update
    setData((prev) => [newDoc, ...prev].sort((a, b) => (b.createdAt as any) - (a.createdAt as any)));

    try {
      const docRef = await addDoc(collection(db, path), {
        ...docData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
      // Replace temporary doc with real one from Firestore
      setData((prev) => prev.map(d => d.id === tempId ? { ...d, id: docRef.id, createdAt: Timestamp.now().toDate() } as T : d));
      return docRef.id;
    } catch (err) {
       setError(err instanceof Error ? err : new Error('Failed to add document'));
       // Revert optimistic update on error
       setData((prev) => prev.filter(d => d.id !== tempId));
       throw err;
    }
  };

  const updateDocument = async (id: string, updates: Partial<T>) => {
    const originalData = [...data];
    // Optimistic update
    setData((prev) => prev.map(d => d.id === id ? { ...d, ...updates } : d));

    try {
      const docRef = doc(db, path, id);
      await updateDoc(docRef, updates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update document'));
      // Revert on error
      setData(originalData);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    const originalData = [...data];
    // Optimistic update
    setData((prev) => prev.filter((d) => d.id !== id));
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete document'));
      // Revert on error
      setData(originalData);
      throw err;
    }
  };

  return { data, loading, error, addDocument, updateDocument, deleteDocument, refetch: fetchData };
};
