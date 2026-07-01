import { useState, useEffect } from "react";
import { Collection, Website } from "@/types";
import { FirestoreService } from "@/services/firestore";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook for managing and listening to collections data
 */
export function useCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setCollections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      const unsubscribe = FirestoreService.subscribeToCollections(user.uid, (data) => {
        setCollections(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error subscribing to collections:", err);
      setError(err as Error);
      setLoading(false);
    }
  }, [user]);

  const addCollection = async (name: string, description: string) => {
    if (!user) throw new Error("User must be logged in");
    return FirestoreService.addCollection(user.uid, name, description);
  };

  const deleteCollection = async (id: string) => {
    return FirestoreService.deleteCollection(id);
  };

  const getCollectionsOnce = async () => {
    if (!user) return [];
    return FirestoreService.getCollections(user.uid);
  };

  return {
    collections,
    loading,
    error,
    addCollection,
    deleteCollection,
    getCollectionsOnce
  };
}

/**
 * Hook for a specific collection and its websites
 */
export function useCollection(collectionId: string) {
  const { user } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !collectionId) return;

    setLoading(true);

    // Fetch collection info
    FirestoreService.getCollectionById(collectionId).then(data => {
      setCollection(data);
    });

    // Subscribe to websites in this collection
    const unsubscribe = FirestoreService.subscribeToCollectionWebsites(
      user.uid, 
      collectionId, 
      (data) => {
        setWebsites(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, collectionId]);

  return {
    collection,
    websites,
    loading
  };
}
