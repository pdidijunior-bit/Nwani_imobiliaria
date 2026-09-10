import React, { useState } from "react";
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
  UserCheck
} from "lucide-react";
import { Logo } from "./Logo";
import { PHONE_DISPLAY, PHONE_TEL_LINK } from "../constants/config";

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
  onNavigateToCatalog,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
        currentTheme === "dark"
          ? "bg-stone-950/90 border-stone-800/80 text-stone-100"
          : "bg-white/95 border-stone-200 text-stone-900 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="cursor-pointer"
            onClick={() => handleNavClick(() => onNavigateToCatalog?.("all"))}
          >
            <Logo size="md" theme={currentTheme} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-link-catalog"
              type="button"
              onClick={() => onNavigateToCatalog?.("all")}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-amber-400 transition-colors"
            >
              Catálogo
            </button>
            <button
              id="nav-link-venda"
              type="button"
              onClick={() => onNavigateToCatalog?.("Venda")}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-amber-400 transition-colors"
            >
              Comprar
            </button>
            <button
              id="nav-link-arrendamento"
              type="button"
              onClick={() => onNavigateToCatalog?.("Arrendamento")}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-amber-400 transition-colors"
            >
              Arrendar
            </button>
            <button
              id="nav-link-sobre"
              type="button"
              onClick={() => onOpenSobreNos?.()}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-amber-400 transition-colors"
            >
              Sobre Nós
            </button>
            <button
              id="nav-link-termos"
              type="button"
              onClick={() => onOpenTermos?.()}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:text-amber-400 transition-colors"
            >
              Termos & Condições
            </button>
          </nav>

          {/* Right Action Icons & Direct Contacts */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Phone button */}
            <a
              id="nav-btn-phone"
              href={PHONE_TEL_LINK}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-xs font-semibold tracking-wider transition-all"
              title="Ligue para a Nwani Imóveis"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-200">{PHONE_DISPLAY}</span>
            </a>

            {/* Client Area (Favorites & Alerts) */}
            <button
              id="nav-btn-client-area"
              type="button"
              onClick={() => handleClientAreaClick("favorites")}
              className={`relative p-2.5 rounded-lg border transition-all ${
                currentTheme === "dark"
                  ? "bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300"
                  : "bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700"
              }`}
              title="Área do Cliente & Favoritos"
              aria-label="Área do Cliente"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? "text-amber-500 fill-amber-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-amber-500 text-stone-950">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              id="nav-btn-theme-toggle"
              type="button"
              onClick={onToggleTheme}
              className={`p-2.5 rounded-lg border transition-colors ${
                currentTheme === "dark"
                  ? "bg-stone-900 hover:bg-stone-800 border-stone-800 text-amber-400"
                  : "bg-stone-100 hover:bg-stone-200 border-stone-300 text-amber-600"
              }`}
              title={currentTheme === "dark" ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
              aria-label="Alternar Tema"
            >
              {currentTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Portal Button */}
            <button
              id="nav-btn-admin"
              type="button"
              onClick={() => onOpenAdmin?.()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs tracking-wider shadow-sm transition-all"
              title="Painel Administrativo"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Painel</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Phone */}
            <a
              id="mobile-nav-btn-call"
              href={PHONE_TEL_LINK}
              className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-amber-400"
              aria-label="Ligar para a Imobiliária"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Favorites icon */}
            <button
              id="mobile-nav-btn-fav"
              type="button"
              onClick={() => handleClientAreaClick("favorites")}
              className="relative p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200"
              aria-label="Ver Favoritos"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? "text-amber-500 fill-amber-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-amber-500 text-stone-950">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-lg border ${
                currentTheme === "dark"
                  ? "bg-stone-900 border-stone-800 text-stone-200"
                  : "bg-stone-100 border-stone-300 text-stone-800"
              }`}
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden fixed inset-x-0 top-[80px] bottom-0 bg-stone-950/95 backdrop-blur-xl border-t border-stone-800 p-6 flex flex-col justify-between z-50 overflow-y-auto"
        >
          <div className="space-y-3">
            <div className="pb-4 mb-2 border-b border-stone-800/80">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Navegação Principal</span>
            </div>

            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateToCatalog?.("all"))}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-100 text-left font-medium"
            >
              <Building className="w-5 h-5 text-amber-400" />
              <span>Ver Catálogo Completo</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateToCatalog?.("Venda"))}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-100 text-left font-medium"
            >
              <Building className="w-5 h-5 text-amber-400" />
              <span>Imóveis para Comprar</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(() => onNavigateToCatalog?.("Arrendamento"))}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-100 text-left font-medium"
            >
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>Imóveis para Arrendar</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(onOpenSobreNos)}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-100 text-left font-medium"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Sobre a Nwani Imóveis</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(onOpenTermos)}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-100 text-left font-medium"
            >
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Termos de Uso e Legislação</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(() => handleClientAreaClick("favorites"))}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-100 text-left font-medium"
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>Área do Cliente / Alertas</span>
              </div>
              {favoritesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-6 border-t border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">Alternar Tema</span>
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-400"
              >
                {currentTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <button
              id="mobile-drawer-admin-btn"
              type="button"
              onClick={() => handleNavClick(onOpenAdmin)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Acessar Painel Administrativo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
