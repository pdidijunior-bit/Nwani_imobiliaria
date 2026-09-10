import React, { useState, useEffect, useCallback } from "react";
import { Marquee } from "./components/Marquee";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PropertyGrid } from "./components/PropertyGrid";
import { ProprietariosInvestidores } from "./components/ProprietariosInvestidores";
import { Diferenciais } from "./components/Diferenciais";
import { Footer } from "./components/Footer";
import { PropertyDetailModal } from "./components/PropertyDetailModal";
import { SobreNosModal } from "./components/SobreNosModal";
import { TermosModal } from "./components/TermosModal";
import { PrivacidadeModal } from "./components/PrivacidadeModal";
import { ClientAreaModal } from "./components/ClientAreaModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { AdminPanel } from "./components/AdminPanel";
import { ChatWidget } from "./components/ChatWidget";
import { Toast, ToastMessage } from "./components/Toast";

import {
  Property,
  Category,
  HeroSlide,
  MarqueeItem,
  SiteSettings,
  Conversation,
  PropertyAlert,
  SystemNotification,
  BusinessType
} from "./types";
import {
  subscribeToProperties,
  subscribeToCategories,
  subscribeToHeroSlides,
  subscribeToMarquee,
  subscribeToSiteSettings,
  subscribeToConversations,
  subscribeToAlerts,
  subscribeToNotifications,
  incrementPropertyViews
} from "./services/dbService";
import {
  onAuthStateChange,
  checkIsUserAdmin
} from "./services/authService";
import {
  getSafeLocalStorage,
  setSafeLocalStorage
} from "./utils/formatters";
import { INITIAL_SITE_SETTINGS } from "./data/seedData";

