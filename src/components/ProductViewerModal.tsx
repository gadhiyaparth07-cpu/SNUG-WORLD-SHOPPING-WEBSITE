import React, { useState, useEffect, useRef } from 'react';
import { Product, ColorVariant, GarmentSize } from '../types/product';
import { X, Check, Truck, ShieldCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductViewerModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: ColorVariant, size: GarmentSize, quantity: number) => void;
  onBuyNow: (product: Product, color: ColorVariant, size: GarmentSize, quantity: number) => void;
}

export const ProductViewerModal: React.FC<ProductViewerModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  // Selected state
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(() => {
    return product.colors.find((c) => c.id === product.defaultColorId) || product.colors[0];
  });
  const [previousColor, setPreviousColor] = useState<ColorVariant>(selectedColor);

  // View angle: 'front' | 'back'
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');

  // Selected size
  const [selectedSize, setSelectedSize] = useState<GarmentSize>(() => {
    return selectedColor.availableSizes[0] || 'L';
  });

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Upward color transformation animation state
  // waveProgress: 0 to 100%
  const [isTransformingColor, setIsTransformingColor] = useState<boolean>(false);
  const [waveProgress, setWaveProgress] = useState<number>(100);
  const transformTimerRef = useRef<number | null>(null);

  // Pincode lookup state
  const [pincode, setPincode] = useState<string>('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  // Accordion tabs
  const [openAccordion, setOpenAccordion] = useState<'details' | 'shipping' | 'sizing' | null>('details');

  // Added to cart feedback
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Reset when product changes
  useEffect(() => {
    if (product) {
      const initialColor = product.colors.find((c) => c.id === product.defaultColorId) || product.colors[0];
      setSelectedColor(initialColor);
      setPreviousColor(initialColor);
      setSelectedSize(initialColor.availableSizes[0] || 'L');
      setViewAngle('front');
      setQuantity(1);
      setWaveProgress(100);
      setIsTransformingColor(false);
    }
  }, [product]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle signature upward liquid color transformation
  const handleColorChange = (newColor: ColorVariant) => {
    if (newColor.id === selectedColor.id || isTransformingColor) return;

    setPreviousColor(selectedColor);
    setSelectedColor(newColor);
    setIsTransformingColor(true);
    setWaveProgress(0);

    // If current selected size is not in new color, pick first available size
    if (!newColor.availableSizes.includes(selectedSize)) {
      setSelectedSize(newColor.availableSizes[0]);
    }

    const startTime = performance.now();
    const duration = 850; // ~850ms smooth wave climb

    const animateWave = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic bezier easing
      const eased = 1 - Math.pow(1 - progress, 3);
      setWaveProgress(eased * 100);

      if (progress < 1) {
        transformTimerRef.current = requestAnimationFrame(animateWave);
      } else {
        setWaveProgress(100);
        setIsTransformingColor(false);
        setPreviousColor(newColor);
      }
    };

    transformTimerRef.current = requestAnimationFrame(animateWave);
  };

  useEffect(() => {
    return () => {
      if (transformTimerRef.current) {
        cancelAnimationFrame(transformTimerRef.current);
      }
    };
  }, []);

  // Pincode verification handler
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryStatus(`Express Delivery verified to ${pincode} · Arrives in 2–3 business days via Bluedart Air.`);
    } else {
      setDeliveryStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2400);
  };

  const handleDirectBuy = () => {
    onBuyNow(product, selectedColor, selectedSize, quantity);
  };

  const currentFrontImg = selectedColor.frontImage;
  const currentBackImg = selectedColor.backImage;
  const prevFrontImg = previousColor.frontImage;
  const prevBackImg = previousColor.backImage;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Background Dismiss Area */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Fitting Room Modal Container */}
      <div className="relative w-full max-w-6xl bg-[#F5F3EE] rounded-lg shadow-2xl border border-[#171717]/15 overflow-hidden z-10 my-auto">
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#171717]/10 bg-[#EFECE5]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#A5FF00] rounded-full" />
            <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase text-[#171717]">
              SNUG WORLD FITTING ROOM // {product.slug}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#171717] hover:text-[#A5FF00] text-[#171717] transition-colors cursor-pointer"
            aria-label="Close product inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 p-4 sm:p-8">

          {/* LEFT COLUMN: Garment Stage with Hanging Color Tags (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 relative">

            {/* HANGING COLOR TAGS RACK (Physical Tags Inspired by Reference Image 2) */}
            <div className="order-2 sm:order-1 flex sm:flex-col items-center gap-3 sm:pt-10 z-20 overflow-x-auto max-w-full pb-2 sm:pb-0">
              <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#171717]/50 hidden sm:block mb-1 text-center">
                SHADE TAGS
              </span>

              {product.colors.map((color) => {
                const isActive = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    disabled={isTransformingColor}
                    className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 focus-visible:outline-none ${
                      isActive ? 'scale-105 -translate-y-1' : 'opacity-85 hover:opacity-100 hover:-translate-y-0.5'
                    }`}
                    aria-label={`Select color ${color.name}`}
                  >
                    {/* Hanging String */}
                    <div className="w-[1.5px] h-4 sm:h-6 bg-[#8C8A85] group-hover:bg-[#171717] transition-colors" />

                    {/* Physical Tag Card (Kraft textured, punched hole, clean vertical typography) */}
                    <div
                      className={`relative w-9 sm:w-11 py-2 sm:py-3 px-1 rounded-sm border transition-all duration-200 flex flex-col items-center shadow-md ${
                        isActive
                          ? 'border-[#171717] bg-[#171717] text-[#A5FF00] shadow-lg ring-2 ring-[#A5FF00]'
                          : 'border-[#171717]/30 bg-[#E8E4DA] text-[#171717] hover:border-[#171717]'
                      }`}
                    >
                      {/* Punched Hole at top */}
                      <div className="w-2 h-2 rounded-full border border-black/40 bg-[#F5F3EE] mb-1.5 shadow-inner" />

                      {/* Color Swatch Dot */}
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-sm mb-1.5"
                        style={{ backgroundColor: color.hex }}
                      />

                      {/* Vertical Color Abbr / Name */}
                      <span className="text-[9px] font-mono-code font-bold tracking-tighter uppercase writing-mode-vertical rotate-180">
                        {color.name.split(' ')[0]}
                      </span>

                      {/* Small Active Pip */}
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-[#A5FF00] rounded-full mt-1.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* GARMENT SHOWCASE STAGE */}
            <div className="order-1 sm:order-2 flex-1 flex flex-col items-center w-full max-w-md">

              {/* View Angle Switcher (FRONT | BACK) with 3D Card-Turn Feel */}
              <div className="flex items-center gap-1 p-1 bg-[#E2DDCF] rounded-md border border-[#171717]/15 mb-4 shadow-inner">
                <button
                  onClick={() => setViewAngle('front')}
                  className={`px-4 py-1 text-xs font-mono-code font-bold uppercase transition-all rounded cursor-pointer ${
                    viewAngle === 'front'
                      ? 'bg-[#171717] text-[#A5FF00] shadow-sm'
                      : 'text-[#171717]/70 hover:text-[#171717]'
                  }`}
                >
                  FRONT VIEW
                </button>
                <button
                  onClick={() => setViewAngle('back')}
                  className={`px-4 py-1 text-xs font-mono-code font-bold uppercase transition-all rounded cursor-pointer ${
                    viewAngle === 'back'
                      ? 'bg-[#171717] text-[#A5FF00] shadow-sm'
                      : 'text-[#171717]/70 hover:text-[#171717]'
                  }`}
                >
                  BACK VIEW
                </button>
              </div>

              {/* The Interactive T-Shirt Canvas with Upward Climbing Wave */}
              <div className="relative w-full aspect-[3/4] max-w-sm rounded-lg flex items-center justify-center p-2 perspective-1000">

                {/* Base Layer: Previous Garment Image */}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img
                    src={viewAngle === 'front' ? prevFrontImg : prevBackImg}
                    alt={`${product.name} - ${previousColor.name}`}
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.22)] select-none"
                  />
                </div>

                {/* Overlay Layer: New Garment Image Revealed via Upward-Climbing Clip-Path */}
                {isTransformingColor && (
                  <div
                    className="absolute inset-0 flex items-center justify-center p-2 z-10 transition-none"
                    style={{
                      // Upward reveal: inset(top, right, bottom, left)
                      // When waveProgress = 0, top = 100% (hidden)
                      // When waveProgress = 100%, top = 0% (fully visible)
                      clipPath: `inset(${100 - waveProgress}% 0 0 0)`,
                    }}
                  >
                    <img
                      src={viewAngle === 'front' ? currentFrontImg : currentBackImg}
                      alt={`${product.name} - ${selectedColor.name}`}
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.22)] select-none"
                    />

                    {/* Liquid Fabric Wave Climbing Divider Line */}
                    <div
                      className="absolute left-4 right-4 h-1.5 bg-gradient-to-r from-transparent via-[#A5FF00] to-transparent dye-divider-glow pointer-events-none"
                      style={{
                        top: `${100 - waveProgress}%`,
                        transform: 'translateY(-50%)',
                      }}
                    />
                  </div>
                )}

                {/* Static Image when not transforming */}
                {!isTransformingColor && (
                  <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                    <img
                      src={viewAngle === 'front' ? currentFrontImg : currentBackImg}
                      alt={`${product.name} - ${selectedColor.name}`}
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.22)] select-none transition-transform duration-500 hover:scale-102"
                    />
                  </div>
                )}

                {/* Upward Color Climb Transformation Toast */}
                {isTransformingColor && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-[#171717] text-[#A5FF00] text-[10px] font-mono-code font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3 h-3 text-[#A5FF00]" />
                    <span>DYE FLOW: {selectedColor.name}</span>
                  </div>
                )}
              </div>

              {/* Garment Silhouette Badges */}
              <div className="flex items-center gap-3 mt-3 text-[11px] font-mono-code text-[#171717]/70">
                <span className="bg-[#E7E2D6] px-2 py-0.5 rounded border border-[#171717]/15">
                  {product.gsm} GSM HEAVYWEIGHT
                </span>
                <span className="bg-[#E7E2D6] px-2 py-0.5 rounded border border-[#171717]/15">
                  BOXY DROP SHOULDER
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Purchase Module & Product Specifications (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-6 lg:pt-0">
            <div>
              {/* Product Title & Pricing */}
              <div className="border-b border-[#171717]/10 pb-4">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#171717]/60 block mb-1">
                  SNUG WORLD · ARCHIVE APPAREL
                </span>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-[#171717] uppercase tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-[#171717]/70 mt-1 font-medium">
                  {product.subtitle}
                </p>

                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-mono-code font-extrabold text-[#171717]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm font-mono-code line-through text-[#171717]/40">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[10px] font-mono-code font-bold text-[#171717] bg-[#A5FF00] px-2 py-0.5 rounded">
                    INCLUSIVE OF ALL TAXES
                  </span>
                </div>
              </div>

              {/* Selected Color & Size Selector */}
              <div className="py-4 border-b border-[#171717]/10 space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-[#171717]">SELECTED SHADE</span>
                    <span className="font-mono-code font-bold text-[#171717] uppercase flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/30 inline-block"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      {selectedColor.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#171717]/60">
                    Click the hanging craft tags on the left to trigger the upward liquid dye climb.
                  </p>
                </div>

                {/* Available Sizes */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-[#171717]">SELECT SIZE</span>
                    <span className="text-[11px] font-mono-code text-[#171717]/60">
                      Oversized Fit (Size down for regular)
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {(['S', 'M', 'L', 'XL', 'XXL'] as GarmentSize[]).map((size) => {
                      const isAvailable = selectedColor.availableSizes.includes(size);
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          disabled={!isAvailable}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 text-xs font-mono-code font-bold uppercase rounded border transition-all cursor-pointer ${
                            !isAvailable
                              ? 'opacity-30 border-dashed border-[#171717]/30 line-through cursor-not-allowed bg-transparent'
                              : isSelected
                              ? 'bg-[#171717] text-[#A5FF00] border-[#171717] shadow-sm'
                              : 'bg-[#EAE6DC] text-[#171717] border-[#171717]/20 hover:border-[#171717]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Stepper & Stock Notice */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#171717]">QTY:</span>
                    <div className="flex items-center border border-[#171717]/30 rounded bg-[#EAE6DC]">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-1 text-xs font-mono-code font-bold text-[#171717] hover:bg-black/10 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-mono-code font-bold text-[#171717]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedColor.stockCount, quantity + 1))}
                        className="px-2.5 py-1 text-xs font-mono-code font-bold text-[#171717] hover:bg-black/10 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono-code text-[#171717]/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#A5FF00] rounded-full" />
                    {selectedColor.stockCount} units remaining in stock
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add to Bag & Buy Now */}
              <div className="py-4 space-y-2.5">
                <button
                  onClick={handleAdd}
                  className="w-full py-3.5 bg-[#171717] hover:bg-[#343434] text-[#F5F3EE] text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 group"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-[#A5FF00]" />
                      <span className="text-[#A5FF00]">ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <span>ADD TO BAG</span>
                      <span className="font-mono-code text-[#A5FF00]">·</span>
                      <span className="font-mono-code">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectBuy}
                  className="w-full py-3 bg-[#A5FF00] hover:bg-[#92E600] text-[#171717] text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer shadow-sm border border-[#171717]"
                >
                  BUY NOW (EXPRESS CHECKOUT)
                </button>
              </div>

              {/* Delivery PIN Code Checker */}
              <div className="py-3 border-t border-[#171717]/10">
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit PIN code (e.g. 400001)"
                      className="w-full px-3 py-1.5 text-xs font-mono-code bg-[#EAE6DC] border border-[#171717]/20 rounded placeholder-[#171717]/40 text-[#171717] focus:outline-none focus:border-[#171717]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#171717] text-[#F5F3EE] hover:bg-[#343434] text-xs font-mono-code uppercase rounded cursor-pointer"
                  >
                    CHECK
                  </button>
                </form>
                {deliveryStatus && (
                  <p className="text-[11px] font-mono-code text-[#171717] mt-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#A5FF00]" />
                    {deliveryStatus}
                  </p>
                )}
              </div>

              {/* Collapsible Accordions: Craftsmanship, Shipping, Sizing */}
              <div className="border-t border-[#171717]/10 divide-y divide-[#171717]/10 mt-2">
                {/* Details & Fabric */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                    className="w-full py-2.5 flex items-center justify-between text-xs font-bold uppercase text-[#171717] cursor-pointer"
                  >
                    <span>FABRIC & CRAFTSMANSHIP</span>
                    {openAccordion === 'details' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordion === 'details' && (
                    <div className="pb-3 text-xs text-[#171717]/80 space-y-1.5">
                      <p>{product.description}</p>
                      <ul className="list-disc list-inside space-y-1 text-[11px] pt-1 text-[#171717]/70">
                        {product.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Shipping & Returns */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                    className="w-full py-2.5 flex items-center justify-between text-xs font-bold uppercase text-[#171717] cursor-pointer"
                  >
                    <span>SHIPPING & 7-DAY EASY RETURNS</span>
                    {openAccordion === 'shipping' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="pb-3 text-xs text-[#171717]/80 space-y-1">
                      <p>• Complimentary standard shipping on all orders exceeding ₹3,000 across India.</p>
                      <p>• Dispatched within 24 hours from our Mumbai fulfillment archive.</p>
                      <p>• Hassle-free 7-day doorstep pickup returns & size exchanges.</p>
                    </div>
                  )}
                </div>

                {/* Sizing & Fit */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'sizing' ? null : 'sizing')}
                    className="w-full py-2.5 flex items-center justify-between text-xs font-bold uppercase text-[#171717] cursor-pointer"
                  >
                    <span>SIZING MATRIX & MODEL SPECS</span>
                    {openAccordion === 'sizing' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordion === 'sizing' && (
                    <div className="pb-3 text-xs text-[#171717]/80 space-y-1">
                      <p>• Model is 6&apos;1&quot; (185cm) wearing Size L for standard oversized look.</p>
                      <p>• Chest measurements: S (42&quot;), M (44&quot;), L (47&quot;), XL (50&quot;), XXL (53&quot;).</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Guarantee Marker */}
            <div className="mt-4 pt-3 border-t border-[#171717]/10 flex items-center justify-between text-[11px] font-mono-code text-[#171717]/60">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#171717]" />
                100% AUTHENTIC ARCHIVE PIECE
              </span>
              <span>TAGLINE: IT&apos;S US, NEVER THEM.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
