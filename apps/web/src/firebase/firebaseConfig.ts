import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCh7I10qcj02vaxbpYQ2WY9btgbBLNNySE",
  authDomain: "apexbookingsystem.firebaseapp.com",
  projectId: "apexbookingsystem",
  storageBucket: "apexbookingsystem.firebasestorage.app",
  messagingSenderId: "508198193114",
  appId: "1:508198193114:web:095655bb66c3910ede62e3",
  measurementId: "G-NNE0MMVJN9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB reference
export const db = getFirestore(app);