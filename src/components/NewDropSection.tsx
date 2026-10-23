import React from 'react';
import { Product } from '../types/product';
import { IMAGES } from '../data/products';
import { ArrowUpRight, Flame } from 'lucide-react';

interface NewDropSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateToShop: () => void;
}

export const NewDropSection: React.FC<NewDropSectionProps> = ({
  products,
  onSelectProduct,
  onNavigateToShop,
}) => {
  const newDropItems = products.filter((p) => p.isNewDrop).slice(0, 2);

  return (
    <section id="new-drops" className="py-20 bg-[#171717] text-[#F5F3EE] overflow-hidden border-b border-[#343434]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Campaign Kicker & Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-[#343434] rounded-full">
              <Flame className="w-3.5 h-3.5 text-[#A5FF00]" />
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-[#A5FF00]">
                LIMITED EDITION DROP 04 // LAGOS ARCHIVE
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase leading-none">
              NOT MADE TO BLEND IN.
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-[#F5F3EE]/70 font-medium max-w-xl">
              &ldquo;Built for your world. Worn your way.&rdquo; Heavyweight 320 GSM drops, hand-splattered pigments, and distressed silhouettes designed without apology.
            </p>
          </div>

          <button
            onClick={onNavigateToShop}
            className="px-6 py-3.5 bg-[#A5FF00] hover:bg-[#92E600] text-[#171717] font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer shadow-lg flex items-center gap-2 shrink-0"
          >
            <span>SHOP THE DROP</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Asymmetrical Campaign Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Large Left Campaign Image (Cols 1-7) */}
          <div className="lg:col-span-7 relative rounded-lg overflow-hidden border border-[#343434] group">
            <div className="relative aspect-[16/10] lg:h-full w-full">
              <img
                src={IMAGES.editorialCampaign}
                alt="SNUG WORLD Streetwear Campaign"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Editorial Caption Tag */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono-code text-[#A5FF00] font-bold uppercase tracking-widest block mb-1">
                    CAMPAIGN LOOKBOOK · BRUTALIST ARCHIVE
                  </span>
                  <p className="text-lg font-display font-extrabold text-white uppercase tracking-tight">
                    SERIES 04: DISTORTION & REBELLION
                  </p>
                </div>
                <div className="text-xs font-mono-code text-[#F5F3EE]/70">
                  <span>LAGOS / MUMBAI / GLOBAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Featured Release Garments (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {newDropItems.map((product) => {
              const defaultColor = product.colors.find((c) => c.id === product.defaultColorId) || product.colors[0];

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-[#212121] hover:bg-[#2A2A2A] border border-[#343434] hover:border-[#A5FF00]/40 rounded-lg p-5 flex items-center gap-5 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-24 sm:w-28 aspect-[3/4] bg-[#2E2E2E] rounded overflow-hidden shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={defaultColor.frontImage}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-mono-code text-[#A5FF00] font-bold uppercase tracking-wider">
                      JUST DROPPED · {product.category}
                    </span>
                    <h3 className="text-base font-bold text-white uppercase tracking-tight mt-1 group-hover:text-[#A5FF00] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#F5F3EE]/60 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-mono-code font-bold text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-mono-code text-[#A5FF00] group-hover:underline flex items-center gap-1">
                        VIEW PIECE <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Campaign Statement Box */}
            <div className="bg-[#1C1C1C] border border-[#343434] p-5 rounded-lg text-xs font-mono-code text-[#F5F3EE]/70 flex items-center justify-between">
              <span>EDITION: LIMITED TO 150 PER PIECE</span>
              <span className="text-[#A5FF00]">IT&apos;S US, NEVER THEM.</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
