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
  Award,
  CheckCircle2,
  Building2,
  Home,
  Factory,
  ShoppingBag,
  TrendingUp,
  Users,
  BadgeCheck,
  SearchCheck,
  Key,
  FileCheck
} from "lucide-react";
import { Logo } from "./Logo";
import { LocationMap } from "./LocationMap";
import { SiteSettings } from "../types";
import {
  PHONE_DISPLAY,
  PHONE_TEL_LINK,
  WHATSAPP_LINK,
  EMAIL_OFFICIAL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK,
  WEBSITE_DISPLAY,
  WEBSITE_LINK,
  OFFICIAL_ADDRESS,
  DEFAULT_SOBRE_NOS,
  DEFAULT_MISSION,
  DEFAULT_FIDELIDADE,
  DEFAULT_VALORES,
  DEFAULT_SERVICOS
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

  const mission = settings?.mission || DEFAULT_MISSION;
  const history = settings?.history || DEFAULT_SOBRE_NOS;

  const serviceIcons = [
    Building2,
    Home,
    Factory,
    ShoppingBag,
    TrendingUp,
    Users,
    BadgeCheck,
    SearchCheck,
    Key,
    FileCheck,
  ];

  return (
    <div
      id="sobre-nos-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="sobre-nos-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl rounded-3xl overflow-hidden border shadow-2xl relative my-8 max-h-[92vh] flex flex-col backdrop-blur-2xl ${
          currentTheme === "dark"
            ? "bg-slate-900/90 border-slate-700 text-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
            : "bg-white border-slate-200 text-slate-900 shadow-2xl"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 shrink-0">
          <Logo size="sm" theme={currentTheme} />
          <button
            id="sobre-nos-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-8 flex-1">
          {/* Institutional Banner */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-600/30 text-red-500 text-xs font-bold tracking-wider uppercase mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Institucional • Victória D&D Soluções Imobiliárias</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Excelência e Rigor Imobiliário
              <span className="block text-red-600 font-black mt-1">Victória D&D Soluções Imobiliárias</span>
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Dedicados a transformar oportunidades imobiliárias em negócios sólidos, transparentes e legalmente seguros.
            </p>
          </div>

          {/* Quem Somos */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              <span>Quem Somos?</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed text-justify">
              {history}
            </p>
          </div>

          {/* Missão e Fidelidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">Nossa Missão</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify">
                {mission}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">Fidelidade & Confidencialidade</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify">
                  {DEFAULT_FIDELIDADE}
                </p>
              </div>
            </div>
          </div>

          {/* Valores Corporativos */}
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-3">Nossos Valores</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {DEFAULT_VALORES.map((val, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center font-bold text-xs text-slate-200"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 mx-auto mb-2" />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 10 Serviços Oficiais da Imagem */}
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-3">Nossos 10 Serviços Principais</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {DEFAULT_SERVICOS.map((serv, index) => {
                const IconC = serviceIcons[index % serviceIcons.length];
                return (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-600/15 text-red-500 flex items-center justify-center mb-2">
                      <IconC className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">0{index + 1}</div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">{serv}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details Grid */}
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4">Contactos Oficiais D&D</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Telefone */}
              <a
                href={PHONE_TEL_LINK}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-red-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-600/15 flex items-center justify-center text-red-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Linha Telefónica</span>
                  <span className="text-xs font-bold text-slate-200">{PHONE_DISPLAY}</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">WhatsApp Oficial</span>
                  <span className="text-xs font-bold text-emerald-300">{PHONE_DISPLAY}</span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${EMAIL_OFFICIAL}`}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-red-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-600/15 flex items-center justify-center text-red-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Correio Electrónico</span>
                  <span className="text-xs font-bold text-slate-200 truncate block">{EMAIL_OFFICIAL}</span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-red-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-600/15 flex items-center justify-center text-red-500 shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Instagram & Redes</span>
                  <span className="text-xs font-bold text-slate-200">{INSTAGRAM_HANDLE}</span>
                </div>
              </a>

              {/* Website */}
              <a
                href={WEBSITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-red-500/40 flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-600/15 flex items-center justify-center text-red-500 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Website Oficial</span>
                  <span className="text-xs font-bold text-slate-200">{WEBSITE_DISPLAY}</span>
                </div>
              </a>

              {/* Horário */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-600/15 flex items-center justify-center text-red-500 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Atendimento</span>
                  <span className="text-xs font-bold text-slate-200">{settings?.schedule || "Seg - Sáb: 08:00 às 18:00"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Location Map Section */}
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Sede da Empresa (Av. 21 de Janeiro, Luanda)</span>
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
