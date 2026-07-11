import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-chavpk.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-chavpk',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-chavpk.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:demo',
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

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    try {
      import('firebase/auth').then(({ connectAuthEmulator }) => connectAuthEmulator(auth, 'http://localhost:9099'));
      import('firebase/firestore').then(({ connectFirestoreEmulator }) => connectFirestoreEmulator(db, 'localhost', 8080));
    } catch {
      // Ignore emulator connection errors and fall back to the live Firebase SDK behavior.
    }
  }
}

const STORAGE_KEYS = {
  user: 'chavpk-demo-user',
  watchlist: 'chavpk-demo-watchlist',
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredUser = (user) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

const clearStoredUser = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEYS.user);
};

const broadcastAuthChange = (user) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('chavpk-auth-change', { detail: user }));
};

const listenToAuth = (callback) => {
  if (!auth) {
    const emit = () => callback(getStoredUser());
    emit();

    if (typeof window !== 'undefined') {
      window.addEventListener('chavpk-auth-change', emit);
      return () => window.removeEventListener('chavpk-auth-change', emit);
    }

    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};

const signInWithEmail = async (email, password) => {
  if (!auth) {
    const user = { uid: email.toLowerCase(), email };
    saveStoredUser(user);
    broadcastAuthChange(user);
    return user;
  }

  return signInWithEmailAndPassword(auth, email, password);
};

const signUpWithEmail = async (email, password) => {
  if (!auth) {
    const user = { uid: email.toLowerCase(), email };
    saveStoredUser(user);
    broadcastAuthChange(user);
    return user;
  }

  return createUserWithEmailAndPassword(auth, email, password);
};

const signOutUser = async () => {
  if (!auth) {
    clearStoredUser();
    broadcastAuthChange(null);
    return null;
  }

  return signOut(auth);
};

const loadUserWatchlist = async (userId) => {
  if (typeof window === 'undefined' || !userId) {
    return [];
  }

  if (!db) {
    try {
      const raw = window.localStorage.getItem(`${STORAGE_KEYS.watchlist}:${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
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
  if (typeof window === 'undefined' || !userId) {
    return items;
  }

  if (!db) {
    window.localStorage.setItem(`${STORAGE_KEYS.watchlist}:${userId}`, JSON.stringify(items));
    return items;
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
