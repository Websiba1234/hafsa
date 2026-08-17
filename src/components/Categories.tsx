import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export default function Categories({ onSelectCategory, activeCategory }: CategoriesProps) {
  const categoriesList = [
    {
      name: 'Kurtis',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      tagline: 'Festive & Dailywear'
    },
    {
      name: 'Dresses',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
      tagline: 'Elegant Silhouettes'
    },
    {
      name: 'Tops',
      image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=400&q=80',
      tagline: 'Chic & Casual'
    },
    {
      name: 'Bottom Wear',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
      tagline: 'Comfort Tailoring'
    },
    {
      name: 'Bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
      tagline: 'Signature Handbags'
    },
    {
      name: 'Jewellery',
      image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=400&q=80',
      tagline: 'Rose Gold & Pearls'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
      tagline: 'Scarves & Shades'
    }
  ];

  return (
    <section id="shop-by-category" className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-[0.25em] inline-flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Shop By Category
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Explore Our Top Picks
          </h2>
          <div className="w-12 h-1 bg-brand-200 mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Layout (Horizontal scroll on mobile, flex wrap on desktop) */}
        <div
          id="category-grid"
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin lg:grid lg:grid-cols-7 lg:overflow-x-visible"
        >
          {categoriesList.map((cat, index) => {
            const isSelected = activeCategory === cat.name;

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex-none w-44 lg:w-auto cursor-pointer group text-center relative`}
              >
                {/* Category Card Circle Frame */}
                <div
                  className={`w-36 h-36 mx-auto rounded-full overflow-hidden border-4 relative shadow-sm transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-500 ring-4 ring-brand-100 scale-105 shadow-md'
                      : 'border-brand-100 hover:border-brand-300 group-hover:scale-105 group-hover:shadow-md'
                  }`}
                >
                  <img
                    src={cat.image || undefined}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle Pastel Overlay */}
                  <div className="absolute inset-0 bg-brand-500/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info Text */}
                <h3
                  className={`mt-4 font-serif text-base font-bold tracking-wide transition-colors ${
                    isSelected ? 'text-brand-600' : 'text-gray-900 group-hover:text-brand-500'
                  }`}
                >
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-500 tracking-wider uppercase mt-0.5">
                  {cat.tagline}
                </p>

                {/* Small indicator dot for selection */}
                {isSelected && (
                  <motion.span
                    layoutId="selectedCategoryDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-500"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Clear Filter / All categories button */}
        {activeCategory !== 'All' && (
          <div className="text-center mt-10">
            <button
              onClick={() => onSelectCategory('All')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-4 tracking-wider uppercase cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
