import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Eye,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building,
  CheckCircle2
} from "lucide-react";
import { Property, BusinessType, Category } from "../types";
import {
  COMPANY_NAME,
  WHATSAPP_LINK,
  PHONE_TEL_LINK
} from "../constants/config";
import { formatCurrency, createPropertyWhatsAppLink } from "../utils/formatters";

interface HeroProps {
  slides?: any[];
  title?: string;
  subtitle?: string;
  totalProperties?: number;
  totalProvinces?: number;
  categories?: Category[];
  properties?: Property[];
  onViewProperty?: (property: Property) => void;
  onSearch?: (filters: {
    query: string;
    businessType?: BusinessType;
    category?: string;
    province?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  onExploreCatalog?: () => void;
  currentTheme?: "dark" | "light";
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  totalProperties = 0,
  totalProvinces = 0,
  properties = [],
  onViewProperty,
  onExploreCatalog,
}) => {
  // Filter featured properties for the animated showcase; fallback to first properties
  const featuredList = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    const featured = properties.filter((p) => p.isFeatured);
    return featured.length > 0 ? featured : properties.slice(0, 6);
  }, [properties]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Auto-slide every 4.5 seconds with pause on hover
  useEffect(() => {
    if (featuredList.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setSlideDirection("next");
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
      setAnimKey((prev) => prev + 1);
    }, 4500);

    return () => clearInterval(timer);
  }, [featuredList.length, isPaused]);

  // Reset index if list length changes and index is out of bounds
  useEffect(() => {
    if (currentIndex >= featuredList.length && featuredList.length > 0) {
      setCurrentIndex(0);
    }
  }, [featuredList.length, currentIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (featuredList.length <= 1) return;
    setSlideDirection("prev");
    setCurrentIndex((prev) => (prev === 0 ? featuredList.length - 1 : prev - 1));
    setAnimKey((prev) => prev + 1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (featuredList.length <= 1) return;
    setSlideDirection("next");
    setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    setAnimKey((prev) => prev + 1);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setSlideDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
    setAnimKey((prev) => prev + 1);
  };

  const handleExplore = () => {
    if (typeof onExploreCatalog === "function") {
      onExploreCatalog();
    } else {
      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentProperty = featuredList[currentIndex];
  const whatsAppUrl = currentProperty
    ? createPropertyWhatsAppLink(currentProperty.title, currentProperty.code)
    : WHATSAPP_LINK;

  return (
    <section
      id="hero-section"
      className="relative bg-slate-950 text-white overflow-hidden py-12 sm:py-16 lg:py-20 border-b border-slate-800 w-full max-w-full"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(15, 23, 42, 0.84) 0%, rgba(10, 15, 30, 0.92) 50%, rgba(2, 6, 23, 0.98) 100%), url('/vivenda-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Dynamic atmospheric subtle gold and cyan glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 drop-shadow-lg">
            <span className="block text-white text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase">
              {title || COMPANY_NAME}
            </span>
          </h1>

          <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-md">
            {subtitle ||
              "Encontre vivendas, apartamentos, escritórios, terrenos e oportunidades de investimento em Luanda e em todo o território nacional com rigor, agilidade e máxima segurança legal."}
          </p>

          {/* Quick Direct Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              id="hero-quick-whatsapp"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Fale Connosco</span>
            </a>
            <a
              id="hero-quick-call"
              href={PHONE_TEL_LINK}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Ligar Agora</span>
            </a>
          </div>
        </div>

        {/* Animated Featured Properties Showcase (Replaces the redundant search bar div) */}
        {featuredList.length > 0 && currentProperty && (
          <div
            className="max-w-4xl mx-auto bg-slate-900/90 border border-amber-500/40 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 shadow-2xl shadow-amber-500/10 relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Top Showcase Status Header & Controls */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Imóveis em Destaque Exclusivo</span>
                </span>
              </div>

              {/* Slide Counter & Arrow Navigation Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-stone-400">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(featuredList.length).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-amber-500 hover:text-stone-950 text-stone-300 border border-stone-800 hover:border-amber-400 transition-colors cursor-pointer"
                    title="Imóvel anterior"
                    aria-label="Imóvel anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-amber-500 hover:text-stone-950 text-stone-300 border border-stone-800 hover:border-amber-400 transition-colors cursor-pointer"
                    title="Próximo imóvel"
                    aria-label="Próximo imóvel"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Animated Content Container with enter/exit keyframes */}
            <div
              key={`showcase-slide-${currentProperty.id}-${animKey}`}
              className={slideDirection === "next" ? "animate-showcase-next" : "animate-showcase-prev"}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Photo Container: Dual layer for 100% full view without cropping */}
                <div
                  className="md:col-span-6 relative aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-stone-800/80 cursor-pointer group"
                  onClick={() => onViewProperty?.(currentProperty)}
                >
                  {/* Ambient backdrop glow */}
                  <img
                    src={currentProperty.images?.[0] || "/placeholder-property.jpg"}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-35 pointer-events-none"
                  />

                  {/* Foreground Photo 100% full-view */}
                  <img
                    src={currentProperty.images?.[0] || "/placeholder-property.jpg"}
                    alt={currentProperty.title}
                    className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                    loading="eager"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-20 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-stone-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                      {currentProperty.businessType}
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-sm">
                      Destaque
                    </span>
                  </div>

                  {/* Property Official Code */}
                  <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-stone-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-stone-300 border border-stone-800">
                      {currentProperty.code}
                    </span>
                  </div>
                </div>

                {/* Property Information & Action Details */}
                <div className="md:col-span-6 flex flex-col justify-between h-full space-y-3.5">
                  <div>
                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">
                        {currentProperty.neighborhood}, {currentProperty.municipality} • {currentProperty.province}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onViewProperty?.(currentProperty)}
                      className="text-lg sm:text-xl font-bold text-white hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer mb-2"
                    >
                      {currentProperty.title}
                    </h3>

                    {/* Description Excerpt */}
                    <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed mb-3">
                      {currentProperty.description}
                    </p>

                    {/* Specifications Row */}
                    <div className="flex items-center gap-3 py-2 border-y border-stone-800/80 text-xs text-stone-300">
                      {currentProperty.bedrooms > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-amber-400" />
                          <span>{currentProperty.bedrooms} Quartos</span>
                        </div>
                      )}
                      {currentProperty.bathrooms > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-3.5 h-3.5 text-amber-400" />
                          <span>{currentProperty.bathrooms} Banheiros</span>
                        </div>
                      )}
                      {currentProperty.area > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Maximize className="w-3.5 h-3.5 text-amber-400" />
                          <span>{currentProperty.area} m²</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-3">
                      <div>
                        <span className="font-serif-luxury text-2xl sm:text-3xl font-black text-amber-400 block leading-tight">
                          {formatCurrency(currentProperty.price, currentProperty.currency)}
                        </span>
                        {currentProperty.businessType === "Arrendamento" && (
                          <span className="text-[11px] text-stone-400">/mês</span>
                        )}
                      </div>

                      {currentProperty.negotiable && (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          Negociável
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onViewProperty?.(currentProperty)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4 stroke-[2.5]" />
                        <span>Ver Imóvel</span>
                      </button>

                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                        title="Conversar no WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Dots Navigation & Link to Catalog Search */}
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5">
                {featuredList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? "w-6 bg-gradient-to-r from-amber-500 to-amber-400"
                        : "w-2 bg-stone-700 hover:bg-stone-500"
                    }`}
                    title={`Ir para destaque ${idx + 1}`}
                    aria-label={`Ir para destaque ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Quick Jump link to catalog smart search */}
              <button
                type="button"
                onClick={handleExplore}
                className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
              >
                <span>Pesquisar e filtrar todos os {totalProperties} imóveis</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* Real Dynamic Metrics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/70 border border-stone-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-serif-luxury">
              {totalProperties}
            </span>
            <span className="text-xs text-stone-400 uppercase font-semibold tracking-wider mt-1 block">Imóveis Ativos</span>
          </div>

          <div className="bg-slate-900/70 border border-stone-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-serif-luxury">
              {totalProvinces}
            </span>
            <span className="text-xs text-stone-400 uppercase font-semibold tracking-wider mt-1 block">Províncias</span>
          </div>

          <div className="bg-slate-900/70 border border-stone-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-serif-luxury">
              100%
            </span>
            <span className="text-xs text-stone-400 uppercase font-semibold tracking-wider mt-1 block">Legalidade & Rigor</span>
          </div>

          <div className="bg-slate-900/70 border border-stone-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block font-serif-luxury">
              24h
            </span>
            <span className="text-xs text-stone-400 uppercase font-semibold tracking-wider mt-1 block">WhatsApp Ativo</span>
          </div>
        </div>
      </div>
    </section>
  );
};
