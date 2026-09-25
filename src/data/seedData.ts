import { Property, Category, LocationItem, SiteSettings, HeroSlide, MarqueeItem } from "../types";
import {
  COMPANY_NAME,
  COMPANY_SLOGAN,
  HERO_HEADLINE,
  PHONE_DISPLAY,
  WHATSAPP_DISPLAY,
  EMAIL_OFFICIAL,
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
    id: "loc-luanda-21jan",
    province: "Luanda",
    municipality: "Luanda",
    neighborhoods: ["Av. 21 de Janeiro", "Morro Bento", "Rocha Pinto", "Aeroporto", "Maianga"],
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
    id: "loc-benguela",
    province: "Benguela",
    municipality: "Benguela",
    neighborhoods: ["Centro", "Praia Morena", "Lobito"],
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
  title: COMPANY_NAME,
  subtitle: COMPANY_SLOGAN,
  marquee: {
    enabled: true,
    text: DEFAULT_MARQUEE_TEXT,
  },
  mission: DEFAULT_MISSION,
  vision: DEFAULT_VISION,
  history: DEFAULT_HISTORY,
  phone: PHONE_DISPLAY,
  whatsapp: WHATSAPP_DISPLAY,
  email: EMAIL_OFFICIAL,
  address: OFFICIAL_ADDRESS.full,
  latitude: OFFICIAL_ADDRESS.latitude,
  longitude: OFFICIAL_ADDRESS.longitude,
  instagram: INSTAGRAM_HANDLE,
  website: WEBSITE_LINK,
  schedule: "Segunda a Sábado: 08:00 às 18:00",
};

// No fictitious or mock properties: Clean and ready for real-time data entry
export const INITIAL_PROPERTIES: Property[] = [];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-dd-official",
    title: "Victória D&D Soluções Imobiliárias",
    subtitle: "Arrendamentos, Compras e Vendas de Imóveis em Angola com Rigor e Segurança Legal.",
    imageUrl: "/vivenda-bg.jpg",
    badge: "Soluções Imobiliárias Oficiais",
    order: 1,
    active: true,
  }
];

export const INITIAL_MARQUEE_ITEMS: MarqueeItem[] = [
  {
    id: "mq-1",
    text: "Victória D&D Soluções Imobiliárias • Arrendamentos, Compras e Vendas de Imóveis em Angola",
    order: 1,
    active: true,
  },
  {
    id: "mq-2",
    text: "Atendimento oficial: Av. 21 de Janeiro, Luanda • WhatsApp: +244 921 068 197",
    order: 2,
    active: true,
  }
];
