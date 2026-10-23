import React, { useState, useRef } from 'react';
import { Product } from '../types/product';
import { Eye, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroClothingRodProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const HeroClothingRod: React.FC<HeroClothingRodProps> = ({
  products,
  onSelectProduct,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const rodScrollRef = useRef<HTMLDivElement>(null);

  // The featured center product
  const featuredProduct = products.find((p) => p.isFeatured) || products[0];

  const scrollRod = (direction: 'left' | 'right') => {
    if (rodScrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      rodScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="clothing-rod" className="relative w-full overflow-hidden showroom-backdrop pt-8 pb-14 border-b border-[#171717]/10">
      {/* Studio Showroom Lighting & Top Wall Ambience */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.85)_0%,rgba(245,243,238,0)_70%)]" />

      {/* Showroom Header Kicker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-[#A5FF00] rounded-full" />
          <span className="text-[11px] font-mono-code uppercase tracking-widest text-[#171717]/60">
            FLAGSHIP STUDIO SHOWROOM · LAGOS & WORLDWIDE
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-[#171717] uppercase">
          THE CLOTHING ROD
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#171717]/60 max-w-lg mx-auto font-medium">
          Physical garments suspended on natural oak hangers. Hover to rotate toward front; click to enter the digital fitting room.
        </p>
      </div>

      {/* Rack Navigation Buttons for Mobile / Desktop Horizontal Glide */}
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-2 pointer-events-none">
        <span className="text-[10px] font-mono-code tracking-wider text-[#171717]/40 uppercase pointer-events-auto">
          SLIDE TO BROWSE RACK
        </span>
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => scrollRod('left')}
            className="p-1.5 rounded-full border border-[#171717]/20 bg-[#F5F3EE] hover:bg-[#171717] hover:text-[#A5FF00] text-[#171717] transition-colors cursor-pointer shadow-sm"
            aria-label="Scroll rod left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollRod('right')}
            className="p-1.5 rounded-full border border-[#171717]/20 bg-[#F5F3EE] hover:bg-[#171717] hover:text-[#A5FF00] text-[#171717] transition-colors cursor-pointer shadow-sm"
            aria-label="Scroll rod right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* THE PHYSICAL CLOTHING ROD & HANGING SHIRTS CONTAINER */}
      <div className="relative w-full overflow-x-auto no-scrollbar scroll-smooth py-6 px-4 sm:px-12" ref={rodScrollRef}>
        <div className="relative min-w-[1280px] max-w-[1700px] mx-auto h-[530px] flex items-start justify-center">

          {/* 1. Metal Clothing Rod Rail (Brushed Stainless Steel Tube) */}
          <div className="absolute top-6 left-0 right-0 h-4 bg-gradient-to-b from-[#D4D2CD] via-[#F0EEEA] to-[#8C8A85] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.15)] z-20 flex items-center justify-between px-2">
            {/* Left Wall Mounting Bracket */}
            <div className="w-4 h-9 -ml-2 bg-gradient-to-r from-[#2B2B2B] to-[#595959] rounded shadow-md border-r border-[#171717]" />
            {/* Center Reinforcement Bracket */}
            <div className="w-3 h-7 bg-gradient-to-b from-[#404040] to-[#737373] rounded-sm shadow-inner opacity-80" />
            {/* Right Wall Mounting Bracket */}
            <div className="w-4 h-9 -mr-2 bg-gradient-to-l from-[#2B2B2B] to-[#595959] rounded shadow-md border-l border-[#171717]" />
          </div>

          {/* Subtle Wall Cast Shadow from Rod */}
          <div className="absolute top-10 left-4 right-4 h-6 bg-gradient-to-b from-black/10 to-transparent blur-sm pointer-events-none z-10" />

          {/* 2. Hanging T-Shirts Array */}
          <div className="relative w-full h-full flex items-start justify-between px-10 pt-6">
            {products.map((product) => {
              const isHovered = hoveredId === product.id;
              const isFeatured = product.id === featuredProduct.id;
              const defaultColor = product.colors.find((c) => c.id === product.defaultColorId) || product.colors[0];

              // Natural resting angle (staggered slightly for physical organic look)
              const restingAngle = product.defaultAngle || -4;

              return (
                <div
                  key={product.id}
                  className="relative flex flex-col items-center cursor-pointer select-none group transition-all duration-500"
                  style={{
                    zIndex: isHovered ? 35 : isFeatured ? 25 : 20,
                  }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelectProduct(product)}
                >
                  {/* Metal Hanger Hook connecting to the rod */}
                  <div className="relative w-7 h-10 flex flex-col items-center -mt-2 z-25">
                    {/* Metal Hook Loop curving over rod */}
                    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="drop-shadow-sm">
                      <path
                        d="M 12 28 L 12 14 C 12 7, 20 7, 20 12 C 20 15, 17 17, 14 17"
                        stroke="#4A4A4A"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* 3D Transform Garment Shell */}
                  <div
                    className="relative flex flex-col items-center perspective-1000"
                    style={{
                      transform: isHovered
                        ? 'translateY(12px) scale(1.06)'
                        : isFeatured
                        ? 'translateY(4px) scale(1.02)'
                        : 'translateY(0px) scale(0.96)',
                      transition: 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                  >
                    {/* Hanging Garment Card with side-to-front 3D rotation */}
                    <div
                      className="relative w-44 sm:w-48 transition-transform duration-600 ease-out transform-style-3d"
                      style={{
                        transform: isHovered
                          ? 'rotateY(0deg) rotateZ(0deg)'
                          : `rotateY(${restingAngle * 3}deg) rotateZ(${restingAngle * 0.4}deg)`,
                      }}
                    >
                      {/* Product Image on natural hanger */}
                      <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-transparent">
                        <img
                          src={defaultColor.frontImage}
                          alt={product.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] group-hover:drop-shadow-[0_20px_35px_rgba(0,0,0,0.28)] transition-all duration-500"
                          loading="eager"
                        />

                        {/* Physical Hanging Brand Tag Attached with String */}
                        <div className="absolute top-16 right-3 pointer-events-none transform rotate-12 transition-transform duration-300 group-hover:rotate-6">
                          <div className="w-0.5 h-6 bg-[#8C8A85] mx-auto" />
                          <div className="bg-[#E7E2D6] border border-[#171717]/30 px-1 py-1.5 shadow-sm text-[8px] font-mono-code font-bold text-[#171717] tracking-widest text-center writing-mode-vertical">
                            SNUG
                          </div>
                        </div>

                        {/* Hover Quick Action Indicator */}
                        <div
                          className={`absolute inset-0 bg-black/10 backdrop-blur-[1px] flex flex-col items-center justify-center transition-opacity duration-300 ${
                            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                          }`}
                        >
                          <div className="px-3 py-1.5 bg-[#171717] text-[#A5FF00] text-[10px] font-mono-code font-bold uppercase tracking-wider rounded flex items-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Eye className="w-3 h-3" />
                            <span>VIEW DETAILS</span>
                          </div>
                        </div>
                      </div>

                      {/* Natural Hanging Cast Shadow on Wall */}
                      <div
                        className="w-32 h-4 bg-black/15 blur-md rounded-full mx-auto -mt-2 transition-all duration-500"
                        style={{
                          transform: isHovered ? 'scale(1.15) translateY(6px)' : 'scale(1)',
                          opacity: isHovered ? 0.35 : 0.2,
                        }}
                      />
                    </div>

                    {/* Product Micro-Caption Below Shirt */}
                    <div
                      className={`mt-3 text-center transition-all duration-300 max-w-[180px] ${
                        isHovered || isFeatured ? 'opacity-100 transform-none' : 'opacity-40 translate-y-1'
                      }`}
                    >
                      <h4 className="text-[11px] font-bold tracking-tight uppercase truncate text-[#171717]">
                        {product.name}
                      </h4>
                      <p className="text-[11px] font-mono-code font-semibold text-[#171717]/70 mt-0.5">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                      {product.isBestseller && (
                        <span className="text-[9px] font-mono-code text-[#171717] font-bold bg-[#A5FF00] px-1.5 py-0.2 rounded mt-1 inline-block">
                          BESTSELLER
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Featured Garment Prominent Caption & Discover Button (Matches Reference Image) */}
      <div className="max-w-2xl mx-auto px-4 mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171717]/5 rounded-full mb-3">
          <span className="text-[11px] font-mono-code font-semibold text-[#171717] uppercase tracking-wider">
            FEATURED ARCHIVE DROP · 320 GSM OVERSIZED
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-[#171717] tracking-tight uppercase">
          {featuredProduct.name}
        </h2>
        <div className="flex items-center justify-center gap-3 mt-1.5">
          <span className="text-lg font-mono-code font-bold text-[#171717]">
            ₹{featuredProduct.price.toLocaleString('en-IN')}
          </span>
          {featuredProduct.originalPrice && (
            <span className="text-sm font-mono-code line-through text-[#171717]/40">
              ₹{featuredProduct.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="text-[10px] font-mono-code font-bold text-[#171717] bg-[#A5FF00] px-2 py-0.5 rounded">
            LIMITED STOCK
          </span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => onSelectProduct(featuredProduct)}
            className="px-6 py-3 bg-[#171717] hover:bg-[#343434] text-[#F5F3EE] text-xs font-bold uppercase tracking-widest transition-all rounded cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2 group"
          >
            <span>DISCOVER PRODUCT</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#A5FF00] group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#shop"
            className="px-5 py-3 border border-[#171717] hover:bg-[#171717] hover:text-[#F5F3EE] text-[#171717] text-xs font-bold uppercase tracking-widest transition-all rounded cursor-pointer"
          >
            EXPLORE CATALOG
          </a>
        </div>
      </div>
    </section>
  );
};
