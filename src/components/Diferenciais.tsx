import React from "react";
import { ShieldCheck, Award, HeartHandshake, FileCheck } from "lucide-react";

export const Diferenciais: React.FC = () => {
  return (
    <section id="diferenciais-section" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Os Nossos Pilares de Excelência</span>
        </div>
        <h2 className="font-serif-luxury text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
          Porquê Escolher a Nwani Imóveis?
        </h2>
        <p className="text-stone-400 text-sm mt-2">
          Garantimos uma experiência imobiliária serena, ética e tecnicamente respaldada em todas as fases do negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Pilar 1: Segurança Jurídica */}
        <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 sm:p-8 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-lg font-bold text-stone-100 mb-2">
            Segurança Jurídica Absoluta
          </h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            Cada transação é rigorosamente auditada. Verificação detalhada de certidões em conservatórias prediais, validação de Direitos de Superfície e conformidade com a legislação fundiária e imobiliária da República de Angola.
          </p>
        </div>

        {/* Pilar 2: Consultoria de Alta Confiança */}
        <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 sm:p-8 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-lg font-bold text-stone-100 mb-2">
            Consultoria de Alta Confiança
          </h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            Transparência total nos custos, taxas e condições de negociação. Atuamos com integridade inegociável, fornecendo relatórios imparciais sobre a real situação do imóvel e das oportunidades em Angola.
          </p>
        </div>

        {/* Pilar 3: Acompanhamento Personalizado */}
        <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 sm:p-8 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-lg font-bold text-stone-100 mb-2">
            Acompanhamento Personalizado
          </h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            Atendimento exclusivo do primeiro contacto até à entrega das chaves e pós-venda. Entendemos os seus objetivos de vida e património para apresentar soluções customizadas e de alto prestígio.
          </p>
        </div>
      </div>
    </section>
  );
};
