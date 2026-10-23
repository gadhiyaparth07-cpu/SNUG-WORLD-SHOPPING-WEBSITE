import React, { useRef } from 'react';
import { Product } from '../types/product';
import { ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react';

interface BestsellersSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({
  products,
  onSelectProduct,
  onQuickAdd,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter bestselling items
  const bestsellers = products.filter((p) => p.isBestseller);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="bestsellers" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#171717]/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-[#A5FF00] rounded-full" />
            <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#171717]/60">
              ARCHIVE CURATION
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#171717] tracking-tight uppercase">
            THE ONES EVERYONE WANTS.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#171717]/70 font-medium">
            Streetwear staples. Limited runs. No ordinary fits.
          </p>
        </div>

        {/* Gallery Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-code text-[#171717]/60 hidden sm:inline">
            SWIPE OR GLIDE
          </span>
          <button
            onClick={() => scroll('left')}
            className="p-3 rounded-full border border-[#171717]/20 hover:bg-[#171717] hover:text-[#A5FF00] text-[#171717] transition-all cursor-pointer shadow-sm"
            aria-label="Previous bestsellers"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 rounded-full border border-[#171717]/20 hover:bg-[#171717] hover:text-[#A5FF00] text-[#171717] transition-all cursor-pointer shadow-sm"
            aria-label="Next bestsellers"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Editorial Gallery */}
      <div
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2"
      >
        {bestsellers.map((product) => {
          const defaultColor = product.colors.find((c) => c.id === product.defaultColorId) || product.colors[0];

          return (
            <div
              key={product.id}
              className="flex-none w-[280px] sm:w-[340px] group flex flex-col cursor-pointer"
              onClick={() => onSelectProduct(product)}
            >
              {/* Product Card Media Box */}
              <div className="relative aspect-[3/4] w-full bg-[#EAE7DF] rounded-md overflow-hidden border border-[#171717]/10 p-4 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                {/* Front Image */}
                <img
                  src={defaultColor.frontImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Corner Label */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  <span className="text-[10px] font-mono-code font-bold bg-[#A5FF00] text-[#171717] px-2 py-0.5 rounded shadow-sm">
                    BESTSELLER
                  </span>
                  <span className="text-[9px] font-mono-code bg-[#171717] text-[#F5F3EE] px-1.5 py-0.2 rounded w-fit">
                    {product.gsm} GSM
                  </span>
                </div>

                {/* Available Color Dots */}
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

                {/* Hover Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="p-2.5 bg-[#F5F3EE] hover:bg-[#A5FF00] text-[#171717] rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                    title="View Garment Details"
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

              {/* Product Info Metadata */}
              <div className="mt-4 flex flex-col">
                <div className="flex justify-between items-start gap-2">
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
                  <span>{product.fit.split(',')[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
