import { Property, Category, LocationItem, SiteSettings, HeroSlide, MarqueeItem } from "../types";
import {
  COMPANY_NAME,
  PHONE_DISPLAY,
  WHATSAPP_DISPLAY,
  INSTAGRAM_HANDLE,
  WEBSITE_LINK,
  OFFICIAL_ADDRESS,
  DEFAULT_MARQUEE_TEXT,
  DEFAULT_MISSION,
  DEFAULT_VISION,
  DEFAULT_HISTORY,
} from "../constants/config";

export const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-vivendas", name: "Vivendas", slug: "vivendas", description: "Residências e moradias de alto padrão", icon: "Home", order: 1 },
  { id: "cat-apartamentos", name: "Apartamentos", slug: "apartamentos", description: "Apartamentos contemporâneos e coberturas", icon: "Building2", order: 2 },
  { id: "cat-terrenos", name: "Terrenos", slug: "terrenos", description: "Lotes residenciais, comerciais e industriais", icon: "LandPlot", order: 3 },
  { id: "cat-escritorios", name: "Escritórios", slug: "escritorios", description: "Espaços corporativos em zonas nobres", icon: "Briefcase", order: 4 },
  { id: "cat-armazens", name: "Armazéns", slug: "armazens", description: "Instalações logísticas e industriais", icon: "Warehouse", order: 5 },
  { id: "cat-lojas", name: "Lojas", slug: "lojas", description: "Espaços comerciais estratégicos", icon: "Store", order: 6 },
];

export const INITIAL_LOCATIONS: LocationItem[] = [
  {
    id: "loc-luanda-maianga",
    province: "Luanda",
    municipality: "Maianga",
    neighborhoods: ["Maianga", "Alvalade", "Cassenda", "Prenda", "Cruzeiro"],
  },
  {
    id: "loc-talatona",
    province: "Luanda",
    municipality: "Talatona",
    neighborhoods: ["Talatona", "Benfica", "Camama", "Futungo", "Lar do Patriota"],
  },
  {
    id: "loc-luanda-central",
    province: "Luanda",
    municipality: "Luanda",
    neighborhoods: ["Miramar", "Maculusso", "Ingombota", "Kinaxixi", "Ilha de Luanda", "Coqueiros"],
  },
  {
    id: "loc-belas",
    province: "Luanda",
    municipality: "Belas",
    neighborhoods: ["Kilamba", "Benfica Sul", "Morro Bento"],
  },
  {
    id: "loc-malanje",
    province: "Malanje",
    municipality: "Malanje",
    neighborhoods: ["Centro", "Catepa", "Vila Matilde"],
  },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  companyName: COMPANY_NAME,
  title: "Nwani Imóveis",
  subtitle: "Excelência e Rigor no Mercado Imobiliário Angolano",
  marquee: {
    enabled: true,
    text: DEFAULT_MARQUEE_TEXT,
  },
  mission: DEFAULT_MISSION,
  vision: DEFAULT_VISION,
  history: DEFAULT_HISTORY,
  phone: PHONE_DISPLAY,
  whatsapp: WHATSAPP_DISPLAY,
  address: OFFICIAL_ADDRESS.full,
  latitude: OFFICIAL_ADDRESS.latitude,
  longitude: OFFICIAL_ADDRESS.longitude,
  instagram: INSTAGRAM_HANDLE,
  website: WEBSITE_LINK,
};

// No fictitious or mock properties: Clean and ready for real-time data entry
export const INITIAL_PROPERTIES: Property[] = [];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-official",
    title: "Nwani Imóveis • Luanda, Angola",
    subtitle: "Soluções imobiliárias de alto padrão com rigor documental, segurança jurídica e discrição absoluta.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85",
    badge: "Imobiliária Oficial",
    order: 1,
    active: true,
  }
];

export const INITIAL_MARQUEE_ITEMS: MarqueeItem[] = [
  {
    id: "mq-1",
    text: "Nwani Imóveis • Consultoria imobiliária de excelência em Luanda e em toda Angola",
    order: 1,
    active: true,
  },
  {
    id: "mq-2",
    text: "Atendimento oficial em Maianga, Luanda • WhatsApp: +244 939 325 804",
    order: 2,
    active: true,
  }
];
