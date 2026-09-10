import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { PHONE_TEL_LINK, WHATSAPP_LINK, DEFAULT_MARQUEE_TEXT } from "../constants/config";
import { MarqueeItem } from "../types";

interface MarqueeProps {
  items?: MarqueeItem[];
  text?: string;
  enabled?: boolean;
}

export const MarqueeBanner: React.FC<MarqueeProps> = ({
  items,
  text,
  enabled = true,
}) => {
  if (!enabled) return null;

  const displayItems = items && items.length > 0
    ? items.filter((i) => i.active).map((i) => i.text)
    : [text || DEFAULT_MARQUEE_TEXT];

  return (
    <div
      id="nwani-top-marquee"
      className="bg-stone-950 border-b border-amber-500/20 text-xs py-2 px-3 sm:px-6 relative z-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Scrolling text */}
        <div className="flex-1 overflow-hidden relative">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-8 text-stone-300 font-medium tracking-wide">
            {displayItems.map((itemText, idx) => (
              <React.Fragment key={idx}>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                    Nwani Imóveis:
                  </span>
                  {itemText}
                </span>
                <span className="text-amber-500/40">•</span>
                <span className="text-stone-400">Atendimento oficial: Maianga, Luanda, Angola</span>
                <span className="text-amber-500/40">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            id="marquee-btn-call"
            href={PHONE_TEL_LINK}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 hover:border-amber-500/40 text-[11px] font-medium transition-colors"
            title="Ligar Agora"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Ligar</span>
          </a>
          <a
            id="marquee-btn-whatsapp"
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/40 text-[11px] font-medium transition-colors"
            title="Falar no WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const Marquee = MarqueeBanner;
