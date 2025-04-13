import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTZCS-R6568HuHzsz_t4gvJxRrJWyqEu8",
  authDomain: "bitcamp-hackathon-project.firebaseapp.com",
  projectId: "bitcamp-hackathon-project",
  storageBucket: "bitcamp-hackathon-project.firebasestorage.app",
  messagingSenderId: "416883712479",
  appId: "1:416883712479:web:1af580b06215b37aece46a",
  measurementId: "G-RE7CEW4PYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firestore instance
const db = getFirestore(app);
export { db };