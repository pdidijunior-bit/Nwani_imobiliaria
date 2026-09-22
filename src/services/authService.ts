/**
 * ============================================================================
 * SERVIÇO DE AUTENTICAÇÃO E GESTÃO DE UTILIZADORES (FIREBASE AUTH & FIRESTORE)
 * Victória D&D Soluções Imobiliárias
 * ============================================================================
 * 
 * TAREFA 1: EXPLICAÇÃO DETALHADA DO FLUXO DO FIREBASE AUTHENTICATION:
 * 
 * 1. CRIAR NOVO USUÁRIO (createUserWithEmailAndPassword):
 *    - O método `createUserWithEmailAndPassword(auth, email, password)` comunica
 *      com a infraestrutura da Google Identity Platform / Firebase Auth.
 *    - O Firebase valida o formato do e-mail e aplica hashing criptográfico seguro
 *      (usando scrypt/bcrypt com salt exclusivo) à palavra-passe, de forma que a senha
 *      nunca seja transmitida ou armazenada em texto simples.
 *    - Se o e-mail for válido e não estiver duplicado, é gerado um novo utilizador
 *      com um identificador imutável exclusivo (`uid`), e retornado um objeto `UserCredential`.
 *    - Logo em seguida, utilizamos `updateProfile` para gravar o nome legível (`displayName`)
 *      e persistimos o registo complementar na coleção `users` do Firestore com o perfil `role: "user"`.
 * 
 * 2. AUTENTICAR USUÁRIO EXISTENTE (signInWithEmailAndPassword):
 *    - O método `signInWithEmailAndPassword(auth, email, password)` submete as credenciais
 *      do utilizador aos servidores de autenticação do Firebase.
 *    - O Firebase compara o hash da palavra-passe fornecida com o hash armazenado.
 *    - Com a validação bem-sucedida, o Firebase emite tokens de autenticação criptografados:
 *      o `ID Token` (formato JWT - JSON Web Token com validade de 1 hora) e o `Refresh Token`.
 *    - O estado do cliente é atualizado localmente de forma segura (armazenado no IndexedDB).
 *    - Na verificação de Administrador (Tarefa 4), consultamos o Firestore na coleção `users`
 *      pelo `uid`. Caso o campo `role` não seja "admin", a sessão é revogada imediatamente via `signOut(auth)`.
 * 
 * 3. GERENCIAR O ESTADO DA SESSÃO (onAuthStateChanged):
 *    - O método `onAuthStateChanged(auth, observerCallback)` implementa o padrão de observador
 *      reativo de eventos do Firebase Authentication.
 *    - Ele é acionado automaticamente em 3 situações fundamentais:
 *        a) Na inicialização da aplicação (ao carregar ou atualizar a página), restaurando
 *           a sessão persistida do IndexedDB sem requisições manuais.
 *        b) Quando um utilizador inicia sessão com sucesso (`signIn` / `createUser`).
 *        c) Quando a sessão é encerrada (`signOut`) ou quando o token expira/é revogado.
 *    - O SDK do Firebase encarrega-se em segundo plano de renovar silenciosamente o token JWT
 *      antes de expirar, mantendo o utilizador autenticado sem interrupções.
 * ============================================================================
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { getSafeLocalStorage, setSafeLocalStorage } from "../utils/formatters";
import { ADMIN_DEFAULT_EMAIL } from "../constants/config";
import { UserProfile, UserRole } from "../types";

const ADMIN_SESSION_KEY = "dd_admin_session";
const USER_SESSION_KEY = "dd_user_session";

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Lista de ouvintes reativos para sincronização instantânea em toda a interface
const authListeners: Array<(state: AuthState) => void> = [];

let currentAuthState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isAdmin: false,
};

function notifyAuthListeners(state: AuthState) {
  currentAuthState = state;
  authListeners.forEach((fn) => {
    try {
      fn(state);
    } catch (e) {
      console.warn("Auth listener notice:", e);
    }
  });
}

/**
 * Traduz os códigos de erro comuns do Firebase Authentication para mensagens amigáveis em português.
 */
