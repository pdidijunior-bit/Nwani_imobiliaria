import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  UserPlus,
  LogIn,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import {
  registerUser,
  loginUser,
  loginAdminWithVerification,
  formatFirebaseAuthError
} from "../services/authService";
import { Logo } from "./Logo";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
  currentTheme?: "dark" | "light";
  initialMode?: "login" | "register" | "admin";
}

/**
 * Modal Unificado de Autenticação (Login, Cadastro & Acesso Administrativo D&D)
 * Atende estritamente às Tarefas 1, 2, 3 e 4 com efeitos de transparência blur
 * e verificação de privilégios no Firestore.
 */
export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast,
  currentTheme = "dark",
  initialMode = "login",
}) => {
  // Modos de visualização: "login" (usuário comum), "register" (cadastro), "admin" (acesso restrito)
  const [authMode, setAuthMode] = useState<"login" | "register" | "admin">(initialMode);
  
  // Campos de formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados de controlo
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setNome("");
    setEmail("");
    setPassword("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowPassword(false);
  };

  const handleModeChange = (mode: "login" | "register" | "admin") => {
    setErrorMsg("");
    setSuccessMsg("");
    setAuthMode(mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (authMode === "register") {
        // TAREFA 2: CADASTRO DE NOVO USUÁRIO
        if (!nome.trim()) {
          throw new Error("Por favor, introduza o seu nome completo.");
        }
        if (!email.trim() || !password) {
          throw new Error("Por favor, preencha o seu e-mail e palavra-passe.");
        }
        if (password.length < 6) {
          throw new Error("A palavra-passe deve ter pelo menos 6 caracteres.");
        }

        const profile = await registerUser(nome, email, password);
        const welcome = `Conta criada com sucesso! Bem-vindo(a), ${profile.nome}.`;
        setSuccessMsg(welcome);
        onShowToast(welcome, "success");
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1200);

      } else if (authMode === "login") {
        // TAREFA 3: LOGIN DE USUÁRIO COMUM
        if (!email.trim() || !password) {
          throw new Error("Por favor, preencha o seu e-mail e palavra-passe.");
        }

        const profile = await loginUser(email, password);
        const msg = `Sessão iniciada com sucesso! Bem-vindo(a), ${profile.nome}.`;
        setSuccessMsg(msg);
        onShowToast(msg, "success");
        setTimeout(() => {
          onClose();
          resetForm();
        }, 800);

      } else {
        // TAREFA 4: LOGIN SEPARADO DO ADMINISTRADOR (COM VERIFICAÇÃO NO FIRESTORE)
        if (!email.trim() || !password) {
          throw new Error("Por favor, introduza as credenciais de administrador.");
        }

        const adminProfile = await loginAdminWithVerification(email, password);
        const msg = `Acesso concedido ao Painel Administrativo. Olá, ${adminProfile.nome}!`;
        setSuccessMsg(msg);
        onShowToast(msg, "success");
        setTimeout(() => {
          onSuccess();
          onClose();
          resetForm();
        }, 600);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const friendly = formatFirebaseAuthError(err);
      setErrorMsg(friendly);
      onShowToast(friendly, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="unified-auth-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="unified-auth-card-container"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl overflow-hidden border shadow-2xl relative p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 ${
          currentTheme === "dark"
            ? "bg-slate-900/85 border-slate-700/60 text-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
            : "bg-white/95 border-slate-200/90 text-slate-900 shadow-2xl"
        }`}
      >
        {/* Botão de Fechar */}
        <button
          id="auth-modal-close-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho da Marca com Logótipo Victória D&D */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="md" theme={currentTheme} className="mb-3" />
          
          {authMode === "admin" ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-semibold mb-1 animate-pulse">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acesso Restrito à Administração</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium">
              Victória D&D Soluções Imobiliárias
            </p>
          )}

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-slate-100">
            {authMode === "register" && "Criar Nova Conta"}
            {authMode === "login" && "Área do Utilizador"}
            {authMode === "admin" && "Painel de Administração"}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {authMode === "register" && "Cadastre-se para salvar imóveis favoritos e receber notificações exclusivas."}
            {authMode === "login" && "Acesse com o seu e-mail para acompanhar imóveis e preferências."}
            {authMode === "admin" && "Autenticação segura com verificação de privilégios administrativos no Firestore."}
          </p>
        </div>

        {/* Abas de Navegação Principal: Entrar vs Criar Conta (apenas nos modos normais) */}
        {authMode !== "admin" && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 mb-6">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => handleModeChange("login")}
              className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                authMode === "login"
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => handleModeChange("register")}
              className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                authMode === "register"
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta</span>
            </button>
          </div>
        )}

        {/* Mensagens de Sucesso ou Erro */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/70 border border-red-600/40 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nome (Apenas Cadastro) */}
          {authMode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="auth-input-name"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João Baptista"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all backdrop-blur-sm"
                />
              </div>
            </div>
          )}

          {/* Campo E-mail */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Endereço de E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth-input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={authMode === "admin" ? "admin@victoriadd.com" : "seu-email@exemplo.com"}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Palavra-passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="auth-input-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botão Principal de Submissão */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              authMode === "admin"
                ? "bg-gradient-to-r from-red-600 via-red-700 to-slate-900 hover:from-red-500 hover:to-slate-800 shadow-red-950/50"
                : "bg-red-600 hover:bg-red-700 shadow-red-900/30"
            } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {authMode === "register" && (
                  <>
                    <span>Concluir Cadastro</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
                {authMode === "login" && (
                  <>
                    <span>Entrar na Conta</span>
                    <LogIn className="w-4 h-4" />
                  </>
                )}
                {authMode === "admin" && (
                  <>
                    <KeyRound className="w-4 h-4 text-red-300" />
                    <span>Verificar & Entrar no Painel</span>
                  </>
                )}
              </>
            )}
          </button>
        </form>

        {/* TAREFA 4: BOTÃO DESTACADO PARA LOGIN DO ADMINISTRADOR OU VOLTAR */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          {authMode !== "admin" ? (
            <div className="text-center">
              <p className="text-[11px] text-slate-400 mb-2">
                É membro da equipa ou gestor da imobiliária?
              </p>
              <button
                id="auth-switch-to-admin-btn"
                type="button"
                onClick={() => handleModeChange("admin")}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500/50 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                <span>Acesso Administrativo (Entrar como Admin)</span>
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                id="auth-back-to-client-btn"
                type="button"
                onClick={() => handleModeChange("login")}
                className="text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5 mx-auto"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Voltar ao Login de Utilizador Comum</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
