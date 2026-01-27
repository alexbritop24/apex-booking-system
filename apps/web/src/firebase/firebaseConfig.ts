import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCh7I10qcj02vaxbpYQ2WY9btgbBLNNySE",
  authDomain: "apexbookingsystem.firebaseapp.com",
  projectId: "apexbookingsystem",
  storageBucket: "apexbookingsystem.appspot.com",
  messagingSenderId: "508198193114",
  appId: "1:508198193114:web:095655bb66c3910ede62e3",
  measurementId: "G-NNE0MMVJN9",
};

const app = initializeApp(firebaseConfig);

// ✅ AUTH (THIS WAS MISSING)
export const auth = getAuth(app);

// ✅ FIRESTORE
export const db = getFirestore(app);