const FAVORITES_STORAGE_KEY = "nwani_favorites";
const THEME_STORAGE_KEY = "nwani_theme_mode";

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return getSafeLocalStorage<"dark" | "light">(THEME_STORAGE_KEY, "dark");
  });

  // Core Data Collections
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // User State
  const [favorites, setFavorites] = useState<string[]>(() => {
    return getSafeLocalStorage<string[]>(FAVORITES_STORAGE_KEY, []);
  });
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  // Modals & Navigation States
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSobreNosOpen, setIsSobreNosOpen] = useState<boolean>(false);
  const [isTermosOpen, setIsTermosOpen] = useState<boolean>(false);
  const [isPrivacidadeOpen, setIsPrivacidadeOpen] = useState<boolean>(false);
  const [isClientAreaOpen, setIsClientAreaOpen] = useState<boolean>(false);
  const [clientAreaTab, setClientAreaTab] = useState<"favorites" | "alerts" | "notifications">("favorites");
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // Chat Widget
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatAttachedProperty, setChatAttachedProperty] = useState<Property | null>(null);

  // Navigation Filter
  const [catalogInitialBusinessType, setCatalogInitialBusinessType] = useState<"all" | BusinessType>("all");

  // Notifications / Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Theme Toggle
  const handleToggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setSafeLocalStorage(THEME_STORAGE_KEY, next);
  };

  // Subscribe to all real-time Firestore feeds with automatic offline fallback
  useEffect(() => {
    const unsubProps = subscribeToProperties(setProperties);
    const unsubCats = subscribeToCategories(setCategories);
    const unsubSlides = subscribeToHeroSlides(setHeroSlides);
    const unsubMarquee = subscribeToMarquee(setMarqueeItems);
    const unsubSettings = subscribeToSiteSettings(setSiteSettings);
    const unsubConvs = subscribeToConversations(setConversations);
    const unsubAlerts = subscribeToAlerts(setAlerts);
    const unsubNotifs = subscribeToNotifications(setNotifications);

    return () => {
      unsubProps();
      unsubCats();
      unsubSlides();
      unsubMarquee();
      unsubSettings();
      unsubConvs();
      unsubAlerts();
      unsubNotifs();
    };
  }, []);

  // Listen to Auth state
  useEffect(() => {
    // Cleanse any old mock property data from localStorage to ensure clean state
    try {
      const rawProps = localStorage.getItem("nwani_properties_cache");
      if (rawProps && rawProps.includes("prop-nwi-000")) {
        localStorage.removeItem("nwani_properties_cache");
      }
      const rawFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (rawFavs && rawFavs.includes("prop-nwi-000")) {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
        setFavorites([]);
      }
    } catch (e) {
      console.warn("Storage cleanup note:", e);
    }

    const unsubAuth = onAuthStateChange((user) => {
      if (user) {
        setCurrentUserEmail(user.email || "admin@nwaniimoveis.com");
        setIsAdminUser(true);
      } else {
        setCurrentUserEmail(null);
        setIsAdminUser(false);
      }
    });

    return () => unsubAuth();
  }, []);

  // Check URL query parameters for direct property sharing (?imovel=NWI-1001)
  useEffect(() => {
    if (typeof window !== "undefined" && properties.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get("imovel");
      if (codeParam) {
        const found = properties.find(
          (p) => p.code.toLowerCase() === codeParam.trim().toLowerCase()
        );
        if (found) {
          setSelectedProperty(found);
          incrementPropertyViews(found.id);
        }
      }
    }
  }, [properties]);

  // Favorites Toggle
  const handleToggleFavorite = useCallback((propId: string) => {
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(propId)) {
        updated = prev.filter((id) => id !== propId);
        showToast("Imóvel removido dos favoritos.", "info");
      } else {
        updated = [...prev, propId];
        showToast("Imóvel adicionado aos seus favoritos!", "success");
      }
      setSafeLocalStorage(FAVORITES_STORAGE_KEY, updated);
      return updated;
    });
  }, [showToast]);

  // View property details
  const handleViewPropertyDetails = (property: Property) => {
    setSelectedProperty(property);
    incrementPropertyViews(property.id);
  };

  // Open chat attached with a property
  const handleOpenChatWithProperty = (property: Property) => {
    setChatAttachedProperty(property);
    setIsChatOpen(true);
  };

  // Navigation handlers
  const handleNavigateToCatalog = (
    businessType: "all" | BusinessType = "all",
    categoryName?: string
  ) => {
    setCatalogInitialBusinessType(businessType);
    const catalogElement = document.getElementById("catalog-section");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHeroSearch = (query: {
    businessType: BusinessType;
    category?: string;
    province?: string;
    municipality?: string;
    maxPrice?: number;
  }) => {
    setCatalogInitialBusinessType(query.businessType);
    const catalogElement = document.getElementById("catalog-section");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenClientArea = (tab: "favorites" | "alerts" | "notifications" = "favorites") => {
    setClientAreaTab(tab);
    setIsClientAreaOpen(true);
  };

  // Admin access
  const handleOpenAdmin = () => {
    if (isAdminUser) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const favoritePropertiesList = properties.filter((p) => favorites.includes(p.id));

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 flex flex-col ${
        theme === "dark" ? "bg-stone-950 text-stone-100" : "bg-stone-50 text-stone-900"
      }`}
    >
      {/* 1. Continuous Marquee Bar at the very top */}
      <Marquee items={marqueeItems} />

      {/* 2. Main Luxury Navbar */}
      <Navbar
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
        favoritesCount={favorites.length}
        onOpenClientArea={handleOpenClientArea}
        onOpenFavorites={() => handleOpenClientArea("favorites")}
        onOpenAlerts={() => handleOpenClientArea("alerts")}
        onOpenSobreNos={() => setIsSobreNosOpen(true)}
        onOpenTermos={() => setIsTermosOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onNavigateToCatalog={handleNavigateToCatalog}
      />

      {/* 3. Hero Section with dynamic slides & multi-criteria search */}
      <Hero
        slides={heroSlides}
        title={siteSettings?.title || "Nwani Imóveis"}
        subtitle={siteSettings?.subtitle || "Imóveis de Prestígio & Confiança em Angola"}
        totalProperties={properties.length}
        totalProvinces={new Set(properties.map((p) => p.province).filter(Boolean)).size}
        categories={categories}
        onSearch={handleHeroSearch}
        onExploreCatalog={() => document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" })}
        currentTheme={theme}
      />

      {/* 4. Complete Property Catalog Grid */}
      <PropertyGrid
        properties={properties}
        categories={categories}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onViewDetails={handleViewPropertyDetails}
        currentTheme={theme}
        initialBusinessType={catalogInitialBusinessType}
      />

      {/* 5. Proprietários & Investidores Institutional Section */}
      <ProprietariosInvestidores />

      {/* 6. Diferenciais e Pilares de Excelência */}
      <Diferenciais />

      {/* 7. Footer */}
      <Footer
        categories={categories}
        settings={siteSettings}
        onNavigateToCatalog={handleNavigateToCatalog}
        onOpenSobreNos={() => setIsSobreNosOpen(true)}
        onOpenTermos={() => setIsTermosOpen(true)}
        onOpenPrivacidade={() => setIsPrivacidadeOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        currentTheme={theme}
      />

      {/* 8. Online Chat Widget */}
      <ChatWidget
        attachedProperty={chatAttachedProperty}
        onClearAttachedProperty={() => setChatAttachedProperty(null)}
        isOpen={isChatOpen}
        onToggleOpen={() => setIsChatOpen(!isChatOpen)}
        currentTheme={theme}
      />

      {/* 9. Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenChatWithProperty={handleOpenChatWithProperty}
        onShowToast={showToast}
        currentTheme={theme}
      />

      {/* 10. Sobre Nós Institutional Modal */}
      <SobreNosModal
        isOpen={isSobreNosOpen}
        onClose={() => setIsSobreNosOpen(false)}
        settings={siteSettings}
        currentTheme={theme}
      />

      {/* 11. Termos de Uso Modal */}
      <TermosModal
        isOpen={isTermosOpen}
        onClose={() => setIsTermosOpen(false)}
        currentTheme={theme}
      />

      {/* 12. Política de Privacidade Modal */}
      <PrivacidadeModal
        isOpen={isPrivacidadeOpen}
        onClose={() => setIsPrivacidadeOpen(false)}
        currentTheme={theme}
      />

      {/* 13. Área do Cliente Modal */}
      <ClientAreaModal
        isOpen={isClientAreaOpen}
        onClose={() => setIsClientAreaOpen(false)}
        initialTab={clientAreaTab}
        favoriteProperties={favoritePropertiesList}
        onRemoveFavorite={handleToggleFavorite}
        onViewPropertyDetails={handleViewPropertyDetails}
        categories={categories}
        notifications={notifications}
        onShowToast={showToast}
        currentTheme={theme}
      />

      {/* 14. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminPanelOpen(true)}
        onShowToast={showToast}
        currentTheme={theme}
      />

      {/* 15. Admin Management Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        properties={properties}
        categories={categories}
        heroSlides={heroSlides}
        marqueeItems={marqueeItems}
        settings={siteSettings}
        conversations={conversations}
        alerts={alerts}
        currentUserEmail={currentUserEmail}
        onShowToast={showToast}
        currentTheme={theme}
      />

      {/* 16. Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
