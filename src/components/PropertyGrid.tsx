import React, { useState, useMemo, useEffect } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Building,
  Sparkles,
  ArrowUpDown,
  Search,
  X,
  MapPin,
  Tag,
  DollarSign
} from "lucide-react";
import { Property, BusinessType, Category } from "../types";
import { PropertyCard } from "./PropertyCard";
import { formatCurrency } from "../utils/formatters";

export interface ActiveSearchFilters {
  query?: string;
  businessType?: "all" | BusinessType;
  category?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface PropertyGridProps {
  properties: Property[];
  categories: Category[];
  favorites: string[];
  onToggleFavorite: (propId: string) => void;
  onViewDetails: (prop: Property) => void;
  currentTheme?: "dark" | "light";
  initialBusinessType?: "all" | BusinessType;
  activeSearchFilters?: ActiveSearchFilters;
  onClearActiveSearchFilters?: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  categories,
  favorites,
  onToggleFavorite,
  onViewDetails,
  currentTheme = "dark",
  initialBusinessType = "all",
  activeSearchFilters,
  onClearActiveSearchFilters,
}) => {
  // Quick tab filter
  const [quickTab, setQuickTab] = useState<"all" | "Venda" | "Arrendamento" | "destaque">(
    initialBusinessType === "all" ? "all" : initialBusinessType
  );

  // Search input text state
  const [searchInput, setSearchInput] = useState<string>(activeSearchFilters?.query || "");

  // Advanced Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(activeSearchFilters?.category || "");
  const [selectedProvince, setSelectedProvince] = useState<string>(activeSearchFilters?.province || "");
  const [minPrice, setMinPrice] = useState<number | "">(activeSearchFilters?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState<number | "">(activeSearchFilters?.maxPrice || "");
  const [minBedrooms, setMinBedrooms] = useState<number | "">("");
  const [minBathrooms, setMinBathrooms] = useState<number | "">("");
  const [minArea, setMinArea] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "recent" | "views">("relevance");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Sync when activeSearchFilters prop updates (e.g. from Hero search)
  useEffect(() => {
    if (activeSearchFilters) {
      if (activeSearchFilters.query !== undefined) setSearchInput(activeSearchFilters.query);
      if (activeSearchFilters.category !== undefined) setSelectedCategory(activeSearchFilters.category);
      if (activeSearchFilters.province !== undefined) setSelectedProvince(activeSearchFilters.province);
      if (activeSearchFilters.minPrice !== undefined) setMinPrice(activeSearchFilters.minPrice);
      if (activeSearchFilters.maxPrice !== undefined) setMaxPrice(activeSearchFilters.maxPrice);
      if (activeSearchFilters.businessType) {
        setQuickTab(activeSearchFilters.businessType);
      }
    }
  }, [activeSearchFilters]);

  // Sync quickTab when initialBusinessType changes
  useEffect(() => {
    if (initialBusinessType) {
      setQuickTab(initialBusinessType);
    }
  }, [initialBusinessType]);

  // Reset all filters
  const handleClearFilters = () => {
    setQuickTab("all");
    setSearchInput("");
    setSelectedCategory("");
    setSelectedProvince("");
    setMinPrice("");
    setMaxPrice("");
    setMinBedrooms("");
    setMinBathrooms("");
    setMinArea("");
    setSortBy("relevance");
    if (onClearActiveSearchFilters) {
      onClearActiveSearchFilters();
    }
  };

  const hasActiveFilters =
    quickTab !== "all" ||
    searchInput.trim() !== "" ||
    selectedCategory !== "" ||
    selectedProvince !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minBedrooms !== "" ||
    minBathrooms !== "" ||
    minArea !== "" ||
    sortBy !== "relevance";

  // Fast String Normalization for accent-insensitive and case-insensitive matching
  const normalizeText = (text: string): string => {
    return (text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  // Filtered & Sorted properties calculation
  const filteredProperties = useMemo(() => {
    const normalizedQuery = normalizeText(searchInput);
    const searchTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return properties
      .filter((p) => {
        // Quick tab filter
        if (quickTab === "Venda" && p.businessType !== "Venda") return false;
        if (quickTab === "Arrendamento" && p.businessType !== "Arrendamento") return false;
        if (quickTab === "destaque" && !p.isFeatured) return false;

        // Category filter
        if (selectedCategory && p.category !== selectedCategory) return false;

        // Province filter
        if (selectedProvince && p.province !== selectedProvince) return false;

        // Price range
        if (minPrice !== "" && Number(minPrice) > 0 && p.price < Number(minPrice)) return false;
        if (maxPrice !== "" && Number(maxPrice) > 0 && p.price > Number(maxPrice)) return false;

        // Bedrooms
        if (minBedrooms !== "" && p.bedrooms < Number(minBedrooms)) return false;

        // Bathrooms
        if (minBathrooms !== "" && p.bathrooms < Number(minBathrooms)) return false;

        // Area
        if (minArea !== "" && p.area < Number(minArea)) return false;

        // Smart Full-Text & Code Search
        if (searchTokens.length > 0) {
          const codeNorm = normalizeText(p.code);
          const titleNorm = normalizeText(p.title);
          const neighborhoodNorm = normalizeText(p.neighborhood);
          const municipalityNorm = normalizeText(p.municipality);
          const provinceNorm = normalizeText(p.province);
          const categoryNorm = normalizeText(p.category);
          const descNorm = normalizeText(p.description);

          // Combined searchable corpus
          const fullText = `${codeNorm} ${titleNorm} ${neighborhoodNorm} ${municipalityNorm} ${provinceNorm} ${categoryNorm} ${descNorm}`;

          // Match: Every token must appear in the property details or directly match code
          const matches = searchTokens.every(
            (token) => fullText.includes(token) || codeNorm.includes(token)
          );
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "recent") return (b.createdAt || 0) - (a.createdAt || 0);
        if (sortBy === "views") return (b.viewsCount || 0) - (a.viewsCount || 0);
        // Default relevance: Featured properties first, then newest
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [
    properties,
    quickTab,
    searchInput,
    selectedCategory,
    selectedProvince,
    minPrice,
    maxPrice,
    minBedrooms,
    minBathrooms,
    minArea,
    sortBy,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is reactive in real time; this ensures smooth mobile enter-key handling
  };

  return (
    <section id="catalog-section" className="py-12 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>Portfólio Oficial</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Catálogo de Imóveis
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Encontre vivendas, apartamentos, escritórios e terrenos rigorosamente verificados em Angola.
          </p>
        </div>

        {/* Results Counter and Clear Filters */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-stone-800 text-stone-300">
            {filteredProperties.length} {filteredProperties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-slate-900/60 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Smart Search Bar & Filter Controls Bar */}
      <div className="bg-slate-900/80 border border-amber-500/35 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-md shadow-lg shadow-amber-500/5">
        {/* Modern Instant Smart Search Bar with Right "Pesquisar" Button */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/90 pointer-events-none" />
              <input
                id="catalog-smart-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Pesquise por código (ex: 001, VDD-1001), bairro, condomínio, tipologia..."
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-stone-700/80 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-amber-300 cursor-pointer"
                  title="Limpar pesquisa"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Prominent "Pesquisar" Button on the Right Side in GOLD */}
            <button
              id="catalog-btn-pesquisar"
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/25 active:scale-95 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Pesquisar</span>
            </button>
          </div>
        </form>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Quick Business Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setQuickTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                quickTab === "all"
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-950 text-stone-300 hover:bg-stone-800 hover:text-amber-300 border border-stone-800"
              }`}
            >
              Todos ({properties.length})
            </button>

            <button
              type="button"
              onClick={() => setQuickTab("Venda")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                quickTab === "Venda"
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-950 text-stone-300 hover:bg-stone-800 hover:text-amber-300 border border-stone-800"
              }`}
            >
              Comprar
            </button>

            <button
              type="button"
              onClick={() => setQuickTab("Arrendamento")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                quickTab === "Arrendamento"
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-950 text-stone-300 hover:bg-stone-800 hover:text-amber-300 border border-stone-800"
              }`}
            >
              Arrendar
            </button>

            <button
              type="button"
              onClick={() => setQuickTab("destaque")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                quickTab === "destaque"
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-950 text-stone-300 hover:bg-stone-800 hover:text-amber-300 border border-stone-800"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${quickTab === "destaque" ? "text-stone-950" : "text-amber-400"}`} />
              <span>Em Destaque</span>
            </button>
          </div>

          {/* Right Filters Trigger & Sorting */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="recent">Mais Recentes</option>
                <option value="views">Mais Visualizados</option>
                <option value="price_asc">Preço: Menor → Maior</option>
                <option value="price_desc">Preço: Maior → Menor</option>
              </select>
            </div>

            {/* Toggle advanced drawer */}
            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showFilterDrawer || hasActiveFilters
                  ? "bg-amber-500/15 border-amber-500/60 text-amber-300"
                  : "bg-slate-950 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-amber-500/40 hover:text-amber-300"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>{showFilterDrawer ? "Ocultar Filtros" : "Filtros Avançados"}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Row */}
        {showFilterDrawer && (
          <div className="mt-4 pt-4 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Província</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              >
                <option value="">Todas</option>
                <option value="Luanda">Luanda</option>
                <option value="Benguela">Benguela</option>
                <option value="Huíla">Huíla</option>
                <option value="Malanje">Malanje</option>
                <option value="Cuanza Sul">Cuanza Sul</option>
                <option value="Huambo">Huambo</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Preço Mín (Kz)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="Ex: 50.000.000"
                className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Preço Máx (Kz)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="Ex: 500.000.000"
                className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Quartos</label>
              <select
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              >
                <option value="">Qualquer</option>
                <option value="1">1+ Quartos</option>
                <option value="2">2+ Quartos</option>
                <option value="3">3+ Quartos</option>
                <option value="4">4+ Quartos</option>
                <option value="5">5+ Quartos</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Banheiros</label>
              <select
                value={minBathrooms}
                onChange={(e) => setMinBathrooms(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              >
                <option value="">Qualquer</option>
                <option value="1">1+ Banheiros</option>
                <option value="2">2+ Banheiros</option>
                <option value="3">3+ Banheiros</option>
                <option value="4">4+ Banheiros</option>
              </select>
            </div>

            {/* Minimum Area */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Área Mín (m²)</label>
              <input
                type="number"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value ? Number(e.target.value) : "")}
                placeholder="Ex: 150"
                className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* Active filter badges / quick chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-xs text-stone-400 font-semibold">Filtros ativos:</span>
          {searchInput && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-950/85 border border-amber-500/40 text-amber-300 text-xs font-medium">
              <span>Termo: "{searchInput}"</span>
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="hover:text-amber-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {quickTab !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-950/85 border border-amber-500/40 text-amber-300 text-xs font-medium">
              <span>Tipo: {quickTab === "destaque" ? "Em Destaque" : quickTab}</span>
              <button
                type="button"
                onClick={() => setQuickTab("all")}
                className="hover:text-amber-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-950/85 border border-amber-500/40 text-amber-300 text-xs font-medium">
              <span>Categoria: {selectedCategory}</span>
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className="hover:text-amber-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedProvince && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
              <span>Província: {selectedProvince}</span>
              <button
                type="button"
                onClick={() => setSelectedProvince("")}
                className="hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {(minPrice !== "" || maxPrice !== "") && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
              <span>
                Preço: {minPrice ? formatCurrency(Number(minPrice)) : "0"} – {maxPrice ? formatCurrency(Number(maxPrice)) : "Sem limite"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
              currentTheme={currentTheme}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 text-blue-400">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">
            {properties.length === 0 ? "Catálogo Pronto e Disponível" : "Nenhum imóvel encontrado"}
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {properties.length === 0
              ? "Nenhum imóvel cadastrado de momento. O sistema está conectado à base de dados e pronto para registar os seus imóveis em tempo real pelo Painel Administrativo."
              : "Não encontramos imóveis que correspondam aos filtros ou termos selecionados. Experimente ajustar os critérios de pesquisa."}
          </p>
          {properties.length > 0 && hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="py-2.5 px-6 rounded-xl bg-[#0052A5] hover:bg-[#003366] text-white font-bold text-sm transition-colors shadow-md cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      )}
    </section>
  );
};
