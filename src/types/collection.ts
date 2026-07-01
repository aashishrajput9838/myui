import { Timestamp } from "firebase/firestore";

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Timestamp;
}