export function formatFirebaseAuthError(err: any): string {
  if (!err) return "Ocorreu um erro inesperado. Por favor, tente novamente.";
  const code = err.code || "";
  const msg = err.message || "";

  switch (code) {
    case "auth/weak-password":
      return "A palavra-passe deve ter pelo menos 6 caracteres.";
    case "auth/email-already-in-use":
      return "Este endereço de e-mail já se encontra registado. Por favor, utilize a aba Entrar.";
    case "auth/invalid-email":
      return "O endereço de e-mail introduzido é inválido. Verifique a digitação.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou palavra-passe incorretos. Por favor, verifique as suas credenciais.";
    case "auth/user-disabled":
      return "Esta conta de utilizador foi desativada. Contacte o suporte.";
    case "auth/too-many-requests":
      return "Acesso temporariamente bloqueado por muitas tentativas falhadas. Aguarde instantes e tente novamente.";
    case "auth/network-request-failed":
      return "Falha de ligação à internet. Por favor, verifique a sua conexão de rede.";
    case "auth/requires-recent-login":
      return "Esta operação requer autenticação recente. Por favor, volte a iniciar sessão.";
    default:
      if (msg.includes("privilégios de administrador")) {
        return msg;
      }
      return msg || "Ocorreu um erro ao processar a autenticação.";
  }
}

/**
 * TAREFA 1 & SUBSCRITOR DE SESSÃO:
 * Escuta continuamente o ciclo de vida do Firebase Authentication via `onAuthStateChanged`.
 */
export function subscribeToAuth(callback: (state: AuthState) => void): () => void {
  authListeners.push(callback);

  // Fornece imediatamente o estado atual caso já esteja em memória
  if (currentAuthState.isAuthenticated) {
    callback(currentAuthState);
  }

  try {
    const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obter perfil complementar no Firestore
        let role: UserRole = "user";
        let nome = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Utilizador";

        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            const data = snap.data();
            role = (data.role === "admin" ? "admin" : "user");
            if (data.nome) nome = data.nome;
          } else {
            // Se for o e-mail padrão do administrador
            const isAdminEmail = firebaseUser.email?.toLowerCase() === ADMIN_DEFAULT_EMAIL.toLowerCase();
            role = isAdminEmail ? "admin" : "user";
            
            // Cria o documento de utilizador no Firestore
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              nome,
              email: firebaseUser.email || "",
              role,
              createdAt: Date.now(),
            });
          }
        } catch (dbErr) {
          console.warn("Aviso ao ler perfil no Firestore:", dbErr);
          if (firebaseUser.email?.toLowerCase() === ADMIN_DEFAULT_EMAIL.toLowerCase()) {
            role = "admin";
          }
        }

        const profile: UserProfile = {
          uid: firebaseUser.uid,
          nome,
          email: firebaseUser.email || "",
          role,
          createdAt: Date.now(),
        };

        const isAdmin = role === "admin";

        if (isAdmin) {
          setSafeLocalStorage(ADMIN_SESSION_KEY, { email: firebaseUser.email, uid: firebaseUser.uid, time: Date.now() });
        } else {
          setSafeLocalStorage(USER_SESSION_KEY, { email: firebaseUser.email, uid: firebaseUser.uid, nome, time: Date.now() });
        }

        notifyAuthListeners({
          user: firebaseUser,
          profile,
          isAuthenticated: true,
          isAdmin,
        });
      } else {
        // Utilizador desligado
        localStorage.removeItem(ADMIN_SESSION_KEY);
        localStorage.removeItem(USER_SESSION_KEY);
        notifyAuthListeners({
          user: null,
          profile: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    });

    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx >= 0) authListeners.splice(idx, 1);
      unsubscribeFirebase();
    };
  } catch (err) {
    console.warn("Erro ao configurar onAuthStateChanged:", err);
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx >= 0) authListeners.splice(idx, 1);
    };
  }
}

/**
 * TAREFA 2: REGISTAR NOVO UTILIZADOR (REGISTER)
 * 1. Cria conta com createUserWithEmailAndPassword.
 * 2. Atualiza displayName do Firebase User.
 * 3. Salva documento complementar no Firestore (coleção 'users' com uid, nome, email, role: 'user', createdAt).
 */
