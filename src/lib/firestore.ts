import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Fetch all documents in a collection
export const fetchCollection = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a document to a collection
export const addToCollection = async (collectionName: string, data: any) => {
  return await addDoc(collection(db, collectionName), data);
};

// Fetch a single document by ID
export const fetchDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.exists()
    ? { id: docSnapshot.id, ...docSnapshot.data() }
    : null;
};
