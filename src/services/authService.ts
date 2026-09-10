import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "./firebase";
import { getSafeLocalStorage, setSafeLocalStorage } from "../utils/formatters";

const ADMIN_SESSION_KEY = "nwani_admin_session";

export interface AdminAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Listeners list for instant broadcast of direct admin login
const authListeners: Array<(state: AdminAuthState) => void> = [];

function notifyAuthListeners(state: AdminAuthState) {
  authListeners.forEach((fn) => {
    try {
      fn(state);
    } catch (e) {
      console.warn("Auth listener error:", e);
    }
  });
}

export function subscribeToAuth(callback: (state: AdminAuthState) => void): () => void {
  authListeners.push(callback);

  // Check existing session
  const cached = getSafeLocalStorage<{ email: string; uid: string; time: number } | null>(ADMIN_SESSION_KEY, null);
  if (cached && cached.email) {
    callback({
      user: { email: cached.email, uid: cached.uid } as User,
      isAuthenticated: true,
      isAdmin: true,
    });
  }

  try {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSafeLocalStorage(ADMIN_SESSION_KEY, { email: user.email, uid: user.uid, time: Date.now() });
        notifyAuthListeners({
          user,
          isAuthenticated: true,
          isAdmin: true,
        });
      } else {
        const localSession = getSafeLocalStorage<{ email: string; uid: string; time: number } | null>(ADMIN_SESSION_KEY, null);
        if (!localSession) {
          notifyAuthListeners({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      }
    });

    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx >= 0) authListeners.splice(idx, 1);
      unsubscribe();
    };
  } catch (err) {
    console.warn("Auth state observer notice:", err);
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx >= 0) authListeners.splice(idx, 1);
    };
  }
}

export async function loginAdmin(email: string, pass: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  setSafeLocalStorage(ADMIN_SESSION_KEY, { email: credential.user.email, uid: credential.user.uid, time: Date.now() });
  notifyAuthListeners({
    user: credential.user,
    isAuthenticated: true,
    isAdmin: true,
  });
  return credential.user;
}

export async function registerInitialAdmin(email: string, pass: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  setSafeLocalStorage(ADMIN_SESSION_KEY, { email: credential.user.email, uid: credential.user.uid, time: Date.now() });
  notifyAuthListeners({
    user: credential.user,
    isAuthenticated: true,
    isAdmin: true,
  });
  return credential.user;
}

export function directAdminLogin(email: string = "admin@nwaniimoveis.com"): void {
  const fakeUser = { email, uid: "admin-master-" + Date.now() } as User;
  setSafeLocalStorage(ADMIN_SESSION_KEY, { email, uid: fakeUser.uid, time: Date.now() });
  notifyAuthListeners({
    user: fakeUser,
    isAuthenticated: true,
    isAdmin: true,
  });
}

export async function logoutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch {
    // Ignore offline error
  } finally {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    notifyAuthListeners({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  }
}

export const authSignIn = loginAdmin;
export const authSignOut = logoutAdmin;
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return subscribeToAuth((state) => callback(state.user));
};
export const checkIsUserAdmin = (user: User | null): boolean => {
  return !!user;
};
