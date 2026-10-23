import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, GarmentSize } from '../types/product';
import { Filter, SlidersHorizontal, X, RotateCcw, Eye, ShoppingBag } from 'lucide-react';

interface ShopCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  products,
  onSelectProduct,
  onQuickAdd,
  searchQuery,
  onClearSearch,
}) => {
  // Category tabs
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');

  // Filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Filter state
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'ALL ARCHIVE' },
    { id: 'oversized', label: 'OVERSIZED TEES' },
    { id: 'graphic', label: 'GRAPHIC TEES' },
    { id: 'distressed', label: 'DISTRESSED' },
    { id: 'minimal', label: 'MINIMAL ESSENTIALS' },
    { id: 'new_drops', label: 'NEW ARRIVALS' },
    { id: 'bestsellers', label: 'BESTSELLERS' },
  ];

  // Available unique colors across products
  const uniqueColors = useMemo(() => {
    const map = new Map<string, { id: string; name: string; hex: string }>();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        if (!map.has(c.id)) {
          map.set(c.id, { id: c.id, name: c.name, hex: c.hex });
        }
      });
    });
    return Array.from(map.values());
  }, [products]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSub = p.subtitle.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchSub && !matchDesc && !matchCat) return false;
        }

        // Category match
        if (selectedCategory === 'oversized' && p.category !== 'oversized') return false;
        if (selectedCategory === 'graphic' && p.category !== 'graphic') return false;
        if (selectedCategory === 'distressed' && p.category !== 'distressed') return false;
        if (selectedCategory === 'minimal' && p.category !== 'minimal') return false;
        if (selectedCategory === 'new_drops' && !p.isNewDrop) return false;
        if (selectedCategory === 'bestsellers' && !p.isBestseller) return false;

        // Color match
        if (selectedColor !== 'all') {
          const hasColor = p.colors.some((c) => c.id === selectedColor);
          if (!hasColor) return false;
        }

        // Size match
        if (selectedSize !== 'all') {
          const hasSize = p.colors.some((c) => c.availableSizes.includes(selectedSize as GarmentSize));
          if (!hasSize) return false;
        }

        // Price range
        if (p.price > maxPrice) return false;

        // Stock filter
        if (inStockOnly && p.stockStatus === 'limited_run') return true;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNewDrop ? 1 : 0) - (a.isNewDrop ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedColor, selectedSize, maxPrice, inStockOnly, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setMaxPrice(3500);
    setInStockOnly(false);
    setSortBy('featured');
    onClearSearch();
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedColor !== 'all' ||
    selectedSize !== 'all' ||
    maxPrice < 3500 ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  return (
    <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#171717]/10">

      {/* Catalog Title & Description */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-[#A5FF00] rounded-full" />
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#171717]/60">
            THE COMPLETE COLLECTION
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#171717] tracking-tight uppercase">
          CURATED STREETWEAR CATALOG
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#171717]/70 font-medium max-w-2xl">
          Heavyweight carded cottons, exaggerated proportions, and mineral vintage washes. Every silhouette engineered to endure.
        </p>
      </div>

      {/* Search notification banner if searching */}
      {searchQuery && (
        <div className="mb-6 bg-[#EBE7DD] border border-[#171717]/15 rounded-md px-4 py-2.5 flex items-center justify-between text-xs font-mono-code">
          <span>
            SEARCHING FOR: <strong className="text-[#171717]">&ldquo;{searchQuery}&rdquo;</strong> ({filteredProducts.length} results)
          </span>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1 text-[#171717] hover:underline font-bold cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> CLEAR SEARCH
          </button>
        </div>
      )}

      {/* Interactive Category Tabs (Functional Segmented Control) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-mono-code font-bold uppercase rounded transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#171717] text-[#A5FF00] shadow-sm'
                  : 'bg-[#EAE6DC] text-[#171717]/80 hover:bg-[#DDD8CD] hover:text-[#171717]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 border-y border-[#171717]/10 mb-8 bg-[#F0EDE6]/60 px-4 rounded-md">
        {/* Filter Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-3.5 py-1.5 text-xs font-mono-code font-bold uppercase rounded border transition-colors flex items-center gap-2 cursor-pointer ${
              isFilterOpen || hasActiveFilters
                ? 'bg-[#171717] text-[#A5FF00] border-[#171717]'
                : 'bg-[#F5F3EE] text-[#171717] border-[#171717]/20 hover:border-[#171717]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTERS</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 bg-[#A5FF00] rounded-full" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-mono-code text-[#171717]/60 hover:text-[#171717] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}

          <span className="text-xs font-mono-code text-[#171717]/50 hidden md:inline">
            SHOWING {filteredProducts.length} ITEMS
          </span>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code text-[#171717]/60 uppercase whitespace-nowrap">
            SORT BY:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-mono-code font-bold uppercase bg-[#F5F3EE] border border-[#171717]/20 rounded text-[#171717] cursor-pointer focus:outline-none focus:border-[#171717]"
          >
            <option value="featured">Featured Archive</option>
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Collapsible Filter Tray */}
      {isFilterOpen && (
        <div className="bg-[#EBE7DD] border border-[#171717]/15 rounded-lg p-5 mb-8 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Filter: Color */}
            <div>
              <label className="text-xs font-mono-code font-bold uppercase text-[#171717] block mb-2">
                SHADE / DYE
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-2.5 py-1 text-[11px] font-mono-code rounded border ${
                    selectedColor === 'all'
                      ? 'bg-[#171717] text-[#A5FF00] border-[#171717]'
                      : 'bg-[#F5F3EE] text-[#171717] border-[#171717]/20'
                  }`}
                >
                  ALL
                </button>
                {uniqueColors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono-code rounded border ${
                      selectedColor === c.id
                        ? 'bg-[#171717] text-[#A5FF00] border-[#171717]'
                        : 'bg-[#F5F3EE] text-[#171717] border-[#171717]/20'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full border border-black/30"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Size */}
            <div>
              <label className="text-xs font-mono-code font-bold uppercase text-[#171717] block mb-2">
                SIZE AVAILABILITY
              </label>
              <div className="flex gap-1.5">
                {['all', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 text-xs font-mono-code font-bold rounded border ${
                      selectedSize === sz
                        ? 'bg-[#171717] text-[#A5FF00] border-[#171717]'
                        : 'bg-[#F5F3EE] text-[#171717] border-[#171717]/20'
                    }`}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Price Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono-code font-bold uppercase text-[#171717]">
                  MAX PRICE
                </label>
                <span className="text-xs font-mono-code font-bold text-[#171717]">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={3500}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#171717] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-code text-[#171717]/50 mt-1">
                <span>₹2,000</span>
                <span>₹3,500</span>
              </div>
            </div>

            {/* Filter: In Stock */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-code font-bold uppercase text-[#171717] select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#171717] text-[#171717] focus:ring-[#A5FF00] w-4 h-4 accent-[#171717]"
                />
                <span>READY TO SHIP ONLY</span>
              </label>
              <p className="text-[10px] text-[#171717]/50 font-mono-code mt-1">
                Excludes limited preorder runs
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Product Grid (Large Imagery Editorial 3-4 Col Grid) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const defaultColor = product.colors.find((c) => c.id === product.defaultColorId) || product.colors[0];

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col cursor-pointer transition-all duration-300"
              >
                {/* Image Box */}
                <div className="relative aspect-[3/4] w-full bg-[#EAE7DF] rounded-md overflow-hidden border border-[#171717]/10 p-4 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <img
                    src={defaultColor.frontImage}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Corner Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {product.isNewDrop && (
                      <span className="text-[9px] font-mono-code font-bold bg-[#171717] text-[#A5FF00] px-2 py-0.5 rounded shadow-sm">
                        NEW DROP
                      </span>
                    )}
                    {product.isBestseller && !product.isNewDrop && (
                      <span className="text-[9px] font-mono-code font-bold bg-[#A5FF00] text-[#171717] px-2 py-0.5 rounded shadow-sm">
                        BESTSELLER
                      </span>
                    )}
                    <span className="text-[9px] font-mono-code bg-[#171717]/80 text-[#F5F3EE] px-1.5 py-0.2 rounded w-fit">
                      {product.gsm} GSM
                    </span>
                  </div>

                  {/* Color Swatch Dots */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10 bg-[#171717]/80 backdrop-blur-sm px-2 py-1 rounded-full">
                    {product.colors.map((c) => (
                      <span
                        key={c.id}
                        className="w-2.5 h-2.5 rounded-full border border-white/40"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="p-2.5 bg-[#F5F3EE] hover:bg-[#A5FF00] text-[#171717] rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="Inspect Garment Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product);
                      }}
                      className="p-2.5 bg-[#171717] hover:bg-[#A5FF00] text-[#F5F3EE] hover:text-[#171717] rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Text & Metadata (Anti-Pill Rule Compliant) */}
                <div className="mt-4 flex flex-col">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-sm font-bold tracking-tight uppercase text-[#171717] group-hover:text-[#343434] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="text-sm font-mono-code font-bold text-[#171717] shrink-0">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-[#171717]/60 mt-1 line-clamp-1 font-medium">
                    {product.subtitle}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-mono-code text-[#171717]/50">
                    <span>{product.colors.length} SHADES</span>
                    <span>·</span>
                    <span>{product.fabric.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-[#EAE6DC] rounded-lg border border-dashed border-[#171717]/20 p-8">
          <p className="text-base font-bold text-[#171717] uppercase">
            NO GARMENTS MATCH YOUR CURRENT FILTERS
          </p>
          <p className="text-xs text-[#171717]/60 mt-1">
            Try resetting your price range, color selection, or search query.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 bg-[#171717] text-[#A5FF00] text-xs font-mono-code font-bold uppercase rounded cursor-pointer hover:bg-[#343434] transition-colors"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}
    </section>
  );
};
