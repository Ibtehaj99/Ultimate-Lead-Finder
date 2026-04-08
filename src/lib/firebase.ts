import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCfC4aSYbwWowO7u6q6ggp2E78m3EAqNYg",
    authDomain: "ultimate-lead-finder-34940.firebaseapp.com",
    projectId: "ultimate-lead-finder-34940",
    storageBucket: "ultimate-lead-finder-34940.firebasestorage.app",
    messagingSenderId: "366515967245",
    appId: "1:366515967245:web:7108338e1630d1d5c04c44",
    measurementId: "G-3MG04XJV5B",
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