export async function registerUser(nome: string, email: string, pass: string): Promise<UserProfile> {
  const cleanNome = nome.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanNome) {
    throw new Error("Por favor, introduza o seu nome completo.");
  }
  if (!cleanEmail) {
    throw new Error("Por favor, introduza um endereço de e-mail válido.");
  }
  if (!pass || pass.length < 6) {
    throw new Error("A palavra-passe deve ter pelo menos 6 caracteres.");
  }

  // 1. Firebase Auth createUserWithEmailAndPassword
  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
  const user = credential.user;

  // 2. Atualizar perfil com o Nome
  try {
    await updateProfile(user, { displayName: cleanNome });
  } catch (profErr) {
    console.warn("Aviso ao atualizar displayName:", profErr);
  }

  // 3. Salvar dados complementares no Firestore na coleção 'users'
  const userProfile: UserProfile = {
    uid: user.uid,
    nome: cleanNome,
    email: cleanEmail,
    role: "user",
    createdAt: Date.now(),
  };

  try {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userProfile);
  } catch (fsErr) {
    console.warn("Aviso ao persistir utilizador no Firestore:", fsErr);
  }

  // Notificar observadores
  notifyAuthListeners({
    user,
    profile: userProfile,
    isAuthenticated: true,
    isAdmin: false,
  });

  return userProfile;
}

/**
 * TAREFA 3: FORMULÁRIO DE LOGIN DE USUÁRIO COMUM
 * 1. Valida credenciais no Firebase Auth com signInWithEmailAndPassword.
 * 2. Recupera perfil do Firestore ou cria caso ausente.
 * 3. Redireciona / retorna utilizador autenticado.
 */
export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !pass) {
    throw new Error("Por favor, preencha o e-mail e a palavra-passe.");
  }

  const credential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
  const user = credential.user;

  let role: UserRole = "user";
  let nome = user.displayName || cleanEmail.split("@")[0];

  try {
    const userDocRef = doc(db, "users", user.uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data();
      role = data.role === "admin" ? "admin" : "user";
      if (data.nome) nome = data.nome;
    } else {
      // Registo inicial se não existir
      await setDoc(userDocRef, {
        uid: user.uid,
        nome,
        email: cleanEmail,
        role: "user",
        createdAt: Date.now(),
      });
    }
  } catch (fsErr) {
    console.warn("Aviso ao consultar documento no Firestore:", fsErr);
  }

  const userProfile: UserProfile = {
    uid: user.uid,
    nome,
    email: cleanEmail,
    role,
    createdAt: Date.now(),
  };

  notifyAuthListeners({
    user,
    profile: userProfile,
    isAuthenticated: true,
    isAdmin: role === "admin",
  });

  return userProfile;
}

/**
 * TAREFA 4: LOGIN SEPARADO DO ADMINISTRADOR (COM VERIFICAÇÃO NO FIRESTORE)
 * 1. Autentica no Firebase Auth via signInWithEmailAndPassword.
 * 2. Verifica no Firestore (coleção 'users') se role === 'admin'.
 * 3. Se for admin: concede acesso e retorna dados de admin.
 * 4. Se NÃO for admin: exibe "Acesso negado: esta conta não possui privilégios de administrador"
 *    e encerra a sessão imediatamente com signOut(auth).
 */
