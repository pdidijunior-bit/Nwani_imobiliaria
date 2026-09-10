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
  currentTheme = "dark",
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="main-footer"
      className="bg-stone-950 text-stone-300 border-t border-stone-800/80 pt-16 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" theme="dark" />
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Plataforma imobiliária de alto padrão em Angola. Especializada em venda, arrendamento, investimentos patrimoniais e assessoria jurídica com rigor técnico e máxima discrição.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 flex items-center justify-center text-amber-400 transition-colors"
                title={`Instagram: ${INSTAGRAM_HANDLE}`}
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 flex items-center justify-center text-emerald-400 transition-colors"
                title="WhatsApp Oficial"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={PHONE_TEL_LINK}
                className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 flex items-center justify-center text-amber-400 transition-colors"
                title={`Ligue para: ${PHONE_DISPLAY}`}
                aria-label="Telefone"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={WEBSITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors"
                title={`Website: ${WEBSITE_DISPLAY}`}
                aria-label="Website Oficial"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navegação Rápida */}
          <div>
            <h4 className="font-serif-luxury text-sm font-bold text-stone-100 uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateToCatalog("all")}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Catálogo Geral</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog("Venda")}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Imóveis para Venda</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog("Arrendamento")}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Imóveis para Arrendamento</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSobreNos}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Sobre a Empresa</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTermos}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Termos de Uso</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacidade}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Política de Privacidade</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-serif-luxury text-sm font-bold text-stone-100 uppercase tracking-wider mb-4">
              Categorias
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigateToCatalog("all", cat.name)}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-600" />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contactos e Endereço */}
          <div>
            <h4 className="font-serif-luxury text-sm font-bold text-stone-100 uppercase tracking-wider mb-4">
              Contactos
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{OFFICIAL_ADDRESS.full}</span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={PHONE_TEL_LINK} className="hover:text-amber-400 transition-colors font-medium">
                  {PHONE_DISPLAY}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors font-medium"
                >
                  WhatsApp Oficial
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  id="footer-link-website"
                  href={WEBSITE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors font-medium break-all"
                >
                  {WEBSITE_DISPLAY}
                </a>
              </li>

              {settings?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors font-medium">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {currentYear} {COMPANY_NAME}. Todos os direitos reservados. •{" "}
            <a
              id="footer-bottom-website-url"
              href={WEBSITE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-amber-400 transition-colors underline decoration-stone-800 underline-offset-4"
            >
              {WEBSITE_DISPLAY}
            </a>
          </p>
          <div className="flex items-center gap-4">
            <button
              id="footer-btn-termos"
              type="button"
              onClick={onOpenTermos}
              className="hover:text-stone-300 transition-colors"
            >
              Termos & Condições
            </button>
            <span>•</span>
            <button
              id="footer-btn-privacidade"
              type="button"
              onClick={onOpenPrivacidade}
              className="hover:text-stone-300 transition-colors"
            >
              Privacidade
            </button>
            <span>•</span>
            <button
              id="footer-btn-admin-portal"
              type="button"
              onClick={onOpenAdmin}
              className="text-amber-500/90 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1"
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
