import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  User,
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCN5M1eDxEJGXyKj_KjjHqZQNXi3SbPT4",
  authDomain: "sports-analytics-platform-8e577.firebaseapp.com",
  projectId: "sports-analytics-platform-8e577",
  storageBucket: "sports-analytics-platform-8e577.appspot.com",
  messagingSenderId: "981898376878",
  appId: "1:981898376878:web:0d2b3f3f0b0b0b0b0b0b0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Auth functions
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const register = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signOut = () => firebaseSignOut(auth);

export const onAuthStateChanged = (callback: (user: User | null) => void) =>
  firebaseOnAuthStateChanged(auth, callback);

export const updateProfile = (user: User, profile: { displayName?: string | null; photoURL?: string | null }) =>
  firebaseUpdateProfile(user, profile);

export type { User };
export default app;
