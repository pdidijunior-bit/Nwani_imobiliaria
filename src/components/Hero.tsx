import React, { useState } from "react";
import { Search, Building, SlidersHorizontal, MapPin, Sparkles, Shield, ArrowRight } from "lucide-react";
import { BusinessType, Category } from "../types";

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
    <section id="hero-section" className="relative bg-stone-950 text-white overflow-hidden py-16 lg:py-24 border-b border-stone-800">
      {/* Subtle architectural background overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:28px_28px]" />
      
      {/* Atmospheric luxury glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mercado Imobiliário Premium em Angola</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-tight mb-4">
            <span className="text-white block">{title || "Nwani Imóveis"}</span>
            <span className="text-gold-gradient block mt-1 text-2xl sm:text-4xl lg:text-5xl font-bold">
              Imóveis de Prestígio & Confiança
            </span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            {subtitle ||
              "Encontre imóveis residenciais, comerciais e investimentos de alto padrão em Luanda e em todo o território angolano com assessoria rigorosa e segurança jurídica."}
          </p>
        </div>

        {/* High-Precision Search Box */}
        <div className="max-w-4xl mx-auto bg-stone-900/90 border border-stone-800 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl">
          {/* Quick Business Type Tabs */}
          <div className="flex items-center gap-2 mb-4 border-b border-stone-800 pb-3">
            <button
              type="button"
              onClick={() => setBusinessType("")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                businessType === ""
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-800/80 text-stone-300 hover:bg-stone-800"
              }`}
            >
              Todos os Negócios
            </button>
            <button
              type="button"
              onClick={() => setBusinessType("Venda")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                businessType === "Venda"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-800/80 text-stone-300 hover:bg-stone-800"
              }`}
            >
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setBusinessType("Arrendamento")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                businessType === "Arrendamento"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-800/80 text-stone-300 hover:bg-stone-800"
              }`}
            >
              Arrendar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search text input */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="hero-input-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bairro, condomínio, código NWI..."
                  className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-3">
                <select
                  id="hero-select-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
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
                  className="w-full px-3 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="">Província</option>
                  <option value="Luanda">Luanda</option>
                  <option value="Malanje">Malanje</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huíla">Huíla</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  id="hero-btn-search"
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md"
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
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-medium transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvanced ? "Ocultar filtros de valor" : "Filtrar por faixa de preço"}</span>
              </button>

              <button
                id="hero-btn-explore-catalog"
                type="button"
                onClick={handleExplore}
                className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Explorar todo o catálogo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Collapsible Price Range inputs */}
            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-800/60">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Preço Mínimo (Kz)</label>
                  <input
                    type="number"
                    value={minPrice || ""}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex: 50.000.000"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">Preço Máximo (Kz)</label>
                  <input
                    type="number"
                    value={maxPrice || ""}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex: 500.000.000"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Real Dynamic Metrics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-4 text-center">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-400 block">
              {totalProperties}
            </span>
            <span className="text-xs text-stone-400 uppercase tracking-wider mt-1 block">Imóveis Ativos</span>
          </div>

          <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-4 text-center">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-400 block">
              {totalProvinces}
            </span>
            <span className="text-xs text-stone-400 uppercase tracking-wider mt-1 block">Províncias Cobertas</span>
          </div>

          <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-4 text-center">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-400 block">
              100%
            </span>
            <span className="text-xs text-stone-400 uppercase tracking-wider mt-1 block">Rigor Jurídico</span>
          </div>

          <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-4 text-center">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-400 block">
              24h
            </span>
            <span className="text-xs text-stone-400 uppercase tracking-wider mt-1 block">Suporte Dedicado</span>
          </div>
        </div>
      </div>
    </section>
  );
};
