import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Building,
  Sparkles,
  ArrowUpDown,
  Filter,
  Check
} from "lucide-react";
import { Property, BusinessType, Category } from "../types";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  categories: Category[];
  favorites: string[];
  onToggleFavorite: (propId: string) => void;
  onViewDetails: (prop: Property) => void;
  currentTheme?: "dark" | "light";
  initialBusinessType?: "all" | BusinessType;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  categories,
  favorites,
  onToggleFavorite,
  onViewDetails,
  currentTheme = "dark",
  initialBusinessType = "all",
}) => {
  // Quick tab filter
  const [quickTab, setQuickTab] = useState<"all" | "Venda" | "Arrendamento" | "destaque">(
    initialBusinessType === "all" ? "all" : initialBusinessType
  );

  // Advanced Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [minBedrooms, setMinBedrooms] = useState<number | "">("");
  const [minBathrooms, setMinBathrooms] = useState<number | "">("");
  const [minArea, setMinArea] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "recent" | "views">("relevance");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Reset filters
  const handleClearFilters = () => {
    setQuickTab("all");
    setSelectedCategory("");
    setSelectedProvince("");
    setMinBedrooms("");
    setMinBathrooms("");
    setMinArea("");
    setSortBy("relevance");
  };

  const hasActiveFilters =
    quickTab !== "all" ||
    selectedCategory !== "" ||
    selectedProvince !== "" ||
    minBedrooms !== "" ||
    minBathrooms !== "" ||
    minArea !== "" ||
    sortBy !== "relevance";

  // Filtered & Sorted properties calculation
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Quick tab
        if (quickTab === "Venda" && p.businessType !== "Venda") return false;
        if (quickTab === "Arrendamento" && p.businessType !== "Arrendamento") return false;
        if (quickTab === "destaque" && !p.isFeatured) return false;

        // Category
        if (selectedCategory && p.category !== selectedCategory) return false;

        // Province
        if (selectedProvince && p.province !== selectedProvince) return false;

        // Bedrooms
        if (minBedrooms !== "" && p.bedrooms < Number(minBedrooms)) return false;

        // Bathrooms
        if (minBathrooms !== "" && p.bathrooms < Number(minBathrooms)) return false;

        // Area
        if (minArea !== "" && p.area < Number(minArea)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "recent") return (b.createdAt || 0) - (a.createdAt || 0);
        if (sortBy === "views") return (b.viewsCount || 0) - (a.viewsCount || 0);
        // Default relevance (featured first, then recent)
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [
    properties,
    quickTab,
    selectedCategory,
    selectedProvince,
    minBedrooms,
    minBathrooms,
    minArea,
    sortBy,
  ]);

  return (
    <section id="catalog-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>Portfólio Exclusivo</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-extrabold tracking-tight">
            Imóveis em Destaque
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Explore opções residenciais e comerciais rigorosamente verificadas em Angola.
          </p>
        </div>

        {/* Results Counter and Clear Filters */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
            {filteredProperties.length} {filteredProperties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-stone-900/60 hover:bg-stone-800 border border-stone-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Quick Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setQuickTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                quickTab === "all"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-950 text-stone-300 hover:bg-stone-800"
              }`}
            >
              Todos ({properties.length})
            </button>

            <button
              type="button"
              onClick={() => setQuickTab("Venda")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                quickTab === "Venda"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-950 text-stone-300 hover:bg-stone-800"
              }`}
            >
              Comprar
            </button>

            <button
              type="button"
              onClick={() => setQuickTab("Arrendamento")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                quickTab === "Arrendamento"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-950 text-stone-300 hover:bg-stone-800"
              }`}
            >
              Arrendar
            </button>

            <button
              type="button"
              onClick={() => setQuickTab("destaque")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                quickTab === "destaque"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-stone-950 text-stone-300 hover:bg-stone-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Em Destaque</span>
            </button>
          </div>

          {/* Right Filters Trigger & Sorting */}
          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showFilterDrawer || hasActiveFilters
                  ? "bg-amber-500/15 border-amber-500 text-amber-300"
                  : "bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros Avançados</span>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Row */}
        {showFilterDrawer && (
          <div className="mt-4 pt-4 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
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
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Todas</option>
                <option value="Luanda">Luanda</option>
                <option value="Malanje">Malanje</option>
                <option value="Benguela">Benguela</option>
                <option value="Huíla">Huíla</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Quartos Mínimos</label>
              <select
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
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
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Banheiros Mínimos</label>
              <select
                value={minBathrooms}
                onChange={(e) => setMinBathrooms(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
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
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Área Mínima (m²)</label>
              <input
                type="number"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value ? Number(e.target.value) : "")}
                placeholder="Ex: 150"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </div>

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
        <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800/80 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-200 mb-2">
            {properties.length === 0 ? "Catálogo Pronto e Disponível" : "Nenhum imóvel encontrado"}
          </h3>
          <p className="text-stone-400 text-sm mb-6 leading-relaxed">
            {properties.length === 0
              ? "Nenhum imóvel cadastrado de momento. O sistema está conectado à base de dados e pronto para registar os seus imóveis em tempo real pelo Painel Administrativo."
              : "Não encontramos imóveis que correspondam aos filtros selecionados. Experimente ajustar os critérios de pesquisa."}
          </p>
          {properties.length > 0 && hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors shadow-md"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      )}
    </section>
  );
};
