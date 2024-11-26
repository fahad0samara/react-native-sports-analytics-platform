import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  User,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence,
} from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyAdWozW8n-5gUbbqIJQRxfDsXSPot5QFHo',
  authDomain: 'sssss-2454c.firebaseapp.com',
  projectId: 'sssss-2454c',
  storageBucket: 'sssss-2454c.appspot.com',
  messagingSenderId: '152532496034',
  appId: '1:152532496034:web:a28dc96d06f651fe32f1fb',
  measurementId: 'G-HVX551RWY7',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore with settings for React Native
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.warn('Error enabling offline persistence:', err);
});

// Initialize Storage
export const storage = getStorage(app);

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { user: null, error: error.message };
  }
};

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
};

export const updateProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
  try {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    await firebaseUpdateProfile(auth.currentUser, profileData);
    return auth.currentUser;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Storage functions
export const uploadImage = async (uri: string): Promise<string> => {
  try {
    // Convert URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Generate a unique filename
    const filename = `profile_${auth.currentUser?.uid}_${Date.now()}`;
    const reference = storageRef(storage, `profile_images/${filename}`);

    // Upload the blob
    await uploadBytes(reference, blob);

    // Get and return the download URL
    const downloadURL = await getDownloadURL(reference);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Firestore Notification functions
export type NotificationType = 'success' | 'warning' | 'info';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Timestamp;
  read: boolean;
}

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
    callback(notifications);
  }, (error) => {
    console.error('Error subscribing to notifications:', error);
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const addNotification = async (notification: Omit<Notification, 'id'>) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    return addDoc(notificationsRef, notification);
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

// Export types
export type { User };
export default app;