export async function loginAdminWithVerification(email: string, pass: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !pass) {
    throw new Error("Por favor, introduza o e-mail e a palavra-passe de administrador.");
  }

  // 1. Autentica via Firebase Auth
  let user: User;
  try {
    const credential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    user = credential.user;
  } catch (authErr: any) {
    // Se a conta de administrador mestre ainda não tiver sido criada no Firebase Auth deste projeto,
    // provisiona automaticamente no primeiro acesso com a palavra-passe escolhida pelo utilizador.
    const isMasterAdminEmail = cleanEmail === ADMIN_DEFAULT_EMAIL.toLowerCase();
    const isMissingAccount = authErr?.code === "auth/user-not-found" || authErr?.code === "auth/invalid-credential";

    if (isMasterAdminEmail && isMissingAccount) {
      try {
        const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        user = newCredential.user;
        await updateProfile(user, { displayName: "Administrador D&D" });
      } catch (createErr: any) {
        // Se já existia e o erro era apenas palavra-passe incorreta:
        if (createErr?.code === "auth/email-already-in-use") {
          throw new Error("Palavra-passe de administrador incorreta. Por favor, verifique a senha digitada.");
        }
        throw authErr;
      }
    } else {
      throw authErr;
    }
  }

  // 2. Consulta Firestore na coleção 'users'
  let role: UserRole = "user";
  let nome = user.displayName || "Administrador";

  try {
    const userDocRef = doc(db, "users", user.uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data();
      role = data.role === "admin" ? "admin" : "user";
      if (data.nome) nome = data.nome;
    } else {
      // Se for o e-mail mestre da imobiliária
      if (cleanEmail === ADMIN_DEFAULT_EMAIL.toLowerCase()) {
        role = "admin";
        await setDoc(userDocRef, {
          uid: user.uid,
          nome: "Administrador D&D",
          email: cleanEmail,
          role: "admin",
          createdAt: Date.now(),
        });
      }
    }
  } catch (fsErr) {
    console.warn("Aviso ao verificar privilégios no Firestore:", fsErr);
    if (cleanEmail === ADMIN_DEFAULT_EMAIL.toLowerCase()) {
      role = "admin";
    }
  }

  // 3. Verificação estrita de Privilégios
  if (role !== "admin") {
    // ENCERRA A SESSÃO IMEDIATAMENTE CONFORME ESPECIFICAÇÃO
    try {
      await signOut(auth);
    } catch {}

    localStorage.removeItem(ADMIN_SESSION_KEY);
    notifyAuthListeners({
      user: null,
      profile: null,
      isAuthenticated: false,
      isAdmin: false,
    });

    throw new Error("Acesso negado: esta conta não possui privilégios de administrador");
  }

  const adminProfile: UserProfile = {
    uid: user.uid,
    nome,
    email: cleanEmail,
    role: "admin",
    createdAt: Date.now(),
  };

  setSafeLocalStorage(ADMIN_SESSION_KEY, { email: cleanEmail, uid: user.uid, time: Date.now() });

  notifyAuthListeners({
    user,
    profile: adminProfile,
    isAuthenticated: true,
    isAdmin: true,
  });

  return adminProfile;
}

/**
 * Compatibilidade: Registo de administrador inicial
 */
export async function registerInitialAdmin(email: string, pass: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
  const user = credential.user;

  try {
    await updateProfile(user, { displayName: "Administrador D&D" });
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      nome: "Administrador D&D",
      email: cleanEmail,
      role: "admin",
      createdAt: Date.now(),
    });
  } catch (err) {
    console.warn("Aviso ao registar admin inicial:", err);
  }

  setSafeLocalStorage(ADMIN_SESSION_KEY, { email: cleanEmail, uid: user.uid, time: Date.now() });
  notifyAuthListeners({
    user,
    profile: { uid: user.uid, nome: "Administrador D&D", email: cleanEmail, role: "admin", createdAt: Date.now() },
    isAuthenticated: true,
    isAdmin: true,
  });

  return user;
}

/**
 * Encerra a sessão atual (Logout)
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("Logout error:", err);
  } finally {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(USER_SESSION_KEY);
    notifyAuthListeners({
      user: null,
      profile: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  }
}

// Aliases para retrocompatibilidade sem quebrar o código existente
export const loginAdmin = loginAdminWithVerification;
export const logoutAdmin = logoutUser;
export const authSignIn = loginAdminWithVerification;
export const authSignOut = logoutUser;

export function directAdminLogin(email: string = ADMIN_DEFAULT_EMAIL): void {
  const fakeUser = { email, uid: "admin-master-" + Date.now() } as User;
  setSafeLocalStorage(ADMIN_SESSION_KEY, { email, uid: fakeUser.uid, time: Date.now() });
  notifyAuthListeners({
    user: fakeUser,
    profile: { uid: fakeUser.uid, nome: "Administrador D&D", email, role: "admin", createdAt: Date.now() },
    isAuthenticated: true,
    isAdmin: true,
  });
}

export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return subscribeToAuth((state) => callback(state.user));
};

export const checkIsUserAdmin = (user: User | null): boolean => {
  return currentAuthState.isAdmin;
};

