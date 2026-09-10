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
      className="py-16 sm:py-24 bg-stone-900/50 border-y border-stone-800 relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Soluções para Proprietários e Investidores</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
            Valorize o Seu Património Imobiliário
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-2">
            A Nwani Imóveis disponibiliza um ecossistema completo para gestão, venda, arrendamento e investimentos imobiliários de alto retorno em Angola.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Serviço 1: Avaliação Rigorosa */}
          <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-100 mb-2">
                Avaliação Rigorosa de Mercado
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">
                Determinação técnica do valor real da sua propriedade considerando tendências mercadológicas, liquidez local, comparativos de vendas em Luanda e índices reais de valorização patrimonial.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-stone-300 border-t border-stone-800/60 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Laudo comparativo de mercado</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Precificação estratégica de alta liquidez</span>
              </li>
            </ul>
          </div>

          {/* Serviço 2: Divulgação Estratégica */}
          <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-100 mb-2">
                Divulgação Estratégica
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">
                Apresentação premium da sua propriedade para uma base qualificada de investidores nacionais e internacionais, expatriados, corpos diplomáticos e grandes corporações empresariais.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-stone-300 border-t border-stone-800/60 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fotografia e apresentação profissional</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Acesso a compradores com perfil pré-aprovado</span>
              </li>
            </ul>
          </div>

          {/* Serviço 3: Assessoria Jurídica em Angola */}
          <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-100 mb-2">
                Assessoria Jurídica em Angola
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">
                Validação documental perante conservatórias e órgãos competentes, verificação de Direitos de Superfície, elaboração e conferência de contratos de promessa e escrituras públicas com total segurança.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-stone-300 border-t border-stone-800/60 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Auditoria e regularização documental</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Blindagem jurídica de contratos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="max-w-2xl mx-auto bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-stone-100 mb-2">
            Pretende Vender, Arrendar ou Avaliar o Seu Imóvel?
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm mb-6">
            Converse diretamente com os nossos consultores especializados para uma análise personalizada e sigilosa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              id="cta-whatsapp-direct"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no WhatsApp Directo</span>
            </a>

            <a
              id="cta-call-now"
              href={PHONE_TEL_LINK}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Ligar Agora ({PHONE_DISPLAY})</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
