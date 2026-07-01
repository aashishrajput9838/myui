import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Website, Collection } from "@/types";
import { 
  validateUrl, 
  validateCollectionName, 
  validateCollectionDescription,
  validateWebsiteName 
} from "@/lib/validators";

/**
 * Sanitize string input to prevent XSS and excessive length
 */
const sanitizeString = (str: string | undefined, maxLength: number = 2000): string => {
  if (!str) return "";
  const trimmed = str.trim();
  return trimmed.slice(0, maxLength);
};

/**
 * Service for handling all Firestore operations related to Websites and Collections.
 * This decouples the UI from the database implementation.
 */
export const FirestoreService = {
  // --- WEBSITES ---

  /**
   * Listen to real-time updates for a user's websites
   */
  subscribeToWebsites: (userId: string, callback: (websites: Website[]) => void) => {
    if (!userId) {
      console.warn("FirestoreService: userId is required for subscribeToWebsites");
      return () => {};
    }
    
    const q = query(
      collection(db, "websites"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const websites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Website[];
      callback(websites);
    });
  },

  /**
   * Add a new website inspiration with validation
   */
  addWebsite: async (websiteData: Omit<Website, "id" | "createdAt">) => {
    // Validate required fields
    if (!websiteData.userId) {
      throw new Error("User ID is required");
    }

    // Validate URL
    const urlValidation = validateUrl(websiteData.url);
    if (!urlValidation.valid) {
      throw new Error(urlValidation.error || "Invalid URL");
    }

    // Sanitize inputs
    const sanitizedData = {
      ...websiteData,
      websiteName: sanitizeString(websiteData.websiteName, 200),
      url: sanitizeString(websiteData.url, 2048),
      thumbnailUrl: sanitizeString(websiteData.thumbnailUrl, 2048),
      faviconUrl: sanitizeString(websiteData.faviconUrl, 500),
      websiteTitle: sanitizeString(websiteData.websiteTitle, 500),
      websiteDescription: sanitizeString(websiteData.websiteDescription, 2000),
      tags: websiteData.tags ? websiteData.tags.slice(0, 20).map(tag => sanitizeString(tag, 50)) : [],
      isFavorite: !!websiteData.isFavorite,
    };

    return addDoc(collection(db, "websites"), {
      ...sanitizedData,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Update an existing website with validation
   */
  updateWebsite: async (id: string, data: Partial<Website>) => {
    if (!id) {
      throw new Error("Website ID is required");
    }

    // Sanitize allowed fields only
    const allowedUpdates: Partial<Website> = {};
    
    if (data.websiteName !== undefined) {
      const nameValidation = validateWebsiteName(data.websiteName);
      if (!nameValidation.valid) {
        throw new Error(nameValidation.error || "Invalid website name");
      }
      allowedUpdates.websiteName = sanitizeString(data.websiteName, 200);
    }
    
    if (data.websiteTitle !== undefined) {
      allowedUpdates.websiteTitle = sanitizeString(data.websiteTitle, 500);
    }
    
    if (data.websiteDescription !== undefined) {
      allowedUpdates.websiteDescription = sanitizeString(data.websiteDescription, 2000);
    }
    
    if (data.tags !== undefined) {
      allowedUpdates.tags = data.tags.slice(0, 20).map(tag => sanitizeString(tag, 50));
    }
    
    if (data.isFavorite !== undefined) {
      allowedUpdates.isFavorite = !!data.isFavorite;
    }
    
    if (data.collectionId !== undefined) {
      allowedUpdates.collectionId = sanitizeString(data.collectionId, 100);
    }

    const docRef = doc(db, "websites", id);
    return updateDoc(docRef, allowedUpdates);
  },

  /**
   * Delete a website
   */
  deleteWebsite: async (id: string) => {
    if (!id) {
      throw new Error("Website ID is required");
    }
    return deleteDoc(doc(db, "websites", id));
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (id: string, isFavorite: boolean) => {
    if (!id) {
      throw new Error("Website ID is required");
    }
    return updateDoc(doc(db, "websites", id), { isFavorite: !!isFavorite });
  },

  // --- COLLECTIONS ---

  /**
   * Listen to real-time updates for a user's collections
   */
  subscribeToCollections: (userId: string, callback: (collections: Collection[]) => void) => {
    if (!userId) {
      console.warn("FirestoreService: userId is required for subscribeToCollections");
      return () => {};
    }
    
    const q = query(
      collection(db, "collections"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const collections = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Collection[];
      callback(collections);
    });
  },

  /**
   * Get all collections for a user (one-time fetch)
   */
  getCollections: async (userId: string): Promise<Collection[]> => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const q = query(collection(db, "collections"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Collection[];
  },

  /**
   * Add a new collection with validation
   */
  addCollection: async (userId: string, name: string, description: string) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate inputs
    const nameValidation = validateCollectionName(name);
    if (!nameValidation.valid) {
      throw new Error(nameValidation.error || "Invalid collection name");
    }

    const descValidation = validateCollectionDescription(description);
    if (!descValidation.valid) {
      throw new Error(descValidation.error || "Invalid description");
    }

    // Sanitize inputs
    const sanitizedData = {
      userId,
      name: sanitizeString(name, 100),
      description: sanitizeString(description, 500),
    };

    return addDoc(collection(db, "collections"), {
      ...sanitizedData,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Delete a collection
   */
  deleteCollection: async (id: string) => {
    if (!id) {
      throw new Error("Collection ID is required");
    }
    return deleteDoc(doc(db, "collections", id));
  },

  /**
   * Get a specific collection by ID
   */
  getCollectionById: async (id: string): Promise<Collection | null> => {
    if (!id) {
      throw new Error("Collection ID is required");
    }
    
    const docRef = doc(db, "collections", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Collection;
    }
    return null;
  },

  /**
   * Get websites for a specific collection
   */
  subscribeToCollectionWebsites: (userId: string, collectionId: string, callback: (websites: Website[]) => void) => {
    if (!userId || !collectionId) {
      console.warn("FirestoreService: userId and collectionId are required");
      return () => {};
    }
    
    const q = query(
      collection(db, "websites"),
      where("userId", "==", userId),
      where("collectionId", "==", collectionId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const websites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Website[];
      callback(websites);
    });
  }
};
