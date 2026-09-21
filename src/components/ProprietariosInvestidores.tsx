import React from "react";
import {
  TrendingUp,
  FileSearch,
  Scale,
  MessageCircle,
  Phone,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL_LINK, WHATSAPP_LINK } from "../constants/config";

export const ProprietariosInvestidores: React.FC = () => {
  return (
    <section
      id="proprietarios-investidores-section"
      className="py-16 sm:py-24 bg-slate-950/70 border-y border-slate-800 relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-bold tracking-wider uppercase mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Soluções para Proprietários e Investidores</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Valorize o Seu Património Imobiliário
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            A <strong>Victória D&D Soluções Imobiliárias</strong> disponibiliza uma assessoria integral para Venda, Arrendamento, Trespasse, Permutas e Avaliações técnicas com estudo de mercado sério e realista em Angola.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Serviço 1: Avaliação Rigorosa */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-red-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-5 group-hover:scale-110 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Avaliação de Imóveis e Equipamentos
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Estudo de mercado sério e realista para precificação exata do seu património residencial, corporativo ou industrial, garantindo venda rápida e rentabilidade segura.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Laudo comparativo e peritagem técnica</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Precificação estratégica de alta liquidez</span>
              </li>
            </ul>
          </div>

          {/* Serviço 2: Promoção e Divulgação Estratégica */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-red-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Promoção & Venda Rápida
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Agentes profissionais empenhados em promover os imóveis dos clientes, divulgando em múltiplos canais digitais, redes oficiais e carteira qualificada de investidores.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Divulgação no Facebook, Instagram e TikTok</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Clientes com perfil verificado e real capacidade</span>
              </li>
            </ul>
          </div>

          {/* Serviço 3: Assessoria Documental */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-red-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-5 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">
                Assessoria Documental e Legal
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Segurança jurídica absoluta para contratos de arrendamento, escrituras públicas, certidões prediais, Direitos de Superfície e representação fidedigna perante a lei.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Conformidade jurídica integral em Angola</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Sigilo e confidencialidade garantidos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
          <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2">
            Pretende Comprar, Vender ou Avaliar o Seu Imóvel?
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6">
            Converse diretamente com os consultores da Victória D&D para um atendimento prioritário e personalizado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              id="cta-whatsapp-direct"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no WhatsApp: {PHONE_DISPLAY}</span>
            </a>

            <a
              id="cta-call-now"
              href={PHONE_TEL_LINK}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>Ligar Agora</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
