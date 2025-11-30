import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const COLLECTION = "automations";

// CREATE
export async function saveAutomation(data: any) {
  return await addDoc(collection(db, COLLECTION), data);
}

// READ ALL
export async function getAutomations() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// READ ONE
export async function getAutomationById(id: string) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// UPDATE
export async function updateAutomation(id: string, data: any) {
  const ref = doc(db, COLLECTION, id);
  return await updateDoc(ref, data);
}

// DELETE
export async function deleteAutomation(id: string) {
  const ref = doc(db, COLLECTION, id);
  return await deleteDoc(ref);
}