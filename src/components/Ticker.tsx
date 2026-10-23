import React from 'react';

export const Ticker: React.FC = () => {
  const items = [
    'NEW DROPS',
    'LAGOS',
    "IT'S US, NEVER THEM.",
    'HEAVYWEIGHT 320 GSM',
    'LIMITED ARCHIVE RELEASES',
    'SNUG WORLD',
    'HAND DISTRESSED',
    'OVERSIZED SILHOUETTES',
    'COMPLIMENTARY SHIPPING OVER ₹3,000',
  ];

  return (
    <div className="w-full bg-[#A5FF00] border-y border-[#171717] py-2.5 overflow-hidden select-none">
      <div className="flex w-max animate-marquee">
        {/* Repeated two identical sequences for seamless infinite marquee loop */}
        <div className="flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-heading tracking-widest text-[#171717] uppercase px-3">
          {items.map((item, idx) => (
            <React.Fragment key={`ticker-1-${idx}`}>
              <span>{item}</span>
              <span className="w-1.5 h-1.5 bg-[#171717] rounded-full inline-block" />
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-heading tracking-widest text-[#171717] uppercase px-3">
          {items.map((item, idx) => (
            <React.Fragment key={`ticker-2-${idx}`}>
              <span>{item}</span>
              <span className="w-1.5 h-1.5 bg-[#171717] rounded-full inline-block" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
