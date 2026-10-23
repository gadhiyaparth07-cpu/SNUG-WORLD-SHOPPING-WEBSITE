/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Ticker } from './components/Ticker';
import { HeroClothingRod } from './components/HeroClothingRod';
import { BestsellersSection } from './components/BestsellersSection';
import { NewDropSection } from './components/NewDropSection';
import { ShopCatalog } from './components/ShopCatalog';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ProductViewerModal } from './components/ProductViewerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PRODUCTS } from './data/products';
import { Product, CartItem, ColorVariant, GarmentSize } from './types/product';
import { Check, X } from 'lucide-react';

export default function App() {
  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('snug_world_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('snug_world_cart', JSON.stringify(cartItems));
    } catch {
      // Storage unavailable
    }
  }, [cartItems]);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Quick toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Smooth scroll to anchor section
  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    color: ColorVariant,
    size: GarmentSize,
    quantity: number
  ) => {
    const cartItemId = `${product.id}-${color.id}-${size}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        const newItem: CartItem = {
          cartItemId,
          productId: product.id,
          productName: product.name,
          category: product.category,
          colorId: color.id,
          colorName: color.name,
          colorHex: color.hex,
          size,
          price: product.price,
          image: color.frontImage,
          quantity,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity}x ${product.name} (${color.name}, Size ${size}) to your bag`);
  };

  // Buy now handler (adds item and opens checkout immediately)
  const handleBuyNow = (
    product: Product,
    color: ColorVariant,
    size: GarmentSize,
    quantity: number
  ) => {
    handleAddToCart(product, color, size, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Quick add from card shortcuts
  const handleQuickAdd = (product: Product) => {
    const defaultColor =
      product.colors.find((c) => c.id === product.defaultColorId) || product.colors[0];
    const defaultSize = defaultColor.availableSizes[0] || 'L';
    handleAddToCart(product, defaultColor, defaultSize, 1);
    setIsCartOpen(true);
  };

  // Cart modifications
  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#171717] font-sans flex flex-col selection:bg-[#A5FF00] selection:text-[#171717]">
      {/* Top Subtle Announcement Bar */}
      <div className="bg-[#171717] text-[#F5F3EE] py-1.5 px-4 text-center text-[10px] sm:text-xs font-mono-code flex items-center justify-center gap-3">
        <span className="text-[#A5FF00] font-bold">DROP 04 ARCHIVE LIVE</span>
        <span className="text-[#F5F3EE]/40">·</span>
        <span>COMPLIMENTARY AIR SHIPPING ON ORDERS OVER ₹3,000</span>
        <span className="text-[#F5F3EE]/40 hidden md:inline">·</span>
        <span className="hidden md:inline text-[#A5FF00]">USE CODE &quot;SNUG10&quot; FOR 10% OFF</span>
      </div>

      {/* Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      {/* Main Page Flow */}
      <main className="flex-1 flex flex-col">
        {/* 1. The Signature Clothing Rod Showroom */}
        <HeroClothingRod
          products={PRODUCTS}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* 2. Continuously Moving Acid-Green Announcement Ticker */}
        <Ticker />

        {/* 3. Bestsellers Collection ("THE ONES EVERYONE WANTS.") */}
        <BestsellersSection
          products={PRODUCTS}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAdd}
        />

        {/* 4. New Drop Campaign ("NOT MADE TO BLEND IN.") */}
        <NewDropSection
          products={PRODUCTS}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onNavigateToShop={() => handleNavigate('shop')}
        />

        {/* 5. Complete Shop Catalog & Filter Grid */}
        <ShopCatalog
          products={PRODUCTS}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAdd}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />

        {/* 6. Brand Story & Craftsmanship ("MORE THAN WHAT YOU WEAR.") */}
        <AboutSection />
      </main>

      {/* Footer & Newsletter Capture */}
      <Footer onNavigate={handleNavigate} />

      {/* Product Detail Modal (Cinematic Showroom Viewer with Upward Liquid Dye Wave) */}
      <ProductViewerModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Global Quick Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171717] text-[#F5F3EE] px-4 py-3 rounded-lg shadow-2xl border border-[#A5FF00]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#A5FF00] text-[#171717] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono-code">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#F5F3EE]/50 hover:text-white ml-1 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
