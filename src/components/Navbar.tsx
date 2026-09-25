import React, { useState, useEffect } from "react";
import {
  Phone,
  Sun,
  Moon,
  Heart,
  Menu,
  X,
  ShieldCheck,
  Building,
  KeyRound,
  FileText,
  UserCheck,
  MessageCircle,
  LogIn
} from "lucide-react";
import { Logo } from "./Logo";
import {
  PHONE_DISPLAY,
  PHONE_TEL_LINK,
  WHATSAPP_LINK
} from "../constants/config";

interface NavbarProps {
  currentTheme: "dark" | "light";
  onToggleTheme: () => void;
  favoritesCount: number;
  onOpenClientArea?: (initialTab?: "favorites" | "alerts" | "notifications") => void;
  onOpenFavorites?: () => void;
  onOpenAlerts?: () => void;
  onOpenSobreNos?: () => void;
  onOpenTermos?: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: () => void;
  onNavigateToCatalog?: (filterType?: "all" | "Venda" | "Arrendamento") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onToggleTheme,
  favoritesCount,
  onOpenClientArea,
  onOpenFavorites,
  onOpenAlerts,
  onOpenSobreNos,
  onOpenTermos,
  onOpenAdmin,
  onOpenAuth,
  onNavigateToCatalog,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open to prevent background jumps
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleClientAreaClick = (tab: "favorites" | "alerts" = "favorites") => {
    if (onOpenClientArea) {
      onOpenClientArea(tab);
    } else if (tab === "favorites" && onOpenFavorites) {
      onOpenFavorites();
    } else if (tab === "alerts" && onOpenAlerts) {
      onOpenAlerts();
    }
  };

  const handleNavClick = (callback?: () => void) => {
    if (typeof callback === "function") {
      callback();
    }
    setMobileMenuOpen(false);
  };

