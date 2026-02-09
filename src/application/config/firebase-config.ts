import { getAnalytics, type Analytics } from "firebase/analytics";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

function getFirebaseConfig(): {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
} | null {
  const raw = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId: string;
    };
  } catch {
    return null;
  }
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let analytics: Analytics | null = null;

function getFirebaseApp(): FirebaseApp | null {
  const config = getFirebaseConfig();
  if (!config) return null;
  if (!app) {
    app = initializeApp(config);
    analytics = getAnalytics(app);
  }
  return app;
}

export function getAuthInstance(): Auth | null {
  if (typeof window === "undefined") return null;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export function getFirestoreInstance(): Firestore | null {
  if (typeof window === "undefined") return null;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!firestore) {
    firestore = getFirestore(firebaseApp);
  }
  return firestore;
}

export function getAnalyticsInstance(): Analytics | null {
  if (typeof window === "undefined") return null;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  return analytics;
}
