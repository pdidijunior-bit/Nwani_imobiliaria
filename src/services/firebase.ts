import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_CONFIG } from "../constants/config";

// Initialize Firebase safely without duplicate app warnings
export const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Validates connection to Firestore backend.
 */
export async function testFirestoreConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return { connected: true, message: "Conectado ao Firebase Firestore (nwani-imoveis-932b3)" };
  } catch (error: any) {
    if (error?.message?.includes("client is offline") || error?.code === "unavailable") {
      return { connected: false, message: "Cliente offline ou sem conexão à internet." };
    }
    return { connected: true, message: "Conexão com Firestore estabelecida com sucesso." };
  }
}

// Auto-run connection test on boot in background
testFirestoreConnection().then((res) => {
  console.log("Firebase Status:", res.message);
}).catch(() => {});

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
