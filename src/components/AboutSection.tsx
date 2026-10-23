import React from 'react';
import { IMAGES } from '../data/products';
import { Sparkles, Layers, Scissors, ShieldAlert } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#171717]/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Column: Textile Specimen / Label Graphic (Cols 1-5) */}
        <div className="lg:col-span-5 relative">
          <div className="relative bg-[#EAE6DC] border border-[#171717]/15 rounded-lg p-8 shadow-md">

            {/* Woven Fabric Mock Label */}
            <div className="bg-[#171717] text-[#F5F3EE] p-6 rounded border-2 border-[#343434] shadow-inner relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-[#343434] pb-3">
                <span className="font-display text-lg font-black tracking-tighter text-[#A5FF00]">
                  SNUG WORLD
                </span>
                <span className="text-[10px] font-mono-code text-[#F5F3EE]/50">
                  ARCHIVE SPEC // NO. 04
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono-code">
                <div className="flex justify-between text-[#F5F3EE]/80">
                  <span>FABRIC:</span>
                  <span className="text-white font-bold">100% COMBED HEAVY COTTON</span>
                </div>
                <div className="flex justify-between text-[#F5F3EE]/80">
                  <span>DENSITY:</span>
                  <span className="text-[#A5FF00] font-bold">320 GSM HEAVYWEIGHT</span>
                </div>
                <div className="flex justify-between text-[#F5F3EE]/80">
                  <span>WASH PROCESS:</span>
                  <span className="text-white font-bold">MINERAL ENZYME SILICON</span>
                </div>
                <div className="flex justify-between text-[#F5F3EE]/80">
                  <span>CUT:</span>
                  <span className="text-white font-bold">BOXY OVERSIZED DROP SHOULDER</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#343434] flex items-center justify-between text-[11px] font-mono-code text-[#A5FF00]">
                <span>&ldquo;IT&apos;S US, NEVER THEM.&rdquo;</span>
                <span className="text-[#F5F3EE]/40">EST. 2024</span>
              </div>
            </div>

            {/* Subtle distress texture background note */}
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono-code text-[#171717]/50 uppercase">
              <span>WOVEN JACQUARD LABEL ARCHIVE</span>
              <span>LAGOS // WORLDWIDE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Brand Philosophy & Story (Cols 6-12) */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-[#A5FF00] rounded-full" />
            <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#171717]/60">
              PHILOSOPHY & ORIGIN
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-[#171717] uppercase leading-none">
            MORE THAN WHAT YOU WEAR.
          </h2>

          <p className="mt-6 text-base sm:text-lg text-[#171717]/80 font-medium leading-relaxed">
            SNUG WORLD is built around self-expression, individuality, and the freedom to wear your world your way. Every piece is designed to stand out without asking for permission.
          </p>

          <p className="mt-4 text-xs sm:text-sm text-[#171717]/60 leading-relaxed font-normal">
            Rooted in underground garage music, Brutalist architecture, and Lagos street energy, our garments are deliberate rebellions against disposable fast fashion. We choose heavy 300–340 GSM textiles that hold their shape across seasons, treated with custom abrasive distressing so that every piece develops a unique patina with wear.
          </p>

          {/* 3 Pillars of Craftsmanship */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-[#171717]/10">
            <div>
              <Layers className="w-5 h-5 text-[#171717] mb-2" />
              <h4 className="text-xs font-mono-code font-bold uppercase text-[#171717]">
                320 GSM HEAVYWEIGHT
              </h4>
              <p className="text-[11px] text-[#171717]/60 mt-1 leading-snug">
                Substantial drape and structured boxy shoulders that never cling or collapse.
              </p>
            </div>

            <div>
              <Scissors className="w-5 h-5 text-[#171717] mb-2" />
              <h4 className="text-xs font-mono-code font-bold uppercase text-[#171717]">
                HAND-DISTRESSED DETAILS
              </h4>
              <p className="text-[11px] text-[#171717]/60 mt-1 leading-snug">
                Micro-frayed collars, raw hemlines, and studio splatterings unique to every garment.
              </p>
            </div>

            <div>
              <Sparkles className="w-5 h-5 text-[#171717] mb-2" />
              <h4 className="text-xs font-mono-code font-bold uppercase text-[#171717]">
                LIMITED BATCH ARCHIVE
              </h4>
              <p className="text-[11px] text-[#171717]/60 mt-1 leading-snug">
                Small releases of 100–150 units. When a drop sells out, it retires into the archive.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
