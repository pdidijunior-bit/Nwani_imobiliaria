import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Car,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  Copy,
  Check
} from "lucide-react";
import { Property } from "../types";
import { formatCurrency, createPropertyWhatsAppLink } from "../utils/formatters";
import { PHONE_DISPLAY, PHONE_TEL_LINK, WHATSAPP_LINK } from "../constants/config";

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenChatWithProperty: (prop: Property) => void;
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
  currentTheme?: "dark" | "light";
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenChatWithProperty,
  onShowToast,
  currentTheme = "dark",
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  useEffect(() => {
    setActiveImageIndex(0);
    setShowScheduleModal(false);
  }, [property]);

  if (!isOpen || !property) return null;

  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  const whatsAppUrl = createPropertyWhatsAppLink(property.title, property.code);

  const handleShare = async () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/?imovel=${property.code}`
      : `https://www.nwaniimoveis.com/?imovel=${property.code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${property.title} | Nwani Imóveis`,
          text: `Confira este imóvel da Nwani Imóveis em ${property.neighborhood}, ${property.municipality} (${property.code})`,
          url,
        });
        onShowToast("Imóvel compartilhado com sucesso!", "success");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          fallbackCopyLink(url);
        }
      }
    } else {
      fallbackCopyLink(url);
    }
  };

  const fallbackCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    onShowToast("Link do imóvel copiado para a área de transferência!", "success");
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      onShowToast("Por favor, preencha o seu nome e telefone.", "error");
      return;
    }

    const scheduleMsg = `Olá, gostaria de agendar uma visita para o imóvel da Nwani Imóveis:\nImóvel: ${property.title}\nCódigo: ${property.code}\nNome: ${clientName}\nTelefone: ${clientPhone}\nData pretendida: ${preferredDate || "A combinar"}`;
    const scheduleUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(scheduleMsg)}`;
    window.open(scheduleUrl, "_blank");
    setShowScheduleModal(false);
    onShowToast("Solicitação de agendamento encaminhada para o WhatsApp oficial!", "success");
  };

  return (
    <div
      id="property-detail-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        id="property-detail-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl rounded-3xl overflow-hidden border shadow-2xl relative my-auto sm:my-8 max-h-[96vh] sm:max-h-[92vh] flex flex-col ${
          currentTheme === "dark"
            ? "bg-stone-900 border-stone-800 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-800/80 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {property.code}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-stone-800 text-stone-300">
              {property.businessType}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
              {property.status}
            </span>
            {property.isFeatured && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950">
                Destaque
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite toggle */}
            <button
              onClick={() => onToggleFavorite(property.id)}
              className="p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
              title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "text-rose-500 fill-rose-500" : ""}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
              title="Partilhar Imóvel"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close modal */}
            <button
              id="property-modal-close-btn"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Main Gallery with Lightbox/Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-950/70 hover:bg-stone-900 text-white backdrop-blur-md"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-950/70 hover:bg-stone-900 text-white backdrop-blur-md"
                    aria-label="Foto seguinte"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-stone-950/80 text-xs font-semibold text-stone-200 backdrop-blur-md">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex
                        ? "border-amber-400 scale-105 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title and Key Highlights */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold mb-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {property.neighborhood}, {property.municipality} • {property.province}
                </span>
                {property.reference && (
                  <span className="text-stone-400">({property.reference})</span>
                )}
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                {property.title}
              </h2>
            </div>

            {/* Price Box */}
            <div className="text-left md:text-right shrink-0 bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
              <span className="text-xs text-stone-400 block font-medium">Valor Solicitado</span>
              <span className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-amber-400 block">
                {formatCurrency(property.price, property.currency)}
              </span>
              {property.negotiable && (
                <span className="text-xs text-emerald-400 font-semibold inline-block mt-0.5">
                  Preço Negociável
                </span>
              )}
            </div>
          </div>

          {/* Property Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <Bed className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-[11px] text-stone-400 block">Quartos</span>
                <span className="font-bold text-sm text-stone-100">{property.bedrooms} Quartos</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <Bath className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-[11px] text-stone-400 block">Banheiros</span>
                <span className="font-bold text-sm text-stone-100">{property.bathrooms} Casas de Banho</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <Maximize className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-[11px] text-stone-400 block">Área Útil</span>
                <span className="font-bold text-sm text-stone-100">{property.area} m²</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <Car className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-[11px] text-stone-400 block">Estacionamento</span>
                <span className="font-bold text-sm text-stone-100">{property.parking || "—"} Vagas</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-stone-100 mb-2 font-serif-luxury">Descrição do Imóvel</h3>
            <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line bg-stone-950/40 p-4 rounded-2xl border border-stone-800/60">
              {property.description}
            </p>
          </div>

          {/* Features / Amenities Checklist */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-stone-100 mb-3 font-serif-luxury">Comodidades & Diferenciais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {property.features.map((feat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-950/50 border border-stone-800/60 text-xs font-medium text-stone-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Player if provided */}
          {property.videoUrl && (
            <div>
              <h3 className="text-base font-bold text-stone-100 mb-3 font-serif-luxury flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-400" />
                <span>Vídeo Apresentação</span>
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
                {property.videoUrl.includes("youtube.com") || property.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={property.videoUrl.replace("watch?v=", "embed/")}
                    title="Vídeo do Imóvel"
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={property.videoUrl} controls className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          )}

          {/* Schedule Visit Inline Form Modal */}
          {showScheduleModal && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Agendamento de Visita Presencial</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="text-stone-400 hover:text-stone-200 text-xs"
                >
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Seu Nome Completo *"
                  required
                  className="px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Seu Telefone / WhatsApp *"
                  required
                  className="px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
                <div className="sm:col-span-3 flex justify-end gap-2">
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md"
                  >
                    Confirmar Agendamento no WhatsApp
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Sticky Actions Footer */}
        <div className="p-4 sm:p-6 border-t border-stone-800/80 bg-stone-950/90 shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Call button */}
            <a
              id="detail-modal-btn-call"
              href={PHONE_TEL_LINK}
              className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Ligar ({PHONE_DISPLAY})</span>
            </a>

            {/* Chat online button */}
            <button
              id="detail-modal-btn-chat"
              type="button"
              onClick={() => {
                onClose();
                onOpenChatWithProperty(property);
              }}
              className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span>Chat Online</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Schedule Visit trigger */}
            <button
              id="detail-modal-btn-schedule"
              type="button"
              onClick={() => setShowScheduleModal(!showScheduleModal)}
              className="py-2.5 px-4 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Visita</span>
            </button>

            {/* Official WhatsApp button */}
            <a
              id="detail-modal-btn-whatsapp"
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-extrabold flex items-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
