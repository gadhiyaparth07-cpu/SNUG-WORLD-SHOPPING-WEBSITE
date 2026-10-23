import React, { useState } from 'react';
import { CartItem } from '../types/product';
import confetti from 'canvas-confetti';
import { X, Check, ShieldCheck, Truck, CreditCard, Smartphone, DollarSign, ArrowLeft } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  // Checkout steps: 'form' | 'success'
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Customer shipping details
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const rawSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const subtotal = rawSubtotal - discountAmount;
  const shippingFee = subtotal >= 3000 || items.length === 0 ? 0 : 150;
  const total = subtotal + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SNUG10') {
      setDiscountPercent(10);
      setPromoMessage('Promo code SNUG10 applied! 10% archive discount deducted.');
    } else if (promoCode.trim().toUpperCase() === 'LAGOS') {
      setDiscountPercent(15);
      setPromoMessage('Promo code LAGOS applied! 15% VIP drop discount.');
    } else {
      setPromoMessage('Invalid code. Try "SNUG10" for 10% off.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Enter valid 10-digit phone';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Enter valid email address';
    if (!formData.address.trim()) newErrors.address = 'Enter delivery street address';
    if (!formData.city.trim()) newErrors.city = 'Enter city';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) newErrors.pincode = 'Enter valid 6-digit PIN code';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate simulated order ID
    const randomOrder = `SNUG-${Math.floor(1000 + Math.random() * 9000)}-IN`;
    setOrderNumber(randomOrder);
    setStep('success');

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A5FF00', '#171717', '#EAE6DC'],
      });
    } catch {
      // Confetti fallback
    }

    onOrderCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#F5F3EE] rounded-lg shadow-2xl border border-[#171717]/20 overflow-hidden z-10 my-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#171717]/10 bg-[#EFECE5]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#A5FF00] rounded-full" />
            <h2 className="text-xs sm:text-sm font-mono-code font-bold uppercase tracking-widest text-[#171717]">
              {step === 'form' ? 'SECURE DEMO CHECKOUT // SNUG ARCHIVE' : 'ORDER CONFIRMED'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#171717] hover:text-[#A5FF00] text-[#171717] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step: Form */}
        {step === 'form' && (
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">

            {/* Demo Notice Banner */}
            <div className="bg-[#EAE6DC] border border-[#171717]/20 rounded-md p-3 text-xs font-mono-code text-[#171717] flex items-center justify-between">
              <span>DEMO MODE ACTIVE · Simulated checkout sandbox. No real card charge will occur.</span>
              <span className="text-[10px] bg-[#A5FF00] text-[#171717] px-2 py-0.5 rounded font-bold">
                TEST SAFE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Left: Customer & Address Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#171717] border-b border-[#171717]/10 pb-1">
                  1. DELIVERY ADDRESS
                </h3>

                <div>
                  <label className="text-[11px] font-mono-code text-[#171717]/70 uppercase block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. Parth Gadhiya"
                    className="w-full px-3 py-2 text-xs font-mono-code bg-[#EAE6DC] border border-[#171717]/20 rounded text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                  {errors.fullName && <p className="text-[10px] text-red-600 mt-0.5">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono-code text-[#171717]/70 uppercase block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 text-xs font-mono-code bg-[#EAE6DC] border border-[#171717]/20 rounded text-[#171717] focus:outline-none focus:border-[#171717]"
                    />
                    {errors.phone && <p className="text-[10px] text-red-600 mt-0.5">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] font-mono-code text-[#171717]/70 uppercase block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="you@email.com"
                      className="w-full px-3 py-2 text-xs font-mono-code bg-[#EAE6DC] border border-[#171717]/20 rounded text-[#171717] focus:outline-none focus:border-[#171717]"
                    />
                    {errors.email && <p className="text-[10px] text-red-600 mt-0.5">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono-code text-[#171717]/70 uppercase block mb-1">
                    Street Address & Apartment *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Flat 402, Signature Residency, 12th Cross Road"
                    className="w-full px-3 py-2 text-xs font-mono-code bg-[#EAE6DC] border border-[#171717]/20 rounded text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                  {errors.address && <p className="text-[10px] text-red-600 mt-0.5">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono-code text-[#171717]/70 uppercase block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Mumbai"
                      className="w-full px-3 py-2 text-xs font-mono-code bg-[#EAE6DC] border border-[#171717]/20 rounded text-[#171717] focus:outline-none focus:border-[#171717]"
                    />
                    {errors.city && <p className="text-[10px] text-red-600 mt-0.5">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] font-mono-code text-[#171717]/70 uppercase block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="400001"
                      className="w-full px-3 py-2 text-xs font-mono-code bg-[#EAE6DC] border border-[#171717]/20 rounded text-[#171717] focus:outline-none focus:border-[#171717]"
                    />
                    {errors.pincode && <p className="text-[10px] text-red-600 mt-0.5">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Right: Payment Method & Order Summary */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#171717] border-b border-[#171717]/10 pb-1">
                  2. PAYMENT SELECTION
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#171717] bg-[#171717] text-[#A5FF00]'
                        : 'border-[#171717]/20 bg-[#EAE6DC] text-[#171717]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[10px] font-mono-code font-bold uppercase">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#171717] bg-[#171717] text-[#A5FF00]'
                        : 'border-[#171717]/20 bg-[#EAE6DC] text-[#171717]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-mono-code font-bold uppercase">CARDS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#171717] bg-[#171717] text-[#A5FF00]'
                        : 'border-[#171717]/20 bg-[#EAE6DC] text-[#171717]'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span className="text-[10px] font-mono-code font-bold uppercase">COD</span>
                  </button>
                </div>

                {/* Promo Code Box */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo Code (try SNUG10)"
                      className="flex-1 px-3 py-1.5 text-xs font-mono-code bg-[#EAE6DC] border border-[#171717]/20 rounded uppercase text-[#171717] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-[#171717] text-[#F5F3EE] hover:bg-[#343434] text-xs font-mono-code uppercase rounded cursor-pointer"
                    >
                      APPLY
                    </button>
                  </div>
                  {promoMessage && (
                    <p className="text-[10px] font-mono-code text-[#171717] mt-1">
                      {promoMessage}
                    </p>
                  )}
                </div>

                {/* Itemized Total Breakdown */}
                <div className="bg-[#EAE6DC] p-4 rounded border border-[#171717]/10 space-y-2 text-xs font-mono-code">
                  <div className="flex justify-between text-[#171717]/70">
                    <span>Items Total ({items.length} garments)</span>
                    <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#171717]/70">
                    <span>Express Air Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#171717] pt-2 border-t border-[#171717]/15">
                    <span>TOTAL AMOUNT</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#171717] hover:bg-[#343434] text-[#F5F3EE] font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#A5FF00]" />
                  <span>COMPLETE ORDER · ₹{total.toLocaleString('en-IN')}</span>
                </button>
              </div>

            </div>
          </form>
        )}

        {/* Step: Success Screen */}
        {step === 'success' && (
          <div className="p-8 sm:p-12 text-center space-y-5">
            <div className="w-16 h-16 bg-[#171717] text-[#A5FF00] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-[#171717]/60 block mb-1">
                DEMO ORDER SIMULATION SUCCESSFUL
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-[#171717]">
                YOUR SNUG WORLD ORDER IS CONFIRMED!
              </h2>
              <p className="text-sm font-mono-code font-bold text-[#171717] mt-2">
                ORDER ID: <span className="bg-[#A5FF00] px-2 py-0.5 rounded text-[#171717]">{orderNumber}</span>
              </p>
            </div>

            <p className="text-xs text-[#171717]/70 max-w-md mx-auto">
              A dispatch confirmation has been queued for {formData.email || 'your email'}. Hand-packaged in our archival dust cover and shipped via Bluedart Express.
            </p>

            <div className="bg-[#EAE6DC] p-4 rounded max-w-md mx-auto text-left text-xs font-mono-code space-y-1.5 border border-[#171717]/10">
              <p className="font-bold text-[#171717]">DISPATCH RECIPIENT:</p>
              <p className="text-[#171717]/80">{formData.fullName}</p>
              <p className="text-[#171717]/80">{formData.address}, {formData.city} - {formData.pincode}</p>
              <p className="text-[#171717]/80">Payment: {paymentMethod.toUpperCase()}</p>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#171717] text-[#A5FF00] hover:bg-[#343434] text-xs font-mono-code font-bold uppercase rounded cursor-pointer"
              >
                RETURN TO SHOWROOM
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
