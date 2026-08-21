import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Percent, Tag } from 'lucide-react';

interface OffersProps {
  onPromoClick: (categoryFilter: string) => void;
}

export default function Offers({ onPromoClick }: OffersProps) {
  const promos = [
    {
      id: 'promo-1',
      badge: 'SPECIAL OFFER',
      title: 'Flat 20% Off',
      sub: 'On Designer Dupattas & Shawls',
      cta: 'Shop Now',
      bgClass: 'bg-gradient-to-br from-[#fdf2f4] to-[#fce7eb]',
      textColor: 'text-brand-900',
      badgeColor: 'bg-brand-200/60 text-brand-800',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      categoryFilter: 'Dupatta 99'
    },
    {
      id: 'promo-2',
      badge: 'MODEST WEAR',
      title: 'Hijab & Naqab',
      sub: 'Pure Breathable & Comfortable Fabric',
      cta: 'Explore All',
      bgClass: 'bg-gradient-to-br from-[#faf5f0] to-[#f5ebd3]/40',
      textColor: 'text-amber-950',
      badgeColor: 'bg-amber-100 text-amber-800',
      image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80',
      categoryFilter: 'Hijab'
    },
    {
      id: 'promo-3',
      badge: 'DAILY ESSENTIALS',
      title: 'Kids & Daily Wear',
      sub: 'Bache Ka Kapra, Nighty & Trousers',
      cta: 'Shop Sale',
      bgClass: 'bg-gradient-to-br from-[#f3eff5] to-[#ebdbe5]',
      textColor: 'text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80',
      categoryFilter: 'Bache Ka Kapra'
    }
  ];

  return (
    <section id="special-promos" className="py-8 bg-brand-50/25 border-y border-brand-100/60 overflow-hidden">
      <div className="w-full px-3.5 sm:px-4">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="text-[11px] font-bold text-brand-600 uppercase tracking-[0.2em] inline-flex items-center gap-1.5 mb-1.5">
            <Percent className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
            Exclusive Deals
          </span>
          <h2 className="font-serif text-[22px] font-black text-gray-900 tracking-tight leading-tight">
            Handpicked Offers For You
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal">
            Limited-time curated discounts on premium styles.
          </p>
        </div>

        {/* Promotion Cards Layout (3 cards in 1 row swipeable) */}
        <div className="flex gap-3 overflow-x-auto px-1 pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
          {promos.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => onPromoClick(promo.categoryFilter)}
              className={`${promo.bgClass} flex-none w-[82%] snap-start rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-white/80 relative p-5 flex flex-col justify-between min-h-[220px] group cursor-pointer`}
            >
              {/* Background Product Image */}
              <div className="absolute right-0 bottom-0 w-[50%] h-full opacity-60 pointer-events-none select-none overflow-hidden rounded-l-2xl">
                <img
                  src={promo.image || undefined}
                  alt={promo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover origin-bottom-right transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text content */}
              <div className="relative z-10 max-w-[65%] flex flex-col items-start">
                {/* Mini tag */}
                <span className={`text-[9px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full ${promo.badgeColor} uppercase shadow-xs`}>
                  {promo.badge}
                </span>

                <h3 className={`mt-2 font-serif text-xl font-black ${promo.textColor} leading-tight`}>
                  {promo.title}
                </h3>

                <p className="text-[11px] text-gray-700 mt-1 font-medium leading-tight">
                  {promo.sub}
                </p>
              </div>

              {/* Button */}
              <div className="relative z-10 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-brand-600 group-hover:text-brand-700 mt-4 group-hover:underline underline-offset-4">
                <span>{promo.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>

              {/* Decorative line */}
              <div className="absolute left-4 bottom-3 w-10 h-[1.5px] bg-brand-300/60 group-hover:w-16 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
