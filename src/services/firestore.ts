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
   * Add a new website inspiration
   */
  addWebsite: async (websiteData: Omit<Website, "id" | "createdAt">) => {
    return addDoc(collection(db, "websites"), {
      ...websiteData,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Update an existing website
   */
  updateWebsite: async (id: string, data: Partial<Website>) => {
    const docRef = doc(db, "websites", id);
    return updateDoc(docRef, data);
  },

  /**
   * Delete a website
   */
  deleteWebsite: async (id: string) => {
    return deleteDoc(doc(db, "websites", id));
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (id: string, isFavorite: boolean) => {
    return updateDoc(doc(db, "websites", id), { isFavorite });
  },

  // --- COLLECTIONS ---

  /**
   * Listen to real-time updates for a user's collections
   */
  subscribeToCollections: (userId: string, callback: (collections: Collection[]) => void) => {
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
    const q = query(collection(db, "collections"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Collection[];
  },

  /**
   * Add a new collection
   */
  addCollection: async (userId: string, name: string, description: string) => {
    return addDoc(collection(db, "collections"), {
      userId,
      name,
      description,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Delete a collection
   */
  deleteCollection: async (id: string) => {
    return deleteDoc(doc(db, "collections", id));
  },

  /**
   * Get a specific collection by ID
   */
  getCollectionById: async (id: string): Promise<Collection | null> => {
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
