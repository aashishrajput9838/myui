import { Timestamp, FieldValue } from "firebase/firestore";

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp | FieldValue;
}
