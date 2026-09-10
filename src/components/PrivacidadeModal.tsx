import React from "react";
import { X, ShieldCheck, Lock } from "lucide-react";
import { COMPANY_NAME } from "../constants/config";

interface PrivacidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: "dark" | "light";
}

export const PrivacidadeModal: React.FC<PrivacidadeModalProps> = ({
  isOpen,
  onClose,
  currentTheme = "dark",
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacidade-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        id="privacidade-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl rounded-3xl overflow-hidden border shadow-2xl relative my-8 max-h-[90vh] flex flex-col ${
          currentTheme === "dark"
            ? "bg-stone-900 border-stone-800 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-800/80 shrink-0">
          <div className="flex items-center gap-2 text-amber-400">
            <Lock className="w-5 h-5" />
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold">
              Política de Privacidade e Proteção de Dados
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
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">1. Princípio da Confidencialidade</h3>
            <p>
              A <strong>{COMPANY_NAME}</strong> reconhece a importância da privacidade e compromete-se a proteger os dados pessoais recolhidos no decurso das suas atividades, respeitando a Lei de Proteção de Dados Pessoais da República de Angola (Lei n.º 22/11 de 17 de Junho).
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">2. Dados Recolhidos</h3>
            <p className="mb-2">Os dados recolhidos através da nossa plataforma podem incluir:</p>
            <ul className="list-disc pl-5 space-y-1 text-stone-400">
              <li>Nome e contactos telefónicos/WhatsApp fornecidos voluntariamente através dos formulários de chat, agendamento de visita ou criação de alertas;</li>
              <li>Critérios de busca e preferências de imóveis (bairros, tipologias, orçamentos);</li>
              <li>Imóveis marcados como favoritos (armazenados localmente no seu dispositivo via LocalStorage e sincronizados com a sessão).</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">3. Finalidade do Tratamento de Dados</h3>
            <p>
              Os dados facultados destinam-se exclusivamente à prestação de serviços de mediação imobiliária, envio de notificações sobre novos imóveis correspondentes aos alertas criados, agendamento de visitas e esclarecimento de dúvidas diretas aos clientes. A {COMPANY_NAME} jamais comercializa dados a terceiros.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">4. Armazenamento e Segurança</h3>
            <p>
              As informações são armazenadas em infraestrutura em nuvem encriptada (Google Cloud / Firebase Firestore) com rigorosos controlos de acesso, protegendo os seus dados contra acessos não autorizados, perdas ou alterações ilícitas.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">5. Direitos do Titular</h3>
            <p>
              O utilizador tem o direito de solicitar a qualquer momento o acesso, retificação ou eliminação dos seus dados pessoais e alertas cadastrados, bastando para o efeito contactar a nossa equipa através dos canais oficiais indicados no website.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
