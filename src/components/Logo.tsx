import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  theme?: "dark" | "light";
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className = "",
  theme = "dark",
}) => {
  const sizeMap = {
    sm: { icon: 34, title: "text-lg", subtitle: "text-[9px]" },
    md: { icon: 44, title: "text-xl", subtitle: "text-[10px]" },
    lg: { icon: 60, title: "text-2xl", subtitle: "text-xs" },
    xl: { icon: 84, title: "text-4xl", subtitle: "text-sm" },
  };

  const current = sizeMap[size];

  return (
    <div id="nwani-brand-logo" className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D-Styled Metallic Golden Lion Crest */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl p-1.5 transition-transform hover:scale-105"
        style={{
          width: current.icon,
          height: current.icon,
          background: "linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)",
          boxShadow: "0 4px 20px -2px rgba(217, 119, 6, 0.25), inset 0 1px 1px rgba(253, 230, 138, 0.3)",
          border: "1px solid rgba(245, 158, 11, 0.45)",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich metallic gold gradients */}
            <linearGradient id="goldMane" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="goldHighlights" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#FFFBEB" />
            </linearGradient>
          </defs>

          {/* Architectural Crest Silhouette */}
          <path
            d="M50 4 L82 18 L72 58 L50 94 L28 58 L18 18 Z"
            fill="url(#goldMane)"
            opacity="0.18"
          />

          {/* Stylized Majestic Lion Crown & Mane Facets */}
          <path d="M50 8 L66 19 L56 34 L50 26 L44 34 L34 19 Z" fill="url(#goldHighlights)" />
          <path d="M66 19 L86 31 L75 52 L60 41 Z" fill="url(#goldMane)" opacity="0.95" />
          <path d="M34 19 L14 31 L25 52 L40 41 Z" fill="url(#goldMane)" opacity="0.95" />
          <path d="M75 52 L83 72 L62 65 L60 52 Z" fill="url(#goldMane)" opacity="0.85" />
          <path d="M25 52 L17 72 L38 65 L40 52 Z" fill="url(#goldMane)" opacity="0.85" />

          {/* Architectural Snout, Nose & Jaw Lines */}
          <polygon points="50,26 60,40 50,54 40,40" fill="#FFFBEB" />
          <polygon points="50,54 58,68 50,82 42,68" fill="url(#goldHighlights)" />
          <polygon points="45,58 55,58 50,66" fill="#0C0A09" />

          {/* Piercing Sovereign Eyes */}
          <polygon points="42,38 47,41 41,43" fill="#0C0A09" />
          <polygon points="58,38 53,41 59,43" fill="#0C0A09" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif-luxury tracking-[0.2em] font-extrabold uppercase leading-none ${current.title} ${
              theme === "light" ? "text-stone-900" : "text-white"
            }`}
          >
            <span className="text-gold-gradient">NWANI</span>
          </span>
          <span
            className={`font-sans-luxury tracking-[0.35em] font-semibold uppercase mt-0.5 leading-none ${current.subtitle} ${
              theme === "light" ? "text-stone-600" : "text-stone-400"
            }`}
          >
            IMÓVEIS
          </span>
        </div>
      )}
    </div>
  );
};
