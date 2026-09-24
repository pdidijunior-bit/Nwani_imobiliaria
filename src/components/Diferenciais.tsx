import React from "react";
import { ShieldCheck, Award, HeartHandshake, FileCheck } from "lucide-react";

export const Diferenciais: React.FC = () => {
  return (
    <section id="diferenciais-section" className="py-12 sm:py-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-bold tracking-wider uppercase mb-3">
          <Award className="w-3.5 h-3.5 text-red-500" />
          <span>Os Nossos Pilares de Excelência</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Porquê Escolher a Victória D&D Soluções Imobiliárias?
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Garantimos uma experiência imobiliária transparente, dinâmica e legalmente respaldada em todas as etapas do negócio em Angola.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Pilar 1: Segurança Jurídica */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-red-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            Segurança Jurídica & Legalidade
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Cada transação é acompanhada por rigorosa validação documental, conferência de certidões prediais, Direitos de Superfície e conformidade total com a legislação da República de Angola.
          </p>
        </div>

        {/* Pilar 2: Estudo Sério e Realista */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-red-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-5">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            Estudo de Mercado Sério & Realista
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Transparência e fidelidade. Analisamos detalhadamente a liquidez e valor de mercado para proporcionar aos nossos clientes uma venda rápida e eficiente do seu imóvel.
          </p>
        </div>

        {/* Pilar 3: Acompanhamento Personalizado */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-red-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            Fidelidade & Confidencialidade
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Seja para arrendar, comprar ou vender casas, prédios, lojas ou escritórios, somos o seu parceiro de confiança do primeiro contacto até ao aperto de mão final.
          </p>
        </div>
      </div>
    </section>
  );
};
