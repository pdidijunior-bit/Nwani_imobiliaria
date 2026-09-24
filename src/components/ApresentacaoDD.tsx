import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  Building2,
  Home,
  Factory,
  ShoppingBag,
  TrendingUp,
  Users,
  FileCheck,
  SearchCheck,
  Key,
  BadgeCheck,
  MessageCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import {
  PHONE_DISPLAY,
  PHONE_TEL_LINK,
  WHATSAPP_LINK,
  EMAIL_OFFICIAL,
  OFFICIAL_ADDRESS,
  DEFAULT_SOBRE_NOS,
  DEFAULT_MISSION,
  DEFAULT_FIDELIDADE,
  DEFAULT_VALORES,
  DEFAULT_SERVICOS
} from "../constants/config";
import { Logo } from "./Logo";

interface ApresentacaoDDProps {
  currentTheme?: "dark" | "light";
  onOpenContact?: () => void;
}

export const ApresentacaoDD: React.FC<ApresentacaoDDProps> = ({
  currentTheme = "dark",
}) => {
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
    <section
      id="apresentacao-institucional"
      className={`py-12 sm:py-24 relative overflow-hidden border-t w-full max-w-full ${
        currentTheme === "dark"
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-slate-800 text-slate-100"
          : "bg-gradient-to-b from-slate-50 via-white to-slate-100 border-slate-200 text-slate-900"
      }`}
    >
      {/* Background Architectural Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        {/* Top Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Portfólio Institucional Oficial</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            <span>Comprar e Vender imóvel em Angola?</span>
            <span className="block text-red-600 font-black mt-1">
              FICOU MUITO MAIS FÁCIL!!!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Conheça a <strong>Victória D&D Soluções Imobiliárias</strong>. Serviços especializados em Arrendamentos, Compras, Vendas, Trespasse, Avaliação e Permutas com total segurança e assessoria legal.
          </p>
        </div>

        {/* Grid Institucional: Quem Somos & Missão */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Cartão Quem Somos */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              currentTheme === "dark"
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <Logo size="md" theme={currentTheme} />
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-600/20 text-red-500 border border-red-600/30">
                  Quem Somos?
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-3">
                Excelência & Rigor no Mercado Imobiliário
              </h3>

              <p className="text-sm leading-relaxed text-slate-300 mb-6 text-justify">
                {DEFAULT_SOBRE_NOS}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
              <span>Estudo de mercado sério e realista para uma negociação rápida e segura.</span>
            </div>
          </div>

          {/* Cartão Missão e Fidelidade */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${
              currentTheme === "dark"
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-red-500 tracking-wider uppercase mb-2">
                  <Award className="w-4 h-4 text-red-500" />
                  <span>Nossa Missão</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed text-justify">
                  {DEFAULT_MISSION}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/20">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wide mb-1">
                  <CheckCircle2 className="w-4 h-4 text-red-500" />
                  <span>Fidelidade & Confidencialidade</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {DEFAULT_FIDELIDADE}
                </p>
              </div>

              {/* Valores Fundamentais */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Nossos Valores Corporativos
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DEFAULT_VALORES.map((val, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2 text-xs font-semibold text-slate-200"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Atendimento humanizado em Angola</span>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <span>Falar com Agente</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* 10 Serviços Oficiais (Detalhados da Imagem) */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Nossos Serviços Imobiliários
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Cobertura integral para proprietários, compradores, arrendatários e investidores em Angola.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {DEFAULT_SERVICOS.map((servico, index) => {
              const IconComp = serviceIcons[index % serviceIcons.length];
              return (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] hover:border-red-500/50 flex flex-col justify-between ${
                    currentTheme === "dark"
                      ? "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-3">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Serviço 0{index + 1}
                    </div>
                    <div className="text-xs font-bold text-slate-200 line-clamp-2">
                      {servico}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Barra de Contacto Imediato & WhatsApp D&D */}
        <div className="rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-slate-900 p-6 sm:p-10 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-xs uppercase tracking-widest font-bold text-red-200">
              VICTÓRIA D&D SOLUÇÕES IMOBILIÁRIAS
            </div>
            <h3 className="text-xl sm:text-3xl font-black">
              Pronto para Comprar, Vender ou Avaliar o seu Imóvel?
            </h3>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl">
              Entre em contacto direto com a nossa equipa através do WhatsApp ou por chamada telefónica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              id="presentation-whatsapp-btn"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {PHONE_DISPLAY}</span>
            </a>
            <a
              id="presentation-call-btn"
              href={PHONE_TEL_LINK}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all"
            >
              <Phone className="w-4 h-4 text-red-300" />
              <span>Ligar Agora</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
