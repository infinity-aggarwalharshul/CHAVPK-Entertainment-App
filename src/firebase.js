import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

let auth = null;
let db = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

const listenToAuth = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};

const signInWithEmail = async (email, password) => {
  if (!auth) {
    throw new Error('Firebase authentication is not configured.');
  }

  return signInWithEmailAndPassword(auth, email, password);
};

const signUpWithEmail = async (email, password) => {
  if (!auth) {
    throw new Error('Firebase authentication is not configured.');
  }

  return createUserWithEmailAndPassword(auth, email, password);
};

const signOutUser = async () => {
  if (!auth) {
    throw new Error('Firebase authentication is not configured.');
  }

  return signOut(auth);
};

const loadUserWatchlist = async (userId) => {
  if (!db || !userId) {
    return [];
  }

  const ref = doc(db, 'users', userId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.data();
  return Array.isArray(data?.watchlist) ? data.watchlist : [];
};

const saveUserWatchlist = async (userId, items) => {
  if (!db || !userId) {
    throw new Error('Firebase storage is not configured.');
  }

  const ref = doc(db, 'users', userId);
  await setDoc(ref, { watchlist: items }, { merge: true });
  return items;
};

export {
  auth,
  db,
  isFirebaseConfigured,
  listenToAuth,
  loadUserWatchlist,
  saveUserWatchlist,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
};