  const handleAuthOrAdmin = () => {
    if (typeof onOpenAuth === "function") {
      onOpenAuth();
    } else if (typeof onOpenAdmin === "function") {
      onOpenAdmin();
    }
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 w-full max-w-full ${
        currentTheme === "dark"
          ? "bg-slate-950/95 border-slate-800 text-slate-100"
          : "bg-white/95 border-slate-200 text-slate-900 shadow-sm"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo */}
          <div
            className="cursor-pointer shrink min-w-0 flex items-center"
            onClick={() => handleNavClick(() => onNavigateToCatalog?.("all"))}
          >
            <Logo size="md" theme={currentTheme} className="max-w-[125px] sm:max-w-[160px] md:max-w-[180px]" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-link-catalog"
              type="button"
              onClick={() => onNavigateToCatalog?.("all")}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
            >
              Catálogo
            </button>
            <button
              id="nav-link-venda"
              type="button"
              onClick={() => onNavigateToCatalog?.("Venda")}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
            >
              Comprar
            </button>
            <button
              id="nav-link-arrendamento"
              type="button"
              onClick={() => onNavigateToCatalog?.("Arrendamento")}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
            >
              Arrendar
            </button>
            <button
              id="nav-link-apresentacao"
              type="button"
              onClick={() => {
                const el = document.getElementById("apresentacao-institucional");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else if (onOpenSobreNos) {
                  onOpenSobreNos();
                }
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              Apresentação
            </button>
            <button
              id="nav-link-sobrenos"
              type="button"
              onClick={onOpenSobreNos}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
            >
              Sobre Nós
            </button>
            <button
              id="nav-link-termos"
              type="button"
              onClick={onOpenTermos}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
            >
              Termos & Condições
            </button>
          </nav>

          {/* Right Action Icons & Direct Contacts */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* WhatsApp button */}
            <a
              id="nav-btn-whatsapp"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 text-xs font-semibold text-emerald-300 transition-all cursor-pointer"
              title="Falar pelo WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Phone button */}
            <a
              id="nav-btn-phone"
              href={PHONE_TEL_LINK}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-red-500/50 text-xs font-semibold tracking-wider transition-all"
              title="Ligar para Victória D&D"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span className="text-slate-200">{PHONE_DISPLAY}</span>
            </a>

            {/* Client Area (Favorites & Alerts) */}
            <button
              id="nav-btn-client-area"
              type="button"
              onClick={() => handleClientAreaClick("favorites")}
              className={`relative p-2.5 rounded-lg border transition-all cursor-pointer ${
                currentTheme === "dark"
                  ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
              }`}
              title="Área do Cliente & Favoritos"
              aria-label="Área do Cliente"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? "text-red-500 fill-red-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-red-600 text-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              id="nav-btn-theme-toggle"
              type="button"
              onClick={onToggleTheme}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                currentTheme === "dark"
                  ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-red-400"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
              }`}
              title={currentTheme === "dark" ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
              aria-label="Alternar Tema"
            >
              {currentTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login / Admin Modal Button */}
            <button
              id="nav-btn-admin"
              type="button"
              onClick={handleAuthOrAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider shadow-md transition-all cursor-pointer"
              title="Acesso Conta / Admin"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          </div>

          {/* Mobile Right Controls - Perfectly Sized and Never Overflows */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            {/* Quick WhatsApp */}
            <a
              id="mobile-nav-btn-wa"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center justify-center transition-colors active:scale-95 shrink-0"
              aria-label="WhatsApp Victória D&D"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Quick Phone */}
            <a
              id="mobile-nav-btn-call"
              href={PHONE_TEL_LINK}
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-red-500 flex items-center justify-center transition-colors active:scale-95 shrink-0"
              aria-label="Ligar para a Imobiliária"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Favorites icon */}
            <button
              id="mobile-nav-btn-fav"
              type="button"
              onClick={() => handleClientAreaClick("favorites")}
              className="relative w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95 shrink-0 cursor-pointer"
              aria-label="Ver Favoritos"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? "text-red-500 fill-red-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-red-600 text-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button - Guaranteed visible on all screen sizes */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors active:scale-95 shrink-0 cursor-pointer ${
                currentTheme === "dark"
                  ? "bg-slate-900 border-slate-700 text-slate-100 hover:border-red-500/50"
                  : "bg-slate-100 border-slate-300 text-slate-800 hover:border-red-500/50"
              }`}
              aria-label={mobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Full Screen, Non-cramped with Smooth Touch Scroll */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-slate-950/98 backdrop-blur-2xl border-t border-slate-800 p-4 sm:p-6 flex flex-col gap-4 z-50 overflow-y-auto overscroll-contain w-full max-w-full pb-32"
        >
          {/* Quick Direct Contacts */}
          <div className="grid grid-cols-2 gap-2.5 pb-2 border-b border-slate-800/80">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Fale Connosco</span>
            </a>
            <a
              href={PHONE_TEL_LINK}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-semibold text-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>Ligar Agora</span>
            </a>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateToCatalog?.("all"))}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-100 text-left font-medium active:bg-slate-800 transition-colors"
            >
              <Building className="w-5 h-5 text-red-500 shrink-0" />
              <span>Ver Catálogo Completo</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateToCatalog?.("Venda"))}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-100 text-left font-medium active:bg-slate-800 transition-colors"
            >
              <Building className="w-5 h-5 text-red-500 shrink-0" />
              <span>Imóveis para Comprar</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateToCatalog?.("Arrendamento"))}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-100 text-left font-medium active:bg-slate-800 transition-colors"
            >
              <KeyRound className="w-5 h-5 text-red-500 shrink-0" />
              <span>Imóveis para Arrendar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleNavClick(() => {
                  const el = document.getElementById("apresentacao-institucional");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  else onOpenSobreNos?.();
                });
              }}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-100 text-left font-medium active:bg-slate-800 transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
              <span>Apresentação Institucional</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(onOpenSobreNos)}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-100 text-left font-medium active:bg-slate-800 transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
              <span>Sobre Nós</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(onOpenTermos)}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-100 text-left font-medium active:bg-slate-800 transition-colors"
            >
              <FileText className="w-5 h-5 text-red-500 shrink-0" />
              <span>Termos de Uso e Legislação</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(() => handleClientAreaClick("favorites"))}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-100 text-left font-medium active:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-red-500 shrink-0" />
                <span>Área do Cliente / Favoritos</span>
              </div>
              {favoritesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-400">Alternar Tema</span>
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-red-400 active:scale-95 transition-transform"
                aria-label="Alternar Tema"
              >
                {currentTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <button
              id="mobile-drawer-admin-btn"
              type="button"
              onClick={() => handleNavClick(handleAuthOrAdmin)}
              className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar na Conta / Painel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
