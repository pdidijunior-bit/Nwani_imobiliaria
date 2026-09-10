import React, { useState } from "react";
import { X, Lock, Mail, Key, ShieldCheck, AlertCircle, UserPlus } from "lucide-react";
import { authSignIn, registerInitialAdmin, directAdminLogin } from "../services/authService";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
  currentTheme?: "dark" | "light";
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast,
  currentTheme = "dark",
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (!email.trim() || !password) {
        throw new Error("Por favor, preencha o e-mail e a palavra-passe.");
      }

      if (mode === "register") {
        if (password.length < 6) {
          throw new Error("A palavra-passe deve ter pelo menos 6 caracteres.");
        }
        await registerInitialAdmin(email.trim(), password);
        onShowToast("Administrador registado e autenticado com sucesso!", "success");
      } else {
        // Mode is login
        try {
          await authSignIn(email.trim(), password);
          onShowToast("Autenticação realizada com sucesso!", "success");
        } catch (loginErr: any) {
          // If offline or network issue fallback
          if (loginErr?.code === "auth/network-request-failed") {
            directAdminLogin(email.trim());
            onShowToast("Autenticado em modo offline.", "success");
          } else {
            throw loginErr;
          }
        }
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
      let msg = err.message || "Erro ao autenticar.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Credenciais de acesso incorretas ou utilizador não encontrado.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "Este e-mail já se encontra registado. Por favor, utilize a opção Entrar.";
      }
      setErrorMsg(msg);
      onShowToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-login-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="admin-login-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl overflow-hidden border shadow-2xl relative p-6 sm:p-8 ${
          currentTheme === "dark"
            ? "bg-stone-900 border-stone-800 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        <button
          id="admin-login-close-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-stone-100">
            Painel Administrativo
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Gestão de Imóveis e Plataforma Nwani Imóveis
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-1 mt-4 p-1 rounded-xl bg-stone-950 border border-stone-800">
            <button
              id="tab-mode-login"
              type="button"
              onClick={() => { setMode("login"); setErrorMsg(""); }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                mode === "login"
                  ? "bg-amber-500 text-stone-950 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Entrar
            </button>
            <button
              id="tab-mode-register"
              type="button"
              onClick={() => { setMode("register"); setErrorMsg(""); }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                mode === "register"
                  ? "bg-amber-500 text-stone-950 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Criar Conta
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@nwaniimoveis.com"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5">
              Palavra-passe {mode === "register" && "(mínimo 6 caracteres)"}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-3 cursor-pointer"
          >
            {mode === "register" ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? "A registar..." : "Registar Administrador"}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoading ? "A autenticar..." : "Entrar no Painel"}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
