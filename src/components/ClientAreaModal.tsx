import React, { useState } from "react";
import {
  X,
  Heart,
  Bell,
  Sliders,
  Trash2,
  ExternalLink,
  Building,
  CheckCircle2,
  Calendar,
  Eye,
  Plus
} from "lucide-react";
import { Property, PropertyAlert, SystemNotification, Category } from "../types";
import { formatCurrency } from "../utils/formatters";
import { createPropertyAlert, markNotificationAsRead } from "../services/dbService";

interface ClientAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "favorites" | "alerts" | "notifications";
  favoriteProperties: Property[];
  onRemoveFavorite: (propId: string) => void;
  onViewPropertyDetails: (prop: Property) => void;
  categories: Category[];
  notifications: SystemNotification[];
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
  currentTheme?: "dark" | "light";
}

export const ClientAreaModal: React.FC<ClientAreaModalProps> = ({
  isOpen,
  onClose,
  initialTab = "favorites",
  favoriteProperties,
  onRemoveFavorite,
  onViewPropertyDetails,
  categories,
  notifications,
  onShowToast,
  currentTheme = "dark",
}) => {
  const [activeTab, setActiveTab] = useState<"favorites" | "alerts" | "notifications">(initialTab);

  // Alert form state
  const [alertBusinessType, setAlertBusinessType] = useState<"Venda" | "Arrendamento">("Venda");
  const [alertCategory, setAlertCategory] = useState("");
  const [alertProvince, setAlertProvince] = useState("Luanda");
  const [alertMunicipality, setAlertMunicipality] = useState("");
  const [alertNeighborhood, setAlertNeighborhood] = useState("");
  const [alertBedrooms, setAlertBedrooms] = useState<number | undefined>();
  const [alertMinPrice, setAlertMinPrice] = useState<number | undefined>();
  const [alertMaxPrice, setAlertMaxPrice] = useState<number | undefined>();
  const [alertContact, setAlertContact] = useState("");
  const [alertClientName, setAlertClientName] = useState("");
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);

  if (!isOpen) return null;

  const handleCreateAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertContact.trim()) {
      onShowToast("Por favor, insira o seu contacto telefónico ou WhatsApp.", "error");
      return;
    }

    setIsSubmittingAlert(true);
    try {
      await createPropertyAlert({
        businessType: alertBusinessType,
        category: alertCategory || undefined,
        province: alertProvince || undefined,
        municipality: alertMunicipality || undefined,
        neighborhood: alertNeighborhood || undefined,
        bedrooms: alertBedrooms || undefined,
        minPrice: alertMinPrice || undefined,
        maxPrice: alertMaxPrice || undefined,
        contact: alertContact.trim(),
        clientName: alertClientName.trim() || undefined,
      });

      onShowToast("Alerta personalizado criado com sucesso! Iremos notificá-lo logo que surgir uma oportunidade correspondente.", "success");
      // Reset form
      setAlertMunicipality("");
      setAlertNeighborhood("");
      setAlertMaxPrice(undefined);
    } catch (err) {
      console.error("Error creating alert:", err);
      onShowToast("Erro ao criar alerta. Tente novamente.", "error");
    } finally {
      setIsSubmittingAlert(false);
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      id="client-area-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        id="client-area-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl rounded-3xl overflow-hidden border shadow-2xl relative my-8 max-h-[92vh] flex flex-col ${
          currentTheme === "dark"
            ? "bg-stone-900 border-stone-800 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        {/* Header with Tabs */}
        <div className="p-4 sm:p-6 border-b border-stone-800/80 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-100">
              Área do Cliente
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-800 pb-1">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "favorites"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-950 text-stone-400 hover:text-stone-200"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Meus Favoritos ({favoriteProperties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("alerts")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "alerts"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-950 text-stone-400 hover:text-stone-200"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Criar Alerta</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold relative transition-all ${
                activeTab === "notifications"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-950 text-stone-400 hover:text-stone-200"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notificações</span>
              {unreadNotifsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          {/* TAB 1: MEUS FAVORITOS */}
          {activeTab === "favorites" && (
            <div>
              {favoriteProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProperties.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-stone-950 border border-stone-800 rounded-2xl flex items-center gap-3.5 hover:border-amber-500/40 transition-colors"
                    >
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"}
                        alt={p.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-amber-400 font-bold block">
                          {p.code} • {p.businessType}
                        </span>
                        <h4 className="font-semibold text-xs text-stone-100 truncate mt-0.5">
                          {p.title}
                        </h4>
                        <span className="text-xs font-bold text-amber-300 block mt-1">
                          {formatCurrency(p.price, p.currency)}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              onClose();
                              onViewPropertyDetails(p);
                            }}
                            className="text-[11px] font-semibold text-stone-300 hover:text-amber-400 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Ver</span>
                          </button>
                          <span className="text-stone-700">•</span>
                          <button
                            onClick={() => onRemoveFavorite(p.id)}
                            className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remover</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-stone-400 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-stone-800 flex items-center justify-center mx-auto text-stone-500">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-stone-200">Nenhum favorito guardado</h3>
                  <p className="text-xs max-w-sm mx-auto">
                    Ao navegar pelo catálogo da Nwani Imóveis, clique no ícone de coração nos imóveis de seu interesse para guardá-los nesta lista.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CRIAR ALERTA */}
          {activeTab === "alerts" && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Encontre o Imóvel Exato dos Seus Sonhos
                </h4>
                <p className="text-xs text-stone-300">
                  Defina os critérios desejados (ex: Vivenda T3 em Talatona até 150.000.000 Kz). Logo que um imóvel com essas características for cadastrado, avisaremos você imediatamente.
                </p>
              </div>

              <form onSubmit={handleCreateAlertSubmit} className="space-y-4 bg-stone-950 p-5 rounded-2xl border border-stone-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Business Type */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Tipo de Negócio *</label>
                    <select
                      value={alertBusinessType}
                      onChange={(e) => setAlertBusinessType(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Venda">Comprar (Venda)</option>
                      <option value="Arrendamento">Arrendar</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Categoria</label>
                    <select
                      value={alertCategory}
                      onChange={(e) => setAlertCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="">Qualquer Categoria</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Província</label>
                    <select
                      value={alertProvince}
                      onChange={(e) => setAlertProvince(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Luanda">Luanda</option>
                      <option value="Malanje">Malanje</option>
                      <option value="Benguela">Benguela</option>
                      <option value="Huíla">Huíla</option>
                    </select>
                  </div>

                  {/* Municipality */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Município Pretendido</label>
                    <input
                      type="text"
                      value={alertMunicipality}
                      onChange={(e) => setAlertMunicipality(e.target.value)}
                      placeholder="Ex: Talatona, Maianga, Belas..."
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Neighborhood */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Bairro / Zona</label>
                    <input
                      type="text"
                      value={alertNeighborhood}
                      onChange={(e) => setAlertNeighborhood(e.target.value)}
                      placeholder="Ex: Alvalade, Miramar, Lar do Patriota..."
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Quartos Mínimos</label>
                    <input
                      type="number"
                      value={alertBedrooms || ""}
                      onChange={(e) => setAlertBedrooms(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Ex: 3"
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Max Price */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Orçamento Máximo (Kz)</label>
                    <input
                      type="number"
                      value={alertMaxPrice || ""}
                      onChange={(e) => setAlertMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Ex: 150.000.000"
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Contact details */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Seu Nome</label>
                    <input
                      type="text"
                      value={alertClientName}
                      onChange={(e) => setAlertClientName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Contacto WhatsApp / Telefone *</label>
                    <input
                      type="tel"
                      value={alertContact}
                      onChange={(e) => setAlertContact(e.target.value)}
                      placeholder="Ex: +244 939 325 804"
                      required
                      className="w-full px-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingAlert}
                    className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-md transition-colors"
                  >
                    {isSubmittingAlert ? "A registar alerta..." : "Registar Alerta Imobiliário"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: NOTIFICAÇÕES */}
          {activeTab === "notifications" && (
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
                      notif.read
                        ? "bg-stone-950/60 border-stone-800/60 text-stone-400"
                        : "bg-stone-950 border-amber-500/40 text-stone-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-stone-100 flex items-center gap-2">
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                        <span>{notif.title}</span>
                      </h4>
                      <span className="text-[10px] text-stone-500">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{notif.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-stone-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-stone-600" />
                  <p className="text-xs">Não possui notificações no momento.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
