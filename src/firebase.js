import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2d3h_qGbp1k4ZzIg7Uj_4qJPrGNedOWk",
  authDomain: "sharedshopping-c9314.firebaseapp.com",
  projectId: "sharedshopping-c9314",
  storageBucket: "sharedshopping-c9314.appspot.com",
  messagingSenderId: "978457593413",
  appId: "1:978457593413:web:5707a1e5731eb8deb1052c",
  measurementId: "G-NMG5HSY5ME",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
