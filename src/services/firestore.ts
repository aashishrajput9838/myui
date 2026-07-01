import { app } from "@/lib/firebase";
import { Website, Collection } from "@/types";

// Initialize Firestore lazily
async function getDb() {
  const { getFirestore } = await import("firebase/firestore");
  return getFirestore(app);
}

async function getFirestoreUtils() {
  const {
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
  } = await import("firebase/firestore");
  const db = await getDb();
  return {
    db,
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
  };
}

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
    (async () => {
      const { db, collection, query, where, orderBy, onSnapshot } = await getFirestoreUtils();
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
    })();
    return () => {}; // Return a no-op unsubscribe for now (we'll improve this later)
  },

  /**
   * Add a new website inspiration
   */
  addWebsite: async (websiteData: Omit<Website, "id" | "createdAt">) => {
    const { db, collection, addDoc, serverTimestamp } = await getFirestoreUtils();
    return addDoc(collection(db, "websites"), {
      ...websiteData,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Update an existing website
   */
  updateWebsite: async (id: string, data: Partial<Website>) => {
    const { db, doc, updateDoc } = await getFirestoreUtils();
    const docRef = doc(db, "websites", id);
    return updateDoc(docRef, data);
  },

  /**
   * Delete a website
   */
  deleteWebsite: async (id: string) => {
    const { db, doc, deleteDoc } = await getFirestoreUtils();
    return deleteDoc(doc(db, "websites", id));
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (id: string, isFavorite: boolean) => {
    const { db, doc, updateDoc } = await getFirestoreUtils();
    return updateDoc(doc(db, "websites", id), { isFavorite });
  },

  // --- COLLECTIONS ---

  /**
   * Listen to real-time updates for a user's collections
   */
  subscribeToCollections: (userId: string, callback: (collections: Collection[]) => void) => {
    (async () => {
      const { db, collection, query, where, orderBy, onSnapshot } = await getFirestoreUtils();
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
    })();
    return () => {};
  },

  /**
   * Get all collections for a user (one-time fetch)
   */
  getCollections: async (userId: string): Promise<Collection[]> => {
    const { db, collection, query, where, getDocs } = await getFirestoreUtils();
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
    const { db, collection, addDoc, serverTimestamp } = await getFirestoreUtils();
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
    const { db, doc, deleteDoc } = await getFirestoreUtils();
    return deleteDoc(doc(db, "collections", id));
  },

  /**
   * Get a specific collection by ID
   */
  getCollectionById: async (id: string): Promise<Collection | null> => {
    const { db, doc, getDoc } = await getFirestoreUtils();
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
    (async () => {
      const { db, collection, query, where, orderBy, onSnapshot } = await getFirestoreUtils();
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
    })();
    return () => {};
  }
};
