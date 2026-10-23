import React from 'react';
import { CartItem } from '../types/product';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 3000;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 150;
  const total = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F5F3EE] shadow-2xl flex flex-col border-l border-[#171717]/15">

          {/* Drawer Header */}
          <div className="p-5 border-b border-[#171717]/10 flex items-center justify-between bg-[#EFECE5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#171717]" />
              <h2 className="text-sm font-display font-extrabold uppercase tracking-tight text-[#171717]">
                YOUR SHOPPING BAG ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#171717] hover:text-[#A5FF00] text-[#171717] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#E5E1D6] px-5 py-3 border-b border-[#171717]/10 text-xs font-mono-code">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-[#171717]/80">
                Add <strong className="text-[#171717]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-[#171717]">FREE SHIPPING</strong> across India.
              </p>
            ) : (
              <p className="text-[#171717] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#A5FF00] rounded-full" />
                CONGRATS! YOU UNLOCKED FREE EXPRESS SHIPPING.
              </p>
            )}
            <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#171717] transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Itemized Cart List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#171717]/10">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.cartItemId} className="py-4 flex gap-4 first:pt-0">
                  {/* Thumbnail */}
                  <div className="w-20 aspect-[3/4] bg-[#EAE6DC] rounded border border-[#171717]/10 p-1 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase tracking-tight text-[#171717] line-clamp-1">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-[#171717]/40 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono-code text-[#171717]/70">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full border border-black/30"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </span>
                        <span>·</span>
                        <span>SIZE: {item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#171717]/30 rounded bg-[#EAE6DC]">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-mono-code font-bold text-[#171717] hover:bg-black/10"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono-code font-bold text-[#171717]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-mono-code font-bold text-[#171717] hover:bg-black/10"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-mono-code font-bold text-[#171717]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <ShoppingBag className="w-10 h-10 text-[#171717]/30 mx-auto mb-3" />
                <p className="text-sm font-bold uppercase text-[#171717]">
                  YOUR SHOPPING BAG IS EMPTY
                </p>
                <p className="text-xs text-[#171717]/60 mt-1 max-w-xs mx-auto">
                  Explore the clothing rod or browse the archive to select oversized tees and limited pieces.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2.5 bg-[#171717] text-[#A5FF00] text-xs font-mono-code font-bold uppercase rounded cursor-pointer hover:bg-[#343434]"
                >
                  DISCOVER THE SHOWROOM
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer & Total Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#171717]/10 bg-[#EFECE5] space-y-3">
              <div className="space-y-1.5 text-xs font-mono-code">
                <div className="flex justify-between text-[#171717]/70">
                  <span>SUBTOTAL</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#171717]/70">
                  <span>ESTIMATED SHIPPING</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[#171717] font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#171717] pt-2 border-t border-[#171717]/10">
                  <span>TOTAL DUE</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#171717] hover:bg-[#343434] text-[#F5F3EE] text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 text-[#A5FF00] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono-code text-[#171717]/60 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SECURE CHECKOUT · UPI / CARDS / CASH ON DELIVERY</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
