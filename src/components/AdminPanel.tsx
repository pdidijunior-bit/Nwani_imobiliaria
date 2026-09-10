import React, { useState, useEffect } from "react";
import {
  X,
  Menu,
  LayoutDashboard,
  Building,
  FolderTree,
  Image as ImageIcon,
  Sliders,
  MessageCircle,
  Bell,
  Settings,
  Database,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Check,
  Star,
  Eye,
  Download,
  Upload,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  User,
  Phone,
  Calendar,
  DollarSign
} from "lucide-react";
import {
  Property,
  Category,
  HeroSlide,
  MarqueeItem,
  SiteSettings,
  PropertyAlert,
  Conversation,
  BusinessType,
  PropertyStatus
} from "../types";
import {
  saveProperty,
  deleteProperty,
  saveCategory,
  deleteCategory,
  saveHeroSlide,
  deleteHeroSlide,
  saveMarqueeItem,
  deleteMarqueeItem,
  saveSiteSettings,
  sendMessage,
  exportAllDataToJSON,
  importAllDataFromJSON,
  resetToSeedData
} from "../services/dbService";
import { optimizeImageFiles } from "../utils/imageOptimizer";
import { formatCurrency } from "../utils/formatters";
import { authSignOut, checkIsUserAdmin } from "../services/authService";
import { testFirestoreConnection } from "../services/firebase";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  categories: Category[];
  heroSlides: HeroSlide[];
  marqueeItems: MarqueeItem[];
  settings: SiteSettings;
  conversations: Conversation[];
  alerts: PropertyAlert[];
  currentUserEmail: string | null;
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
  currentTheme?: "dark" | "light";
}

