import React from "react";
import {
  Phone,
  MessageCircle,
  Instagram,
  Globe,
  MapPin,
  Mail,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Logo } from "./Logo";
import { Category, SiteSettings } from "../types";
import {
  COMPANY_NAME,
  PHONE_DISPLAY,
  PHONE_TEL_LINK,
  WHATSAPP_LINK,
  EMAIL_OFFICIAL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK,
  WEBSITE_DISPLAY,
  WEBSITE_LINK,
  OFFICIAL_ADDRESS
} from "../constants/config";

interface FooterProps {
  categories: Category[];
  settings?: SiteSettings;
  onNavigateToCatalog: (businessType?: "all" | "Venda" | "Arrendamento", category?: string) => void;
  onOpenSobreNos: () => void;
  onOpenTermos: () => void;
  onOpenPrivacidade: () => void;
  onOpenAdmin: () => void;
  currentTheme?: "dark" | "light";
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  settings,
  onNavigateToCatalog,
  onOpenSobreNos,
  onOpenTermos,
  onOpenPrivacidade,
  onOpenAdmin,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="main-footer"
      className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" theme="dark" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Plataforma imobiliária oficial da Victória D&D Soluções Imobiliárias em Angola. Especializada em Arrendamento, Compra, Venda, Trespasse, Avaliações e Permutas com rigor documental e máxima segurança legal.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-red-500 transition-colors"
                title={`Instagram: ${INSTAGRAM_HANDLE}`}
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 flex items-center justify-center text-emerald-400 transition-colors"
                title="WhatsApp Oficial"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={PHONE_TEL_LINK}
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-red-500 transition-colors"
                title={`Ligue para: ${PHONE_DISPLAY}`}
                aria-label="Telefone"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={WEBSITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                title={`Website: ${WEBSITE_DISPLAY}`}
                aria-label="Website Oficial"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navegação Rápida */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateToCatalog("all")}
                  className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Catálogo Geral</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog("Venda")}
                  className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Imóveis para Compra</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog("Arrendamento")}
                  className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Imóveis para Arrendar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSobreNos}
                  className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Sobre a Empresa</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTermos}
                  className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Termos de Uso</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacidade}
                  className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Política de Privacidade</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">
              Categorias
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigateToCatalog("all", cat.name)}
                    className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contactos e Endereço */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">
              Contactos Oficiais
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{OFFICIAL_ADDRESS.full}</span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href={PHONE_TEL_LINK} className="hover:text-red-400 transition-colors font-semibold">
                  {PHONE_DISPLAY}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors font-semibold text-emerald-400"
                >
                  WhatsApp Oficial ({PHONE_DISPLAY})
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a
                  href={`mailto:${settings?.email || EMAIL_OFFICIAL}`}
                  className="hover:text-red-400 transition-colors font-medium break-all"
                >
                  {settings?.email || EMAIL_OFFICIAL}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-red-500 shrink-0" />
                <a
                  id="footer-link-website"
                  href={WEBSITE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors font-medium break-all"
                >
                  {WEBSITE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} {COMPANY_NAME}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <button
              id="footer-btn-termos"
              type="button"
              onClick={onOpenTermos}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Termos & Condições
            </button>
            <span>•</span>
            <button
              id="footer-btn-privacidade"
              type="button"
              onClick={onOpenPrivacidade}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacidade
            </button>
            <span>•</span>
            <button
              id="footer-btn-admin-portal"
              type="button"
              onClick={onOpenAdmin}
              className="text-red-500 hover:text-red-400 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Painel Administrativo</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
