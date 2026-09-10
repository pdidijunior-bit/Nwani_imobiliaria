export type BusinessType = 'Venda' | 'Arrendamento';

export type PropertyStatus = 'Disponível' | 'Reservado' | 'Vendido' | 'Arrendado';

export type PropertyCondition = 'Novo' | 'Excelente' | 'Bom' | 'Em Construção' | 'A Remodelar';

export type CurrencyType = 'AOA' | 'USD' | 'EUR';

export interface Property {
  id: string;
  code: string; // e.g. NWI-0001
  title: string;
  businessType: BusinessType;
  category: string;
  price: number;
  currency: CurrencyType;
  negotiable: boolean;
  province: string;
  municipality: string;
  neighborhood: string;
  reference?: string;
  area: number; // m²
  bedrooms: number;
  bathrooms: number;
  parking: number;
  features: string[]; // amenities e.g. Gerador, Tanque de Água, etc.
  description: string;
  condition: PropertyCondition;
  status: PropertyStatus;
  isFeatured: boolean;
  images: string[];
  videoUrl?: string;
  viewsCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge?: string;
  order: number;
  active: boolean;
}

export interface MarqueeItem {
  id: string;
  text: string;
  link?: string;
  order: number;
  active: boolean;
}

export interface LocationItem {
  id: string;
  province: string;
  municipality: string;
  neighborhoods: string[];
}

export interface SiteSettings {
  companyName?: string;
  title?: string;
  subtitle?: string;
  marquee?: {
    enabled: boolean;
    text: string;
  };
  mission: string;
  vision: string;
  history: string;
  phone: string;
  whatsapp: string;
  email?: string; // Configurable, if not set, hide from display
  schedule?: string;
  address: string;
  latitude: number;
  longitude: number;
  instagram: string;
  website: string;
  logoUrl?: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'client' | 'admin';
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  clientName: string;
  clientPhone: string;
  propertyCode?: string;
  propertyTitle?: string;
  propertyPrice?: string;
  propertyLink?: string;
  lastMessage: string;
  lastUpdated: number;
  unreadAdminCount?: number;
  status: 'active' | 'archived';
  messages?: ConversationMessage[];
}

export interface PropertyAlert {
  id: string;
  businessType: BusinessType;
  category?: string;
  province?: string;
  municipality?: string;
  neighborhood?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  contact: string;
  clientName?: string;
  createdAt: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  propertyId?: string;
  propertyCode?: string;
  createdAt: number;
  read: boolean;
  type: 'property' | 'alert' | 'system';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}
