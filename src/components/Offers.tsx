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
      sub: 'On Selected Collections',
      cta: 'Shop Now',
      bgClass: 'bg-gradient-to-br from-[#fdf2f4] to-[#fce7eb]',
      textColor: 'text-brand-900',
      badgeColor: 'bg-brand-200/60 text-brand-800',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80', // Rose/gold gift vibes
      categoryFilter: 'Kurtis'
    },
    {
      id: 'promo-2',
      badge: 'NEW COLLECTION',
      title: 'Latest Fashion',
      sub: 'Modern Ethnic & Fusion Outfits',
      cta: 'Explore All',
      bgClass: 'bg-gradient-to-br from-[#faf5f0] to-[#f5ebd3]/40',
      textColor: 'text-amber-950',
      badgeColor: 'bg-amber-100 text-amber-800',
      image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=400&q=80', // Hanging fabric silhouettes
      categoryFilter: 'Dresses'
    },
    {
      id: 'promo-3',
      badge: 'ACCESSORIES SALE',
      title: 'Up To 30% Off',
      sub: 'On Fine Jewellery & Bags',
      cta: 'Shop Sale',
      bgClass: 'bg-gradient-to-br from-[#f3eff5] to-[#ebdbe5]',
      textColor: 'text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', // Rose gold jewelry details
      categoryFilter: 'Jewellery'
    }
  ];

  return (
    <section id="special-promos" className="py-10 sm:py-16 bg-brand-50/20 border-y border-brand-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-[0.25em] inline-flex items-center gap-1.5 mb-2">
            <Percent className="w-4 h-4 text-brand-500 animate-pulse" />
            Exclusive Deals
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Handpicked Offers For You
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-light max-w-md mx-auto">
            Indulge in luxury for less with our limited-time curated discounts.
          </p>
        </div>

        {/* Promotion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {promos.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onPromoClick(promo.categoryFilter)}
              className={`${promo.bgClass} rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-white/50 relative p-6 sm:p-8 flex flex-col justify-between h-72 group cursor-pointer`}
            >
              {/* Background Product Image with subtle scale */}
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-35 md:opacity-50 lg:opacity-70 pointer-events-none select-none overflow-hidden rounded-l-3xl">
                <img
                  src={promo.image || undefined}
                  alt={promo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover origin-bottom-right transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle gradient to blend into left background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent via-transparent" />
              </div>

              {/* Text content */}
              <div className="relative z-10 max-w-[65%] flex flex-col items-start">
                {/* Mini tag */}
                <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full ${promo.badgeColor} uppercase`}>
                  {promo.badge}
                </span>

                <h3 className={`mt-4 font-serif text-2xl sm:text-3xl font-black ${promo.textColor} leading-tight`}>
                  {promo.title}
                </h3>

                <p className="text-xs text-gray-600 mt-2 font-medium">
                  {promo.sub}
                </p>
              </div>

              {/* Button */}
              <div className="relative z-10 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 group-hover:text-brand-700 mt-6 group-hover:underline underline-offset-4">
                <span>{promo.cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>

              {/* Decorative line patterns */}
              <div className="absolute left-4 bottom-4 w-12 h-[1px] bg-brand-300/40 group-hover:w-20 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
