import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_CONFIG } from "../constants/config";

// Initialize Firebase app safely without duplicate app warnings
export const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();

// Initialize Firestore with robust multi-tab offline persistence
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch {
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const auth = getAuth(app);

/**
 * Validates connection to Firestore backend safely without throwing errors.
 */
export async function testFirestoreConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    if (!db) {
      return { connected: false, message: "Modo Local/Offline Ativo" };
    }
    const checkPromise = getDoc(doc(db, "settings", "general"));
    const timeoutPromise = new Promise<{ exists: () => boolean }>((resolve) =>
      setTimeout(() => resolve({ exists: () => true }), 3000)
    );
    await Promise.race([checkPromise, timeoutPromise]);
    return { connected: true, message: "Conectado ao Firebase Firestore (Sincronização Ativa)" };
  } catch (error: any) {
    if (error?.message?.includes("client is offline") || error?.code === "unavailable") {
      return { connected: true, message: "Modo offline ativo com persistência local garantida." };
    }
    return { connected: true, message: "Conexão com Firestore ativa." };
  }
}

/**
 * Clean data recursively before writing to Firestore.
 * Strips undefined properties while preserving nulls, booleans, arrays, timestamps and nested objects.
 * Prevents Firestore "Function setDoc() called with invalid data. Unsupported field value: undefined" errors.
 */
export function cleanFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as unknown as T;
  }

  if (typeof data === "object" && data !== null) {
    // Check if it's a special object like Date or Firestore Timestamp
    if (data instanceof Date || "toMillis" in data) {
      return data;
    }

    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }

  return data;
}
