import React, { useState } from "react";
import { Search, Building, SlidersHorizontal, MapPin, Sparkles, Shield, ArrowRight, MessageCircle, Phone } from "lucide-react";
import { BusinessType, Category } from "../types";
import {
  COMPANY_NAME,
  COMPANY_SLOGAN,
  HERO_HEADLINE,
  WHATSAPP_LINK,
  PHONE_DISPLAY,
  PHONE_TEL_LINK
} from "../constants/config";

interface HeroProps {
  slides?: any[];
  title?: string;
  subtitle?: string;
  totalProperties?: number;
  totalProvinces?: number;
  categories: Category[];
  onSearch: (filters: {
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
  categories,
  onSearch,
  onExploreCatalog,
}) => {
  const [query, setQuery] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType | "">("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const handleExplore = () => {
    if (typeof onExploreCatalog === "function") {
      onExploreCatalog();
    } else {
      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query,
      businessType: businessType ? (businessType as BusinessType) : undefined,
      category: selectedCategory || undefined,
      province: selectedProvince || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    });
  };

  return (
    <section
      id="hero-section"
      className="relative bg-slate-950 text-white overflow-hidden py-12 sm:py-16 lg:py-24 border-b border-slate-800 w-full max-w-full"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(15, 23, 42, 0.82) 0%, rgba(10, 15, 30, 0.90) 50%, rgba(2, 6, 23, 0.97) 100%), url('/vivenda-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Dynamic atmospheric subtle glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-10">
          {/* Slogan & Category Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-red-500/40 text-red-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>{COMPANY_SLOGAN}</span>
          </div>

          {/* Main Hero Headline from Image */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 drop-shadow-lg">
            <span className="text-white block">{HERO_HEADLINE}</span>
            <span className="block mt-2 text-red-600 text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase">
              {title || COMPANY_NAME}
            </span>
          </h1>

          <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-md">
            {subtitle ||
              "Encontre vivendas, apartamentos, escritórios, terrenos e oportunidades de investimento em Luanda e em todo o território nacional com rigor, agilidade e máxima segurança legal."}
          </p>

          {/* Quick Direct Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              id="hero-quick-whatsapp"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {PHONE_DISPLAY}</span>
            </a>
            <a
              id="hero-quick-call"
              href={PHONE_TEL_LINK}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all"
            >
              <Phone className="w-4 h-4 text-red-400" />
              <span>Ligar Diretamente</span>
            </a>
          </div>
        </div>

        {/* High-Precision Search Box */}
        <div className="max-w-4xl mx-auto bg-slate-900/85 border border-slate-700/80 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 shadow-2xl">
          {/* Quick Business Type Tabs */}
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none w-full">
            <button
              type="button"
              onClick={() => setBusinessType("")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                businessType === ""
                  ? "bg-red-600 text-white shadow-md shadow-red-900/50"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Todos os Negócios
            </button>
            <button
              type="button"
              onClick={() => setBusinessType("Venda")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                businessType === "Venda"
                  ? "bg-red-600 text-white shadow-md shadow-red-900/50"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setBusinessType("Arrendamento")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                businessType === "Arrendamento"
                  ? "bg-red-600 text-white shadow-md shadow-red-900/50"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Arrendar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search text input */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="hero-input-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bairro, condomínio, código D&D..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                />
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-3">
                <select
                  id="hero-select-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-red-500 transition-colors"
                >
                  <option value="">Todas Categorias</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Province Dropdown */}
              <div className="md:col-span-2">
                <select
                  id="hero-select-province"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-red-500 transition-colors"
                >
                  <option value="">Província</option>
                  <option value="Luanda">Luanda</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huíla">Huíla</option>
                  <option value="Malanje">Malanje</option>
                  <option value="Cuanza Sul">Cuanza Sul</option>
                  <option value="Huambo">Huambo</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  id="hero-btn-search"
                  type="submit"
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-950/40 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Buscar</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvanced ? "Ocultar filtros de valor" : "Filtrar por faixa de preço"}</span>
              </button>

              <button
                id="hero-btn-explore-catalog"
                type="button"
                onClick={handleExplore}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <span>Explorar todo o catálogo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Collapsible Price Range inputs */}
            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Preço Mínimo (Kz)</label>
                  <input
                    type="number"
                    value={minPrice || ""}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex: 50.000.000"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Preço Máximo (Kz)</label>
                  <input
                    type="number"
                    value={maxPrice || ""}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex: 500.000.000"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Real Dynamic Metrics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-red-500 block">
              {totalProperties}
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1 block">Imóveis Ativos</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-red-500 block">
              {totalProvinces}
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1 block">Províncias</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-red-500 block">
              100%
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1 block">Legalidade & Rigor</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-md">
            <span className="text-2xl sm:text-3xl font-black text-red-500 block">
              24h
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1 block">WhatsApp Ativo</span>
          </div>
        </div>
      </div>
    </section>
  );
};
