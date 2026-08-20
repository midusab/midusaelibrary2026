import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyABwbZptHuRwX2K4yvqKbLVdSPrHLQImWI",
  authDomain: "gen-lang-client-0783744996.firebaseapp.com",
  projectId: "gen-lang-client-0783744996",
  storageBucket: "gen-lang-client-0783744996.firebasestorage.app",
  messagingSenderId: "109353477120",
  appId: "1:109353477120:web:2a9c63ba5744459c73a4e5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, "ai-studio-remixmidusaelibr-96a5333d-bf2b-48b0-82ff-4ca274d733ac");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