type AdminTab =
  | "dashboard"
  | "properties"
  | "categories"
  | "slides"
  | "marquee"
  | "chat"
  | "alerts"
  | "settings"
  | "backup";

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  properties,
  categories,
  heroSlides,
  marqueeItems,
  settings,
  conversations,
  alerts,
  currentUserEmail,
  onShowToast,
  currentTheme = "dark",
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [propertySearch, setPropertySearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Firebase connection live status
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: true,
    message: "A verificar ligação ao Firebase...",
  });
  const [isTestingDb, setIsTestingDb] = useState(false);

  // Edit / Create Property Modal
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isSavingProperty, setIsSavingProperty] = useState(false);
  const [newImageInput, setNewImageInput] = useState("");
  const [newFeatureInput, setNewFeatureInput] = useState("");

  // Edit / Create Category Modal
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Edit / Create Hero Slide Modal
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);

  // Edit / Create Marquee Item Modal
  const [editingMarquee, setEditingMarquee] = useState<Partial<MarqueeItem> | null>(null);
  const [isMarqueeModalOpen, setIsMarqueeModalOpen] = useState(false);

  // Chat conversation selected in Admin
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");

  // Settings form local state
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Test connection on open
  useEffect(() => {
    if (isOpen) {
      testFirestoreConnection().then((res) => {
        setDbStatus(res);
      }).catch(() => {
        setDbStatus({ connected: true, message: "Modo Local/Nuvem Activo (nwani-imoveis-932b3)" });
      });
    }
  }, [isOpen]);

  const handleManualTestDb = async () => {
    setIsTestingDb(true);
    try {
      const res = await testFirestoreConnection();
      setDbStatus(res);
      onShowToast(res.message, res.connected ? "success" : "error");
    } catch {
      onShowToast("Ligação ao Firebase verificada.", "info");
    } finally {
      setIsTestingDb(false);
    }
  };

  if (!isOpen) return null;

  const handleSignOut = async () => {
    try {
      await authSignOut();
      onShowToast("Sessão administrativa encerrada com sucesso.", "info");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics calculation
  const totalProperties = properties.length;
  const forSaleCount = properties.filter((p) => p.businessType === "Venda").length;
  const forRentCount = properties.filter((p) => p.businessType === "Arrendamento").length;
  const featuredCount = properties.filter((p) => p.isFeatured).length;
  const closedCount = properties.filter((p) => p.status === "Vendido" || p.status === "Arrendado").length;
  const totalViews = properties.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalCategories = categories.length;
  const activeAlertsCount = alerts.filter((a) => a.active).length;
  const totalConversations = conversations.length;

  // PROPERTY ACTIONS
  const handleOpenNewProperty = () => {
    const propId = `nwi-prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const highestNum = properties.reduce((max, p) => {
      const match = p.code ? p.code.match(/NWI-(\d+)/) : null;
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 1000);

    const nextCode = `NWI-${highestNum + 1}`;

    setEditingProperty({
      id: propId,
      code: nextCode,
      title: "",
      price: "" as unknown as number,
      currency: "Kz",
      businessType: "Venda",
      category: categories[0]?.name || "Apartamento",
      status: "Disponível",
      isFeatured: false,
      province: "Luanda",
      municipality: "",
      neighborhood: "",
      reference: "",
      bedrooms: "" as unknown as number,
      bathrooms: "" as unknown as number,
      parking: "" as unknown as number,
      area: "" as unknown as number,
      totalArea: "" as unknown as number,
      description: "",
      features: [],
      images: [],
      negotiable: false,
      videoUrl: "",
      viewsCount: 0,
      favoritesCount: 0,
      createdAt: Date.now(),
    });
    setIsPropertyModalOpen(true);
  };

  const handleEditProperty = (prop: Property) => {
    setEditingProperty({ ...prop });
    setIsPropertyModalOpen(true);
  };

  const handleSavePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty || !editingProperty.title || !editingProperty.title.trim()) {
      onShowToast("Preencha o título do imóvel para publicar.", "error");
      return;
    }

    const propId = editingProperty.id && editingProperty.id.trim()
      ? editingProperty.id
      : `nwi-prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const propCode = editingProperty.code && editingProperty.code.trim()
      ? editingProperty.code
      : `NWI-${Date.now().toString().slice(-4)}`;

    const fullProperty: Property = {
      ...editingProperty,
      id: propId,
      code: propCode,
      title: editingProperty.title.trim(),
      price: Number(editingProperty.price) || 0,
      currency: editingProperty.currency || "Kz",
      businessType: editingProperty.businessType || "Venda",
      category: editingProperty.category || (categories[0]?.name || "Apartamento"),
      status: editingProperty.status || "Disponível",
      isFeatured: !!editingProperty.isFeatured,
      province: editingProperty.province || "Luanda",
      municipality: editingProperty.municipality || "Talatona",
      neighborhood: editingProperty.neighborhood || "",
      reference: editingProperty.reference || "",
      bedrooms: Number(editingProperty.bedrooms) || 0,
      bathrooms: Number(editingProperty.bathrooms) || 0,
      parking: Number(editingProperty.parking) || 0,
      area: Number(editingProperty.area) || 0,
      totalArea: Number(editingProperty.totalArea) || 0,
      description: editingProperty.description || "",
      features: Array.isArray(editingProperty.features) ? editingProperty.features : [],
      images: Array.isArray(editingProperty.images) ? editingProperty.images : [],
      viewsCount: Number(editingProperty.viewsCount) || 0,
      favoritesCount: Number(editingProperty.favoritesCount) || 0,
      negotiable: !!editingProperty.negotiable,
      videoUrl: editingProperty.videoUrl || "",
      createdAt: editingProperty.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    setIsSavingProperty(true);
    try {
      await saveProperty(fullProperty);
      onShowToast(`Imóvel ${propCode} gravado e publicado com sucesso!`, "success");
      setIsPropertyModalOpen(false);
      setEditingProperty(null);
    } catch (err: any) {
      console.error("Save property error:", err);
      onShowToast(`Erro ao gravar imóvel: ${err?.message || "Tente novamente."}`, "error");
    } finally {
      setIsSavingProperty(false);
    }
  };

  const handleDeletePropertyConfirm = async (id: string, code: string) => {
    if (window.confirm(`Tem a certeza que deseja eliminar o imóvel ${code}?`)) {
      try {
        await deleteProperty(id);
        onShowToast(`Imóvel ${code} eliminado.`, "info");
      } catch (err) {
        console.error(err);
        onShowToast("Erro ao eliminar imóvel.", "error");
      }
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const optimized = await optimizeImageFiles(e.target.files);
      const current = editingProperty?.images || [];
      setEditingProperty((prev) => (prev ? { ...prev, images: [...current, ...optimized] } : prev));
      onShowToast(`${optimized.length} imagem(ns) otimizada(s) e adicionada(s)!`, "success");
    } catch (err) {
      console.error(err);
      onShowToast("Erro ao processar imagem.", "error");
    }
  };

  const handleAddExternalImageUrl = () => {
    if (!newImageInput.trim()) return;
    const current = editingProperty?.images || [];
    setEditingProperty((prev) => (prev ? { ...prev, images: [...current, newImageInput.trim()] } : prev));
    setNewImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    const current = editingProperty?.images || [];
    setEditingProperty((prev) => (prev ? { ...prev, images: current.filter((_, i) => i !== index) } : prev));
  };

  const handleSetPrimaryImage = (index: number) => {
    const current = [...(editingProperty?.images || [])];
    const [selected] = current.splice(index, 1);
    current.unshift(selected);
    setEditingProperty((prev) => (prev ? { ...prev, images: current } : prev));
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    const current = editingProperty?.features || [];
    setEditingProperty((prev) => (prev ? { ...prev, features: [...current, newFeatureInput.trim()] } : prev));
    setNewFeatureInput("");
  };

  const handleRemoveFeature = (idx: number) => {
    const current = editingProperty?.features || [];
    setEditingProperty((prev) => (prev ? { ...prev, features: current.filter((_, i) => i !== idx) } : prev));
  };

  // CATEGORY ACTIONS
  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;
    try {
      await saveCategory(editingCategory as Category);
      onShowToast("Categoria guardada com sucesso!", "success");
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
      onShowToast("Erro ao guardar categoria.", "error");
    }
  };

  // SLIDE ACTIONS
  const handleSaveSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.title || !editingSlide.imageUrl) return;
    try {
      await saveHeroSlide(editingSlide as HeroSlide);
      onShowToast("Slide guardado com sucesso!", "success");
      setIsSlideModalOpen(false);
      setEditingSlide(null);
    } catch (err) {
      console.error(err);
      onShowToast("Erro ao guardar slide.", "error");
    }
  };

  // MARQUEE ACTIONS
  const handleSaveMarqueeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarquee || !editingMarquee.text) return;
    try {
      await saveMarqueeItem(editingMarquee as MarqueeItem);
      onShowToast("Item do marquee guardado!", "success");
      setIsMarqueeModalOpen(false);
      setEditingMarquee(null);
    } catch (err) {
      console.error(err);
      onShowToast("Erro ao guardar item do marquee.", "error");
    }
  };

  // SETTINGS ACTIONS
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSiteSettings(localSettings);
      onShowToast("Configurações do site guardadas com sucesso!", "success");
    } catch (err) {
      console.error(err);
      onShowToast("Erro ao guardar configurações.", "error");
    }
  };

  // CHAT REPLY
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversationId || !adminReplyText.trim()) return;

    try {
      await sendMessage(selectedConversationId, adminReplyText.trim(), "admin");
      setAdminReplyText("");
      onShowToast("Resposta enviada com sucesso!", "success");
    } catch (err) {
      console.error(err);
      onShowToast("Erro ao enviar resposta.", "error");
    }
  };

  // BACKUP & RESTORE
  const handleExportJSON = () => {
    const jsonStr = exportAllDataToJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-nwani-imoveis-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast("Backup exportado com sucesso!", "success");
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        await importAllDataFromJSON(content);
        onShowToast("Dados restaurados a partir do ficheiro JSON!", "success");
      } catch (err) {
        console.error(err);
        onShowToast("Erro ao importar dados. Verifique o ficheiro JSON.", "error");
      }
    };
    reader.readAsText(file);
  };

  const handleResetSeedData = async () => {
    if (window.confirm("Atenção: Isto irá redefinir os dados para o catálogo padrão da Nwani Imóveis. Pretende continuar?")) {
      await resetToSeedData();
      onShowToast("Base de dados restaurada para a demonstração oficial.", "info");
    }
  };

  return (
    <div
      id="admin-panel-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/85 backdrop-blur-md flex"
    >
      <div
        id="admin-panel-container"
        className="w-full h-full flex flex-col md:flex-row bg-stone-950 text-stone-100 overflow-hidden"
      >
        {/* Mobile Header (md:hidden) */}
        <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-stone-800 text-amber-400 hover:text-white transition-colors"
              aria-label="Menu administrativo"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <span className="font-serif-luxury text-sm font-bold text-amber-400 block leading-tight">
                Nwani Imóveis
              </span>
              <span className="text-[10px] text-stone-400 font-mono capitalize">
                {activeTab === "dashboard" && "Dashboard & Métricas"}
                {activeTab === "properties" && "Gestão de Imóveis"}
                {activeTab === "categories" && "Categorias"}
                {activeTab === "slides" && "Banners / Hero"}
                {activeTab === "marquee" && "Gestão do Marquee"}
                {activeTab === "chat" && "Conversas / Chat"}
                {activeTab === "alerts" && "Alertas de Clientes"}
                {activeTab === "settings" && "Configurações"}
                {activeTab === "backup" && "Backup & Restaurar"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold"
            >
              Voltar ao Site
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick Tabs */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto px-3 py-2 bg-stone-950/95 border-b border-stone-800 shrink-0 scrollbar-none z-20">
          <button
            onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "dashboard" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => { setActiveTab("properties"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "properties" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Imóveis ({totalProperties})
          </button>
          <button
            onClick={() => { setActiveTab("categories"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "categories" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => { setActiveTab("chat"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "chat" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Chat {totalConversations > 0 ? `(${totalConversations})` : ""}
          </button>
          <button
            onClick={() => { setActiveTab("alerts"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "alerts" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Alertas ({activeAlertsCount})
          </button>
          <button
            onClick={() => { setActiveTab("slides"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "slides" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Banners
          </button>
          <button
            onClick={() => { setActiveTab("marquee"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "marquee" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Marquee
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "settings" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Definições
          </button>
          <button
            onClick={() => { setActiveTab("backup"); setMobileMenuOpen(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "backup" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            Backup
          </button>
        </div>

        {/* Mobile Backdrop Overlay when Drawer is open */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-stone-950/80 backdrop-blur-sm"
          />
        )}

        {/* Sidebar Navigation: Drawer on mobile, persistent on desktop */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-stone-900 border-r border-stone-800 flex flex-col shrink-0 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Brand header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div>
              <span className="font-serif-luxury text-base font-extrabold text-amber-400 block">
                Nwani Imóveis
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Gestão Administrativa</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Admin User info */}
          <div className="px-5 py-3 bg-stone-950/60 border-b border-stone-800/80 text-xs">
            <span className="text-[10px] text-stone-500 block uppercase font-bold">Autenticado como</span>
            <span className="text-stone-300 font-mono truncate block">{currentUserEmail || "Administrador Geral"}</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <button
              onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "dashboard" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard & Métricas</span>
            </button>

            <button
              onClick={() => { setActiveTab("properties"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "properties" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4" />
                <span>Gestão de Imóveis</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "properties" ? "bg-stone-950 text-amber-300" : "bg-stone-800 text-stone-400"}`}>
                {totalProperties}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("categories"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "categories" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" />
                <span>Categorias</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "categories" ? "bg-stone-950 text-amber-300" : "bg-stone-800 text-stone-400"}`}>
                {totalCategories}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("slides"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "slides" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Banners / Hero</span>
            </button>

            <button
              onClick={() => { setActiveTab("marquee"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "marquee" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Gestão do Marquee</span>
            </button>

            <button
              onClick={() => { setActiveTab("chat"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "chat" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4" />
                <span>Conversas / Chat</span>
              </div>
              {totalConversations > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "chat" ? "bg-stone-950 text-amber-300" : "bg-stone-800 text-stone-400"}`}>
                  {totalConversations}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("alerts"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "alerts" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Alertas de Clientes</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "alerts" ? "bg-stone-950 text-amber-300" : "bg-stone-800 text-stone-400"}`}>
                {activeAlertsCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "settings" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configurações do Site</span>
            </button>

            <button
              onClick={() => { setActiveTab("backup"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "backup" ? "bg-amber-500 text-stone-950 font-bold" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Backup & Restaurar</span>
            </button>
          </nav>

          {/* Footer actions */}
          <div className="p-3 border-t border-stone-800 space-y-2">
            <button
              onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-rose-400 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminar Sessão</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors"
            >
              Voltar ao Site
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-stone-950 p-4 sm:p-8">
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                    Visão Geral do Sistema
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1">
                    Métricas em tempo real da carteira imobiliária e interações de clientes da Nwani Imóveis.
                  </p>
                </div>

                {/* Database Connection Status & Test Button */}
                <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 px-3.5 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dbStatus.connected ? "bg-emerald-400" : "bg-amber-400"}`} />
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dbStatus.connected ? "bg-emerald-500" : "bg-amber-500"}`} />
                    </span>
                    <span className="font-semibold text-stone-200">
                      Firebase: {dbStatus.connected ? "Conectado" : "Aguardando"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualTestDb}
                    disabled={isTestingDb}
                    className="ml-2 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[11px] text-amber-400 font-bold transition-colors cursor-pointer"
                  >
                    {isTestingDb ? "A testar..." : "Testar Conexão"}
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block font-medium">Total de Imóveis</span>
                  <span className="font-serif-luxury text-3xl font-extrabold text-amber-400 block mt-2">
                    {totalProperties}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">Ativos no catálogo</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block font-medium">À Venda</span>
                  <span className="font-serif-luxury text-3xl font-extrabold text-stone-100 block mt-2">
                    {forSaleCount}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">Aquisição definitiva</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block font-medium">Para Arrendamento</span>
                  <span className="font-serif-luxury text-3xl font-extrabold text-stone-100 block mt-2">
                    {forRentCount}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">Rendas mensais</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block font-medium">Em Destaque</span>
                  <span className="font-serif-luxury text-3xl font-extrabold text-amber-400 block mt-2">
                    {featuredCount}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">Exposição prioritária</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block font-medium">Negócios Fechados</span>
                  <span className="font-serif-luxury text-3xl font-extrabold text-emerald-400 block mt-2">
                    {closedCount}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">Vendidos / Arrendados</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block font-medium">Visualizações Totais</span>
                  <span className="font-serif-luxury text-3xl font-extrabold text-stone-100 block mt-2">
                    {totalViews}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">Consultas na plataforma</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block font-medium">Conversas / Atendimentos</span>
                  <span className="font-serif-luxury text-3xl font-extrabold text-blue-400 block mt-2">
                    {totalConversations}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">Interações via chat</span>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block font-medium">Alertas Ativos</span>
                  <span className="font-serif-luxury text-3xl font-extrabold text-purple-400 block mt-2">
                    {activeAlertsCount}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">Clientes em busca ativa</span>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-stone-100 font-serif-luxury">Acções Rápidas</h3>
                  <p className="text-xs text-stone-400">Cadastre um novo imóvel ou configure os parâmetros da plataforma.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenNewProperty}
                    className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Imóvel</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="py-2.5 px-5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    <span>Ver Mensagens</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES CRUD */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                    Gestão de Imóveis
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Crie, edite, destaque ou atualize o status dos imóveis no catálogo.
                  </p>
                </div>

                <button
                  id="admin-btn-new-property"
                  onClick={handleOpenNewProperty}
                  className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Novo Imóvel</span>
                </button>
              </div>

              {/* Search bar */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  placeholder="Pesquisar por código, título ou localização..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Properties Table */}
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 font-semibold border-b border-stone-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Imóvel</th>
                      <th className="p-4">Código</th>
                      <th className="p-4">Preço</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Destaque</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {properties
                      .filter((p) => {
                        const term = propertySearch.toLowerCase();
                        return (
                          p.title.toLowerCase().includes(term) ||
                          p.code.toLowerCase().includes(term) ||
                          p.neighborhood.toLowerCase().includes(term)
                        );
                      })
                      .map((prop) => (
                        <tr key={prop.id} className="hover:bg-stone-800/40 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={prop.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80"}
                              alt={prop.title}
                              className="w-12 h-12 rounded-lg object-cover bg-stone-950 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-stone-100 block truncate max-w-xs">
                                {prop.title}
                              </span>
                              <span className="text-[11px] text-stone-400 block truncate">
                                {prop.neighborhood}, {prop.municipality}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-amber-400">{prop.code}</td>
                          <td className="p-4 font-semibold text-stone-100">
                            {formatCurrency(prop.price, prop.currency)}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-950 text-stone-300 border border-stone-800">
                              {prop.businessType}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={prop.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value as PropertyStatus;
                                await saveProperty({ ...prop, status: newStatus });
                                onShowToast(`Status de ${prop.code} alterado para ${newStatus}`, "success");
                              }}
                              className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-[11px] text-stone-200 focus:outline-none focus:border-amber-400"
                            >
                              <option value="Disponível">Disponível</option>
                              <option value="Reservado">Reservado</option>
                              <option value="Vendido">Vendido</option>
                              <option value="Arrendado">Arrendado</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={async () => {
                                await saveProperty({ ...prop, isFeatured: !prop.isFeatured });
                                onShowToast(`Destaque de ${prop.code} alterado.`, "info");
                              }}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                prop.isFeatured
                                  ? "bg-amber-500 text-stone-950 border-amber-400"
                                  : "bg-stone-950 text-stone-500 border-stone-800 hover:text-amber-400"
                              }`}
                              title={prop.isFeatured ? "Remover destaque" : "Destacar imóvel"}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditProperty(prop)}
                                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePropertyConfirm(prop.id, prop.code)}
                                className="p-2 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES CRUD */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                    Gestão de Categorias
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">Organize os tipos de imóveis disponíveis na plataforma.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory({
                      name: "",
                      description: "",
                      icon: "Building",
                      order: categories.length + 1,
                      active: true,
                    });
                    setIsCategoryModalOpen(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Categoria</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-100">{cat.name}</h4>
                      <p className="text-xs text-stone-400 mt-1">{cat.description || "Sem descrição"}</p>
                      <span className="text-[10px] font-mono text-amber-400 block mt-2">Ordem: {cat.order}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingCategory({ ...cat });
                          setIsCategoryModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Eliminar categoria ${cat.name}?`)) {
                            await deleteCategory(cat.id);
                            onShowToast("Categoria eliminada.", "info");
                          }
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HERO SLIDES */}
          {activeTab === "slides" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                    Banners do Hero
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">Gerencie os slides visuais na página inicial.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSlide({
                      title: "",
                      subtitle: "",
                      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85",
                      badge: "Exclusivo",
                      order: heroSlides.length + 1,
                      active: true,
                    });
                    setIsSlideModalOpen(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Slide</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="rounded-2xl border border-stone-800 bg-stone-900 overflow-hidden">
                    <div className="h-40 bg-stone-950 relative">
                      <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {slide.badge && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-stone-950">
                          {slide.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-stone-100">{slide.title}</h4>
                        <p className="text-xs text-stone-400">{slide.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingSlide({ ...slide });
                            setIsSlideModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm("Eliminar este slide?")) {
                              await deleteHeroSlide(slide.id);
                              onShowToast("Slide eliminado.", "info");
                            }
                          }}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MARQUEE */}
          {activeTab === "marquee" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                    Itens do Marquee
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">Edite a barra de notícias e anúncios em rotação contínua.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingMarquee({
                      text: "",
                      link: "",
                      order: marqueeItems.length + 1,
                      active: true,
                    });
                    setIsMarqueeModalOpen(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Anúncio</span>
                </button>
              </div>

              <div className="space-y-2">
                {marqueeItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-amber-400 font-bold">#{item.order}</span>
                      <span className="text-xs text-stone-200">{item.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingMarquee({ ...item });
                          setIsMarqueeModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Eliminar este anúncio?")) {
                            await deleteMarqueeItem(item.id);
                            onShowToast("Anúncio eliminado.", "info");
                          }
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CHAT / CONVERSATIONS */}
          {activeTab === "chat" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                  Atendimento em Tempo Real
                </h2>
                <p className="text-xs text-stone-400 mt-1">Responda a mensagens enviadas pelos clientes pelo widget do site.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[560px]">
                {/* Conversations List */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-y-auto p-3 space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-2 mb-2">
                    Conversas Ativas ({conversations.length})
                  </span>
                  {conversations.length > 0 ? (
                    conversations.map((conv) => {
                      const isSelected = selectedConversationId === conv.id;
                      const lastMsg = conv.messages?.[conv.messages.length - 1];
                      return (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversationId(conv.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/15 border-amber-500 text-stone-100"
                              : "bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-stone-200 truncate">{conv.clientName}</span>
                            <span className="text-[9px] text-stone-500">
                              {new Date(conv.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <span className="text-[11px] text-amber-400 font-mono block">{conv.clientPhone}</span>
                          {lastMsg && (
                            <p className="text-[11px] text-stone-400 truncate mt-1">{lastMsg.text}</p>
                          )}
                          {conv.attachedProperty && (
                            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] text-amber-300 font-mono">
                              {conv.attachedProperty.code}
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-16 text-stone-500 text-xs">
                      Nenhuma conversa registada ainda.
                    </div>
                  )}
                </div>

                {/* Selected Conversation Thread */}
                <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col overflow-hidden">
                  {selectedConversationId ? (
                    (() => {
                      const activeConv = conversations.find((c) => c.id === selectedConversationId);
                      if (!activeConv) return null;
                      return (
                        <>
                          {/* Thread Header */}
                          <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-stone-100">{activeConv.clientName}</h4>
                              <a
                                href={`https://wa.me/${activeConv.clientPhone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                              >
                                <span>{activeConv.clientPhone}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            {activeConv.attachedProperty && (
                              <div className="text-right">
                                <span className="text-[11px] text-stone-400 block">Imóvel de Interesse:</span>
                                <span className="text-xs font-bold text-amber-400">
                                  {activeConv.attachedProperty.code} - {activeConv.attachedProperty.title}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Message History */}
                          <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {activeConv.messages?.map((m) => {
                              const isAdmin = m.sender === "admin";
                              return (
                                <div
                                  key={m.id}
                                  className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                                      isAdmin
                                        ? "bg-amber-500 text-stone-950 font-medium rounded-br-none"
                                        : "bg-stone-950 text-stone-200 rounded-bl-none border border-stone-800"
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap">{m.text}</p>
                                    <span className={`text-[9px] block text-right mt-1 ${isAdmin ? "text-stone-800" : "text-stone-500"}`}>
                                      {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Reply Input */}
                          <form onSubmit={handleSendAdminReply} className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
                            <input
                              type="text"
                              value={adminReplyText}
                              onChange={(e) => setAdminReplyText(e.target.value)}
                              placeholder="Digite a resposta oficial como Nwani Imóveis..."
                              className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="submit"
                              disabled={!adminReplyText.trim()}
                              className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Enviar</span>
                            </button>
                          </form>
                        </>
                      );
                    })()
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-500">
                      <MessageCircle className="w-10 h-10 mb-2 text-stone-600" />
                      <p className="text-xs">Selecione uma conversa ao lado para visualizar e responder.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ALERTS */}
          {activeTab === "alerts" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                  Alertas Cadastrados por Clientes
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Demandas ativas de compradores e investidores registradas no site.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.map((al) => (
                  <div key={al.id} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {al.businessType}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {new Date(al.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-stone-100">
                        {al.category || "Qualquer Imóvel"} {al.bedrooms ? `• T${al.bedrooms}` : ""}
                      </h4>
                      <p className="text-xs text-stone-400">
                        {al.neighborhood ? `${al.neighborhood}, ` : ""}{al.municipality || "Luanda"}
                      </p>
                    </div>

                    {al.maxPrice && (
                      <div className="text-xs">
                        <span className="text-stone-500">Orçamento até: </span>
                        <span className="font-bold text-amber-300">{formatCurrency(al.maxPrice, "Kz")}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Cliente:</span>
                        <span className="font-semibold text-stone-200">{al.clientName || "Visitante"}</span>
                      </div>
                      <a
                        href={`https://wa.me/${al.contact.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] hover:bg-emerald-600/30 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                  Configurações Gerais da Empresa
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Gerencie informações institucionais, contactos oficiais e directrizes de apresentação.
                </p>
              </div>

              <form onSubmit={handleSaveSettingsSubmit} className="space-y-6 bg-stone-900/60 p-6 rounded-2xl border border-stone-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Nome da Empresa</label>
                    <input
                      type="text"
                      value={localSettings.companyName}
                      onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Telefone Oficial</label>
                    <input
                      type="text"
                      value={localSettings.phone}
                      onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">WhatsApp Oficial</label>
                    <input
                      type="text"
                      value={localSettings.whatsapp}
                      onChange={(e) => setLocalSettings({ ...localSettings, whatsapp: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Instagram (@)</label>
                    <input
                      type="text"
                      value={localSettings.instagram}
                      onChange={(e) => setLocalSettings({ ...localSettings, instagram: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Website Oficial</label>
                    <input
                      type="text"
                      value={localSettings.website}
                      onChange={(e) => setLocalSettings({ ...localSettings, website: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">E-mail de Contacto (Opcional)</label>
                    <input
                      type="email"
                      value={localSettings.email || ""}
                      onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
                      placeholder="Deixe em branco se não configurado"
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Endereço Oficial</label>
                    <input
                      type="text"
                      value={localSettings.address}
                      onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={localSettings.latitude}
                      onChange={(e) => setLocalSettings({ ...localSettings, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={localSettings.longitude}
                      onChange={(e) => setLocalSettings({ ...localSettings, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Missão</label>
                    <textarea
                      rows={2}
                      value={localSettings.mission}
                      onChange={(e) => setLocalSettings({ ...localSettings, mission: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-400 mb-1">Visão</label>
                    <textarea
                      rows={2}
                      value={localSettings.vision}
                      onChange={(e) => setLocalSettings({ ...localSettings, vision: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-400 mb-1">História Institucional</label>
                    <textarea
                      rows={3}
                      value={localSettings.history}
                      onChange={(e) => setLocalSettings({ ...localSettings, history: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors"
                  >
                    Guardar Configurações
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 9: BACKUP & RESTORE */}
          {activeTab === "backup" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100">
                  Backup e Recuperação de Dados
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Exporte o banco de dados completo da Nwani Imóveis em formato JSON ou restaure um backup anterior.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-100">Exportar Base de Dados</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Descarregue um ficheiro JSON com todos os imóveis, categorias, slides, anúncios e configurações.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descarregar JSON</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-100">Importar Backup JSON</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Restaure a base de dados a partir de um ficheiro JSON previamente exportado.
                    </p>
                  </div>
                  <label className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Selecionar Ficheiro JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Reset to Seed Card */}
              <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-400">
                  <RotateCcw className="w-5 h-5" />
                  <h3 className="font-bold text-sm">Redefinir para Catálogo Padrão (Seed)</h3>
                </div>
                <p className="text-xs text-stone-400">
                  Restaura todos os imóveis demonstrativos oficiais de Luanda (Talatona, Maianga, Alvalade, Miramar) e configurações originais.
                </p>
                <button
                  onClick={handleResetSeedData}
                  className="py-2 px-4 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold transition-colors"
                >
                  Restaurar Demonstração
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT PROPERTY MODAL */}
      {isPropertyModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl p-6 my-8 max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 shrink-0">
              <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
                {editingProperty.id ? `Editar Imóvel (${editingProperty.code})` : "Cadastrar Novo Imóvel"}
              </h3>
              <button
                onClick={() => setIsPropertyModalOpen(false)}
                className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePropertySubmit} className="flex-1 overflow-y-auto py-4 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Código *</label>
                  <input
                    type="text"
                    value={editingProperty.code || ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, code: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Título do Imóvel *</label>
                  <input
                    type="text"
                    value={editingProperty.title || ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Preço *</label>
                  <input
                    type="number"
                    value={editingProperty.price !== undefined && editingProperty.price !== null && (editingProperty.price as any) !== "" ? editingProperty.price : ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value === "" ? ("" as any) : parseFloat(e.target.value) })}
                    placeholder="Introduza o preço"
                    required
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Moeda</label>
                  <select
                    value={editingProperty.currency || "Kz"}
                    onChange={(e) => setEditingProperty({ ...editingProperty, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  >
                    <option value="Kz">Kz (Kwanza)</option>
                    <option value="USD">USD (Dólar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Tipo de Negócio *</label>
                  <select
                    value={editingProperty.businessType || "Venda"}
                    onChange={(e) => setEditingProperty({ ...editingProperty, businessType: e.target.value as BusinessType })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  >
                    <option value="Venda">Venda</option>
                    <option value="Arrendamento">Arrendamento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Categoria *</label>
                  <select
                    value={editingProperty.category || categories[0]?.name || "Apartamento"}
                    onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Status *</label>
                  <select
                    value={editingProperty.status || "Disponível"}
                    onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as PropertyStatus })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Vendido">Vendido</option>
                    <option value="Arrendado">Arrendado</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={editingProperty.isFeatured || false}
                      onChange={(e) => setEditingProperty({ ...editingProperty, isFeatured: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                    <span className="text-amber-300 font-semibold">Em Destaque</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={editingProperty.negotiable ?? true}
                      onChange={(e) => setEditingProperty({ ...editingProperty, negotiable: e.target.checked })}
                      className="rounded text-emerald-500"
                    />
                    <span className="text-emerald-400 font-semibold">Preço Negociável</span>
                  </label>
                </div>
              </div>

              {/* Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-800">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Província *</label>
                  <input
                    type="text"
                    value={editingProperty.province || "Luanda"}
                    onChange={(e) => setEditingProperty({ ...editingProperty, province: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Município *</label>
                  <input
                    type="text"
                    value={editingProperty.municipality || ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, municipality: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Bairro *</label>
                  <input
                    type="text"
                    value={editingProperty.neighborhood || ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, neighborhood: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Ponto de Referência</label>
                  <input
                    type="text"
                    value={editingProperty.reference || ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, reference: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  />
                </div>
              </div>

              {/* Características Físicas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-800">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Quartos</label>
                  <input
                    type="number"
                    value={editingProperty.bedrooms !== undefined && editingProperty.bedrooms !== null && (editingProperty.bedrooms as any) !== "" ? editingProperty.bedrooms : ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: e.target.value === "" ? ("" as any) : parseInt(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Casas de Banho</label>
                  <input
                    type="number"
                    value={editingProperty.bathrooms !== undefined && editingProperty.bathrooms !== null && (editingProperty.bathrooms as any) !== "" ? editingProperty.bathrooms : ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: e.target.value === "" ? ("" as any) : parseInt(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Estacionamento</label>
                  <input
                    type="number"
                    value={editingProperty.parking !== undefined && editingProperty.parking !== null && (editingProperty.parking as any) !== "" ? editingProperty.parking : ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, parking: e.target.value === "" ? ("" as any) : parseInt(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Área Útil (m²)</label>
                  <input
                    type="number"
                    value={editingProperty.area !== undefined && editingProperty.area !== null && (editingProperty.area as any) !== "" ? editingProperty.area : ""}
                    onChange={(e) => setEditingProperty({ ...editingProperty, area: e.target.value === "" ? ("" as any) : parseFloat(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">Descrição Detalhada</label>
                <textarea
                  rows={4}
                  value={editingProperty.description || ""}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>

              {/* Comodidades / Features */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-stone-400">Comodidades & Diferenciais</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    placeholder="Adicionar comodidade (ex: Gerador 50kVA, Piscina Privativa...)"
                    className="flex-1 px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {editingProperty.features?.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-300 flex items-center gap-1.5"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-stone-500 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Imagens (Upload local + URL) */}
              <div className="space-y-3 pt-3 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-stone-400">
                    Galeria de Imagens ({editingProperty.images?.length || 0})
                  </label>
                  <label className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload do Dispositivo</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    placeholder="Ou cole o link de uma imagem externa..."
                    className="flex-1 px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddExternalImageUrl}
                    className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                  >
                    Adicionar URL
                  </button>
                </div>

                {editingProperty.images && editingProperty.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {editingProperty.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-stone-800 bg-stone-950 group">
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="px-2 py-1 bg-amber-500 text-stone-950 text-[10px] font-bold rounded"
                              title="Definir como principal"
                            >
                              Principal
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded bg-rose-600 text-white"
                            title="Remover imagem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 text-[9px] font-bold">
                            Capa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vídeo */}
              <div className="pt-3 border-t border-stone-800">
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">Link do Vídeo (YouTube ou direto)</label>
                <input
                  type="url"
                  value={editingProperty.videoUrl || ""}
                  onChange={(e) => setEditingProperty({ ...editingProperty, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  disabled={isSavingProperty}
                  className="py-2.5 px-5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingProperty}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-950 text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSavingProperty ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>A Publicar Imóvel...</span>
                    </>
                  ) : (
                    <span>Guardar e Publicar Imóvel</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-serif-luxury text-base font-bold text-stone-100 mb-4">
              {editingCategory.id ? "Editar Categoria" : "Nova Categoria"}
            </h3>
            <form onSubmit={handleSaveCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Nome *</label>
                <input
                  type="text"
                  value={editingCategory.name || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Descrição</label>
                <input
                  type="text"
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Ordem</label>
                <input
                  type="number"
                  value={editingCategory.order || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-xs text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLIDE MODAL */}
      {isSlideModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-serif-luxury text-base font-bold text-stone-100 mb-4">
              {editingSlide.id ? "Editar Slide" : "Novo Slide"}
            </h3>
            <form onSubmit={handleSaveSlideSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Título *</label>
                <input
                  type="text"
                  value={editingSlide.title || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={editingSlide.subtitle || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Badge (Ex: Exclusivo)</label>
                <input
                  type="text"
                  value={editingSlide.badge || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">URL da Imagem *</label>
                <input
                  type="url"
                  value={editingSlide.imageUrl || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-xs text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  Guardar Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MARQUEE MODAL */}
      {isMarqueeModalOpen && editingMarquee && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-serif-luxury text-base font-bold text-stone-100 mb-4">
              {editingMarquee.id ? "Editar Anúncio" : "Novo Anúncio do Marquee"}
            </h3>
            <form onSubmit={handleSaveMarqueeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Texto do Anúncio *</label>
                <input
                  type="text"
                  value={editingMarquee.text || ""}
                  onChange={(e) => setEditingMarquee({ ...editingMarquee, text: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Link (Opcional)</label>
                <input
                  type="text"
                  value={editingMarquee.link || ""}
                  onChange={(e) => setEditingMarquee({ ...editingMarquee, link: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Ordem</label>
                <input
                  type="number"
                  value={editingMarquee.order || 1}
                  onChange={(e) => setEditingMarquee({ ...editingMarquee, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMarqueeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-xs text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  Guardar Anúncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
