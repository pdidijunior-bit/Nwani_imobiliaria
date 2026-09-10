import React from "react";
import {
  X,
  Phone,
  MessageCircle,
  Instagram,
  Globe,
  Mail,
  MapPin,
  Clock,
  Shield,
  Target,
  Eye,
  Award
} from "lucide-react";
import { Logo } from "./Logo";
import { LocationMap } from "./LocationMap";
import { SiteSettings } from "../types";
import {
  PHONE_DISPLAY,
  PHONE_TEL_LINK,
  WHATSAPP_LINK,
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK,
  WEBSITE_DISPLAY,
  WEBSITE_LINK,
  OFFICIAL_ADDRESS
} from "../constants/config";

interface SobreNosModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettings;
  currentTheme?: "dark" | "light";
}

export const SobreNosModal: React.FC<SobreNosModalProps> = ({
  isOpen,
  onClose,
  settings,
  currentTheme = "dark",
}) => {
  if (!isOpen) return null;

  const mission = settings?.mission || "Proporcionar soluções imobiliárias de excelência em Angola com máxima segurança jurídica, transparência e atendimento de alto padrão para compradores, arrendatários e investidores.";
  const vision = settings?.vision || "Ser a imobiliária de referência em Angola para propriedades de alto padrão e investimentos imobiliários com integridade e prestígio.";
  const history = settings?.history || "A Nwani Imóveis nasceu para elevar os padrões do mercado imobiliário em Angola, unindo rigor jurídico, atendimento personalizado e um portfólio selecionado de propriedades de excelência.";

  return (
    <div
      id="sobre-nos-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        id="sobre-nos-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl rounded-3xl overflow-hidden border shadow-2xl relative my-8 max-h-[92vh] flex flex-col ${
          currentTheme === "dark"
            ? "bg-stone-900 border-stone-800 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-800/80 shrink-0">
          <Logo size="sm" theme={currentTheme} />
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-8 flex-1">
          {/* Institutional Banner */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Institucional • Nwani Imóveis</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              Excelência, Rigor e Prestígio
            </h2>
            <p className="text-stone-400 text-sm mt-3 leading-relaxed">
              Atuamos com foco na exclusividade, solidez e conformidade jurídica no mercado imobiliário da República de Angola.
            </p>
          </div>

          {/* História */}
          <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800/80">
            <h3 className="font-serif-luxury text-lg font-bold text-amber-400 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Nossa Trajetória</span>
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">
              {history}
            </p>
          </div>

          {/* Missão e Visão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800/80">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-stone-100 mb-2">Missão</h3>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                {mission}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800/80">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-stone-100 mb-2">Visão</h3>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                {vision}
              </p>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-stone-100 mb-4">Contactos Oficiais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Telefone */}
              <a
                href={PHONE_TEL_LINK}
                className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-amber-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Linha Telefónica</span>
                  <span className="text-xs font-bold text-stone-200">{PHONE_DISPLAY}</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-emerald-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">WhatsApp Oficial</span>
                  <span className="text-xs font-bold text-emerald-300">{PHONE_DISPLAY}</span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-amber-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Instagram Oficial</span>
                  <span className="text-xs font-bold text-stone-200">{INSTAGRAM_HANDLE}</span>
                </div>
              </a>

              {/* Website */}
              <a
                href={WEBSITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-amber-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Website Oficial</span>
                  <span className="text-xs font-bold text-stone-200">{WEBSITE_DISPLAY}</span>
                </div>
              </a>

              {/* Email (only shown if configured as mandated in item 8) */}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-amber-500/40 flex items-center gap-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 block font-medium">Correio Electrónico</span>
                    <span className="text-xs font-bold text-stone-200">{settings.email}</span>
                  </div>
                </a>
              )}

              {/* Horário */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Atendimento</span>
                  <span className="text-xs font-bold text-stone-200">{settings?.schedule || "Seg - Sáb: 08:00 às 18:00"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Location Map Section */}
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-stone-100 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Sede da Empresa</span>
            </h3>
            <LocationMap
              address={settings?.address || OFFICIAL_ADDRESS.full}
              latitude={settings?.latitude || OFFICIAL_ADDRESS.latitude}
              longitude={settings?.longitude || OFFICIAL_ADDRESS.longitude}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
