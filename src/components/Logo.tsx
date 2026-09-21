import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  theme?: "dark" | "light";
  variant?: "horizontal" | "vertical";
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = false,
  className = "",
  theme = "dark",
  variant = "horizontal",
}) => {
  const sizeMap = {
    sm: { width: 120, height: 44 },
    md: { width: 180, height: 60 },
    lg: { width: 220, height: 72 },
    xl: { width: 280, height: 90 },
  };

  const current = sizeMap[size];
  const customLogoUrl = "/logo-victoria-dd.png";

  return (
    <div
      id="dd-brand-logo"
      className={`inline-flex items-center justify-center select-none ${
        variant === "vertical" ? "flex-col text-center" : ""
      } ${className}`}
    >
      <img
        src={customLogoUrl}
        alt="Victória D&D Soluções Imobiliárias"
        className="object-contain drop-shadow-md"
        style={{
          width: current.width,
          height: current.height,
          filter:
            theme === "dark"
              ? "drop-shadow(0 6px 18px rgba(225, 29, 38, 0.15))"
              : "drop-shadow(0 4px 14px rgba(15, 23, 42, 0.08))",
        }}
      />

      {showText && (
        <div className="ml-2 text-left">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
            VICTÓRIA D&D
          </div>
        </div>
      )}
    </div>
  );
};
