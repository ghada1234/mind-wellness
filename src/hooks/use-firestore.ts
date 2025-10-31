
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  limit as firestoreLimit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';

interface Document {
  id: string;
  createdAt: Timestamp | Date;
  [key: string]: any;
}

interface FirestoreOptions {
  daily?: boolean;
  limit?: number;
}

export const useFirestore = <T extends Document>(
  path: string,
  options: FirestoreOptions = {}
) => {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Memoize options to prevent re-renders
  const memoizedOptions = useMemo(() => options, [options.daily, options.limit]);

  const fetchData = useCallback(
    async (
      loadMore = false,
      lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null
    ) => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const constraints: QueryConstraint[] = [where('userId', '==', user.uid)];

        if (memoizedOptions.daily) {
          const today = new Date();
          const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          constraints.push(
            where('createdAt', '>=', Timestamp.fromDate(startOfToday))
          );
        }

        constraints.push(orderBy('createdAt', 'desc'));

        const currentLimit = memoizedOptions.limit || 10;
        if (memoizedOptions.limit) {
          constraints.push(firestoreLimit(currentLimit));
        }

        if (loadMore && lastVisibleDoc) {
          constraints.push(startAfter(lastVisibleDoc));
        }

        const q = query(collection(db, path), ...constraints);
        const querySnapshot = await getDocs(q);

        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate(),
        })) as T[];

        const newLastDoc =
          querySnapshot.docs[querySnapshot.docs.length - 1] || null;
        setLastDoc(newLastDoc);
        setHasMore(
          memoizedOptions.limit ? documents.length === currentLimit : false
        );

        if (loadMore) {
          setData((prev) => [...prev, ...documents]);
        } else {
          setData(documents);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch data')
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user, path, memoizedOptions]
  );

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (user) {
      fetchData(false, null);
    } else {
      setData([]);
      setLoading(false);
      setHasMore(false);
      setLastDoc(null);
    }
    // Disabling eslint because we specifically want this to run only on auth changes,
    // not on every re-render of fetchData.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, path]);

  const addDocument = async (
    docData: Omit<T, 'id' | 'userId' | 'createdAt'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    const tempId = `temp_${Date.now()}`;
    const newDocForUI = {
      id: tempId,
      ...docData,
      userId: user.uid,
      createdAt: new Date(),
    } as T;
    
    setData((prev) =>
      [newDocForUI, ...prev].sort(
        (a, b) =>
          (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime()
      )
    );

    try {
      const docRef = await addDoc(collection(db, path), {
        ...docData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
      // After successful save, update the item with the real ID from Firestore.
       setData((prev) =>
        prev.map((d) =>
          d.id === tempId
            ? ({ ...d, id: docRef.id })
            : d
        )
      );

      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add document'));
      // If the save fails, remove the temporary item.
      setData((prev) => prev.filter((d) => d.id !== tempId));
      throw err;
    }
  };

  const updateDocument = async (
    id: string,
    updates: Partial<Omit<T, 'id' | 'userId' | 'createdAt'>>
  ) => {
    const originalData = [...data];
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );

    try {
      const docRef = doc(db, path, id);
      await updateDoc(docRef, updates);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to update document')
      );
      setData(originalData);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    const originalData = [...data];
    setData((prev) => prev.filter((d) => d.id !== id));
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to delete document')
      );
      setData(originalData);
      throw err;
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchData(true, lastDoc);
    }
  };

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    refetch: () => fetchData(false, null),
    loadMore,
    hasMore,
    loadingMore,
  };
};
