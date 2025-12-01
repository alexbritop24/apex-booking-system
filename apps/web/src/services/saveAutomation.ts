// apps/web/src/services/saveAutomation.ts

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function saveAutomation(data: any) {
  try {
    const ref = collection(db, "automations");

    // Renamed variable to avoid shadowing Firestore's "doc"
    const added: any = await addDoc(ref, data);

    return { id: added.id, success: true };
  } catch (error: any) {
    console.error("Error saving automation:", error);
    return { success: false, error };
  }
}