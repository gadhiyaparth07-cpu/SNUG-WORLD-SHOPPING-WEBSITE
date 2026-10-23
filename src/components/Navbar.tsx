import React from 'react';
import { ShoppingBag, Search, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  setIsSearchOpen,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F5F3EE]/90 backdrop-blur-md border-b border-[#171717]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark & Symbol */}
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2 group text-left cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none"
          >
            <span className="w-2.5 h-2.5 bg-[#A5FF00] border border-[#171717] group-hover:scale-125 transition-transform" />
            <span className="text-xl sm:text-2xl font-display font-extrabold tracking-tighter text-[#171717] uppercase">
              SNUG WORLD
            </span>
          </button>

          {/* Zone 2: Navigation Links (Single-Line, clean text with underline hover) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-[#171717]/80 uppercase">
            <button
              onClick={() => onNavigate('clothing-rod')}
              className="hover:text-[#171717] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Showroom
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="hover:text-[#171717] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Shop All
            </button>
            <button
              onClick={() => onNavigate('new-drops')}
              className="hover:text-[#171717] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              New Drops
            </button>
            <button
              onClick={() => onNavigate('bestsellers')}
              className="hover:text-[#171717] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Bestsellers
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#171717] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Zone 3: Functional Interactive Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#171717] hover:text-[#171717]/70 transition-colors cursor-pointer rounded-md focus-visible:ring-1 focus-visible:ring-[#171717]"
              aria-label="Search clothing catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#171717] text-[#F5F3EE] hover:bg-[#343434] text-xs font-semibold tracking-wider uppercase transition-colors rounded cursor-pointer relative focus-visible:ring-2 focus-visible:ring-[#A5FF00]"
              aria-label={`Shopping bag containing ${cartCount} items`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#A5FF00]" />
              <span className="hidden sm:inline">BAG</span>
              <span className="px-1.5 py-0.2 bg-[#A5FF00] text-[#171717] font-mono-code text-[11px] font-bold rounded">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {isSearchOpen && (
          <div className="bg-[#EAE7DF] border-b border-[#171717]/10 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-[#171717]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search oversized tees, graphics, acid wash, distressed cuts..."
                className="w-full bg-transparent text-sm text-[#171717] placeholder-[#171717]/40 focus:outline-none font-medium"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-xs text-[#171717]/60 hover:text-[#171717] font-mono-code cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-[#171717]/60 hover:text-[#171717] cursor-pointer"
                aria-label="Close search bar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
