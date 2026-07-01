import { Timestamp } from "firebase/firestore";

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
  createdAt: Timestamp;
}
