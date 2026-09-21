import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  theme?: "dark" | "light";
  variant?: "horizontal" | "vertical";
}

/**
 * Logótipo Oficial da Victória D&D Soluções Imobiliárias
 * Baseado na identidade visual oficial (Logótipo com Vivenda, Chave Carmesim, 
 * Monograma D&D e Tipografia Victória D&D Soluções Imobiliárias).
 */
export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className = "",
  theme = "dark",
  variant = "horizontal",
}) => {
  const sizeMap = {
    sm: { icon: 34, title: "text-sm", dd: "text-base", sub: "text-[8px]" },
    md: { icon: 46, title: "text-base", dd: "text-xl", sub: "text-[9px]" },
    lg: { icon: 64, title: "text-xl", dd: "text-2xl", sub: "text-[10px]" },
    xl: { icon: 88, title: "text-3xl", dd: "text-4xl", sub: "text-xs" },
  };

  const current = sizeMap[size];

  return (
    <div
      id="dd-brand-logo"
      className={`inline-flex items-center gap-2.5 select-none ${
        variant === "vertical" ? "flex-col text-center" : ""
      } ${className}`}
    >
      {/* Emblema Vectorial D&D com a Chave Carmesim e Estrutura Imobiliária */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-2xl p-1.5 transition-transform hover:scale-105"
        style={{
          width: current.icon,
          height: current.icon,
          background: theme === "dark" 
            ? "linear-gradient(145deg, #0f172a 0%, #090d16 100%)" 
            : "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
          boxShadow: theme === "dark"
            ? "0 6px 20px -2px rgba(225, 29, 38, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)"
            : "0 6px 20px -2px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
          border: theme === "dark" ? "1px solid rgba(225, 29, 38, 0.35)" : "1px solid rgba(225, 29, 38, 0.25)",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente Carmesim D&D */}
            <linearGradient id="ddCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="60%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>

            {/* Gradiente Azul Marinho Profundo */}
            <linearGradient id="ddNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="40%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0C4A6E" />
            </linearGradient>
          </defs>

          {/* Anel Superior da Chave / Porta-chaves */}
          <circle
            cx="50"
            cy="16"
            r="10"
            stroke="url(#ddNavy)"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Telhado e Chaminé da Casa */}
          <path
            d="M20 46 L50 24 L80 46"
            stroke="url(#ddNavy)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M66 35 V27 H72 V40"
            stroke="url(#ddNavy)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Primeiro "D" (Azul Marinho) */}
          <path
            d="M32 46 V80 H44 C53 80 58 74 58 63 C58 52 53 46 44 46 Z"
            fill="url(#ddNavy)"
            fillOpacity="0.95"
          />
          {/* Abertura do Primeiro D */}
          <path
            d="M38 52 H43 C48 52 51 56 51 63 C51 70 48 74 43 74 H38 Z"
            fill={theme === "dark" ? "#0f172a" : "#ffffff"}
          />

          {/* Segundo "D" (Carmesim D&D com Janela) */}
          <path
            d="M48 46 V80 H62 C73 80 79 73 79 63 C79 53 73 46 62 46 Z"
            fill="url(#ddCrimson)"
          />
          {/* Janela Moderna de 4 painéis dentro do segundo D */}
          <rect x="54" y="52" width="7" height="9" rx="1" fill="#FFFFFF" fillOpacity="0.95" />
          <rect x="63" y="52" width="7" height="9" rx="1" fill="#FFFFFF" fillOpacity="0.95" />
          <rect x="54" y="63" width="7" height="9" rx="1" fill="#FFFFFF" fillOpacity="0.95" />
          <rect x="63" y="63" width="7" height="9" rx="1" fill="#FFFFFF" fillOpacity="0.95" />

          {/* Haste e Dentes da Chave Carmesim Estendida */}
          <path
            d="M26 64 H86 M74 64 V72 M82 64 V70 M86 64 V73"
            stroke="url(#ddCrimson)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Tipografia da Marca Victória D&D */}
      {showText && (
        <div className={`flex flex-col ${variant === "vertical" ? "items-center" : "items-start"}`}>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={`font-serif tracking-[0.16em] font-black uppercase ${current.title} ${
                theme === "light" ? "text-slate-900" : "text-slate-100"
              }`}
            >
              VICTÓRIA
            </span>
            <span className={`font-black tracking-wider text-red-600 ${current.dd}`}>
              D&D
            </span>
          </div>
          <span
            className={`font-semibold tracking-[0.24em] uppercase mt-1 leading-none ${current.sub} ${
              theme === "light" ? "text-slate-600" : "text-slate-400"
            }`}
          >
            SOLUÇÕES IMOBILIÁRIAS
          </span>
          {size === "xl" && (
            <span className="text-[10px] font-bold text-red-600 tracking-wider mt-1 uppercase">
              Vendas • Trespasse • Avaliação • Permutas
            </span>
          )}
        </div>
      )}
    </div>
  );
};
