export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: any; // Firestore Timestamp
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: any;
}

export interface Website {
  id: string;
  userId: string;
  collectionId: string;
  websiteName: string;
  url: string;
  thumbnailUrl: string;
  faviconUrl: string;
  websiteTitle: string;
  websiteDescription: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: any;
}
