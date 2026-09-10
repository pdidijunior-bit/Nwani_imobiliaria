import React from "react";
import { X, FileText, Scale, ShieldCheck } from "lucide-react";
import { COMPANY_NAME, OFFICIAL_ADDRESS } from "../constants/config";

interface TermosModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: "dark" | "light";
}

export const TermosModal: React.FC<TermosModalProps> = ({
  isOpen,
  onClose,
  currentTheme = "dark",
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="termos-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        id="termos-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl rounded-3xl overflow-hidden border shadow-2xl relative my-8 max-h-[90vh] flex flex-col ${
          currentTheme === "dark"
            ? "bg-stone-900 border-stone-800 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-800/80 shrink-0">
          <div className="flex items-center gap-2 text-amber-400">
            <Scale className="w-5 h-5" />
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold">
              Termos & Condições de Uso
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-stone-300 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">1. Introdução e Âmbito</h3>
            <p>
              Estes Termos e Condições regem a utilização da plataforma web da <strong>{COMPANY_NAME}</strong>, sediada em {OFFICIAL_ADDRESS.full}, para fins de consulta, mediação e promoção imobiliária em conformidade com o ordenamento jurídico vigente na República de Angola.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">2. Atividade de Mediação Imobiliária</h3>
            <p>
              A {COMPANY_NAME} atua na aproximação entre proprietários, compradores e arrendatários. Todas as informações divulgadas a respeito dos imóveis (preço, área, comodidades, disponibilidade e documentação) são obtidas e verificadas junto dos legítimos titulares ou representantes legais autorizados.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">3. Verificação de Imóveis e Direitos de Superfície</h3>
            <p>
              No contexto imobiliário da República de Angola, a transmissão de propriedade e direitos reais sobre imóveis (incluindo o Direito de Superfície e certidões prediais junto das competentes Conservatórias do Registo Predial) está sujeita a procedimentos formais obrigatórios. A {COMPANY_NAME} presta assessoria técnica para assegurar a idoneidade documental das partes antes da celebração definitiva de qualquer negócio.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">4. Visitas e Negociações</h3>
            <p>
              As visitas aos imóveis devem ser previamente agendadas e acompanhadas por consultores credenciados pela {COMPANY_NAME}. A proposta de valores e condições de pagamento estão sujeitas à expressa aceitação dos proprietários.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">5. Propriedade Intelectual</h3>
            <p>
              A marca, o logótipo oficial do Leão Dourado, layout, fotografias e conteúdos textuais constantes deste website são propriedade exclusiva da {COMPANY_NAME}, sendo proibida a sua reprodução sem consentimento prévio por escrito.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">6. Foro e Legislação Aplicável</h3>
            <p>
              Os presentes Termos de Uso são regidos e interpretados de acordo com a legislação da República de Angola. Para a resolução de eventuais litígios decorrentes do uso da plataforma, é competente o Tribunal da Comarca de Luanda.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
          >
            Compreendi e Aceito
          </button>
        </div>
      </div>
    </div>
  );
};
