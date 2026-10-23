import React, { useState } from 'react';
import { ArrowRight, Check, Instagram, Sparkles, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Persist to local storage demo newsletter list
    try {
      const existing = JSON.parse(localStorage.getItem('snug_newsletter_subscribers') || '[]');
      existing.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('snug_newsletter_subscribers', JSON.stringify(existing));
    } catch {
      // Ignore
    }

    setSubscribed(true);
    setErrorMessage(null);
  };

  return (
    <footer className="bg-[#171717] text-[#F5F3EE] pt-20 pb-12 border-t border-[#343434]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Newsletter Section: "GET IN BEFORE THE NEXT DROP." */}
        <div className="bg-[#212121] border border-[#343434] rounded-lg p-8 sm:p-12 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-[#A5FF00] block mb-2">
              INNER CIRCLE NOTIFICATIONS
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-tight">
              GET IN BEFORE THE NEXT DROP.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#F5F3EE]/70 font-medium">
              Private access codes, secret preview links, and 24-hour headstart on archive releases. Never spam.
            </p>

            {subscribed ? (
              <div className="mt-6 p-4 bg-[#2A2A2A] border border-[#A5FF00]/40 rounded-md inline-flex items-center gap-2 text-xs font-mono-code text-[#A5FF00]">
                <Check className="w-4 h-4 text-[#A5FF00]" />
                <span>YOU&apos;RE ON THE LIST // EARLY ACCESS CODE SENT TO {email}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="ENTER YOUR EMAIL FOR DROP ACCESS"
                    className="w-full px-4 py-3 bg-[#171717] border border-[#343434] rounded text-xs font-mono-code text-white placeholder-[#F5F3EE]/40 focus:outline-none focus:border-[#A5FF00]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#A5FF00] hover:bg-[#92E600] text-[#171717] text-xs font-mono-code font-bold uppercase tracking-wider rounded cursor-pointer transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <span>JOIN DROP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {errorMessage && (
              <p className="text-xs text-red-400 mt-2 font-mono-code">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Main Footer Links & Branding */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#343434]">

          {/* Col 1: Brand & Tagline (Cols 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#A5FF00] rounded-sm" />
              <span className="text-2xl font-display font-black tracking-tight text-white uppercase">
                SNUG WORLD
              </span>
            </div>
            <p className="text-xs text-[#F5F3EE]/60 max-w-sm font-medium leading-relaxed">
              &ldquo;IT&apos;S US, NEVER THEM.&rdquo; Independent streetwear atelier specializing in oversized heavy cotton tees, distressed apparel, and limited batch underground releases.
            </p>
            <div className="pt-2 text-[11px] font-mono-code text-[#A5FF00]">
              LAGOS · MUMBAI · GLOBAL ARCHIVE
            </div>
          </div>

          {/* Col 2: Navigation Links (Cols 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-white">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-mono-code text-[#F5F3EE]/70">
              <li>
                <button
                  onClick={() => onNavigate('clothing-rod')}
                  className="hover:text-[#A5FF00] transition-colors cursor-pointer text-left"
                >
                  Showroom Rack
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-[#A5FF00] transition-colors cursor-pointer text-left"
                >
                  Shop Full Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('new-drops')}
                  className="hover:text-[#A5FF00] transition-colors cursor-pointer text-left"
                >
                  New Drop Series 04
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bestsellers')}
                  className="hover:text-[#A5FF00] transition-colors cursor-pointer text-left"
                >
                  Bestseller Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#A5FF00] transition-colors cursor-pointer text-left"
                >
                  Philosophy & Materials
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies (Cols 9-12) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-white">
              CLIENT SERVICES
            </h4>
            <ul className="space-y-2 text-xs font-mono-code text-[#F5F3EE]/70">
              <li className="flex items-center gap-2">
                <span>Direct Support:</span>
                <span className="text-white">care@snugworld.studio</span>
              </li>
              <li>Shipping &amp; 7-Day Doorstep Returns</li>
              <li>Size Matrix &amp; Fit Recommendations</li>
              <li>Authenticity Verification Guarantee</li>
              <li className="pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#A5FF00] hover:underline"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@SNUGWORLD_OFFICIAL</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-[#F5F3EE]/50">
          <div>
            © {new Date().getFullYear()} SNUG WORLD. ALL RIGHTS RESERVED.
          </div>
          <div className="text-[#A5FF00] font-bold">
            IT&apos;S US, NEVER THEM.
          </div>
          <div className="flex gap-4 text-[11px]">
            <span>PRIVACY POLICY</span>
            <span>·</span>
            <span>TERMS OF SERVICE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
