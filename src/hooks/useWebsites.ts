import { useState, useEffect } from "react";
import { Website } from "@/types";
import { FirestoreService } from "@/services/firestore";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook for managing and listening to websites data
 */
export function useWebsites() {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setWebsites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      const unsubscribe = FirestoreService.subscribeToWebsites(user.uid, (data) => {
        setWebsites(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error subscribing to websites:", err);
      setError(err as Error);
      setLoading(false);
    }
  }, [user]);

  const addWebsite = async (data: Omit<Website, "id" | "createdAt">) => {
    return FirestoreService.addWebsite(data);
  };

  const deleteWebsite = async (id: string) => {
    return FirestoreService.deleteWebsite(id);
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    return FirestoreService.toggleFavorite(id, isFavorite);
  };

  return {
    websites,
    loading,
    error,
    addWebsite,
    deleteWebsite,
    toggleFavorite
  };
}

/**
 * Hook for filtering websites based on search query
 */
export function useFilteredWebsites(websites: Website[], searchQuery: string) {
  const [filtered, setFiltered] = useState<Website[]>(websites);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFiltered(websites);
      return;
    }

    const result = websites.filter((site) => 
      site.websiteName.toLowerCase().includes(query) ||
      site.url.toLowerCase().includes(query) ||
      site.websiteTitle.toLowerCase().includes(query) ||
      site.websiteDescription.toLowerCase().includes(query)
    );
    setFiltered(result);
  }, [searchQuery, websites]);

  return filtered;
}
