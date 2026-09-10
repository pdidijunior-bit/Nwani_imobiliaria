import React, { useState } from "react";
import {
  Heart,
  Bed,
  Bath,
  Maximize,
  MapPin,
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Property } from "../types";
import { formatCurrency, createPropertyWhatsAppLink } from "../utils/formatters";

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (propId: string) => void;
  onViewDetails: (prop: Property) => void;
  currentTheme?: "dark" | "light";
}

export const PropertyCard: React.FC<PropertyCardProps> = React.memo(({
  property,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  currentTheme = "dark",
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(property.id);
  };

  const whatsAppUrl = createPropertyWhatsAppLink(property.title, property.code);

  const statusColors: Record<string, string> = {
    "Disponível": "bg-emerald-500/90 text-stone-950 border-emerald-400",
    "Reservado": "bg-amber-500/90 text-stone-950 border-amber-400",
    "Vendido": "bg-rose-500/90 text-white border-rose-400",
    "Arrendado": "bg-blue-500/90 text-white border-blue-400",
  };

  return (
    <div
      id={`property-card-${property.code}`}
      onClick={() => onViewDetails(property)}
      className={`group rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer transform-gpu ${
        currentTheme === "dark"
          ? "bg-stone-900/80 border-stone-800 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
          : "bg-white border-stone-200 hover:border-amber-400 hover:shadow-xl"
      }`}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
        <img
          src={images[activeImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Business Type Badge */}
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-stone-950/85 backdrop-blur-md text-amber-300 border border-amber-500/40">
              {property.businessType}
            </span>

            {/* Status Badge */}
            <span
              className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                statusColors[property.status] || "bg-stone-800 text-stone-200 border-stone-700"
              }`}
            >
              {property.status}
            </span>

            {/* Featured Badge */}
            {property.isFeatured && (
              <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-sm">
                Destaque
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="p-2 rounded-full bg-stone-950/75 hover:bg-stone-900 backdrop-blur-md border border-stone-700 text-stone-200 pointer-events-auto transition-transform active:scale-90"
            title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            aria-label="Favorito"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? "text-rose-500 fill-rose-500" : "text-stone-300 hover:text-rose-400"
              }`}
            />
          </button>
        </div>

        {/* Image Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-stone-950/60 hover:bg-stone-900/90 text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-stone-950/60 hover:bg-stone-900/90 text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeImageIndex ? "w-4 bg-amber-400" : "bg-stone-400/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Property Official Code */}
        <div className="absolute bottom-2 left-3 z-10">
          <span className="px-2 py-0.5 rounded bg-stone-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-stone-300 border border-stone-800">
            {property.code}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              {property.neighborhood}, {property.municipality} • {property.province}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`font-semibold text-base line-clamp-1 mb-2.5 transition-colors ${
              currentTheme === "dark" ? "text-stone-100 group-hover:text-amber-300" : "text-stone-900 group-hover:text-amber-600"
            }`}
          >
            {property.title}
          </h3>

          {/* Specifications (Quartos, Casas de Banho, Área) */}
          <div className="flex items-center gap-4 py-2 border-y border-stone-800/60 text-xs text-stone-400 mb-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5" title={`${property.bedrooms} Quartos`}>
                <Bed className="w-3.5 h-3.5 text-stone-500" />
                <span>{property.bedrooms} Quartos</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5" title={`${property.bathrooms} Casas de Banho`}>
                <Bath className="w-3.5 h-3.5 text-stone-500" />
                <span>{property.bathrooms} Banheiros</span>
              </div>
            )}
            {property.area > 0 && (
              <div className="flex items-center gap-1.5" title={`${property.area} m² de área`}>
                <Maximize className="w-3.5 h-3.5 text-stone-500" />
                <span>{property.area} m²</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-4">
            <div>
              <span className="font-serif-luxury text-xl font-extrabold text-amber-400 block leading-none">
                {formatCurrency(property.price, property.currency)}
              </span>
              {property.businessType === "Arrendamento" && (
                <span className="text-[11px] text-stone-400">/mês</span>
              )}
            </div>

            {property.negotiable && (
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Negociável
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* View details button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(property);
              }}
              className="w-full py-2 px-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Detalhes</span>
            </button>

            {/* Official WhatsApp button */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Conversar sobre este imóvel no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
