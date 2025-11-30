import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function saveAutomation(data: any) {
  try {
    const ref = collection(db, "automations");
    const doc = await addDoc(ref, data);
    return { id: doc.id, success: true };
  } catch (error) {
    console.error("Error saving automation:", error);
    return { success: false, error };
  }
}