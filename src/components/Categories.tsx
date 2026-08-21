import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  categoryCounts?: Record<string, number>;
}

export default function Categories({
  onSelectCategory,
  activeCategory,
  categoryCounts = {}
}: CategoriesProps) {
  // Exact 14 Categories in the strict requested order
  const categoriesList = [
    {
      name: 'All',
      tagline: 'Entire Store',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Hijab',
      tagline: 'Chiffon & Silk',
      image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Niqab',
      tagline: 'Pure & Breathable',
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Dupatta 99',
      tagline: '₹99 Special Offer',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      isHighlight: true,
      badgeText: '₹99 HOT'
    },
    {
      name: 'Dupatta Cotton',
      tagline: '100% Pure Cotton',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80',
      isHighlight: true,
      badgeText: 'Dupatta'
    },
    {
      name: 'Dupatta Chiffon',
      tagline: 'Soft & Flowing',
      image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=400&q=80',
      isHighlight: true,
      badgeText: 'Dupatta'
    },
    {
      name: 'Dupatta Banarasi & Fancy',
      tagline: 'Zari & Partywear',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
      isHighlight: true,
      badgeText: 'Banarasi'
    },
    {
      name: 'Stoll Simple',
      tagline: 'Daily Essentials',
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Stoll Cotton',
      tagline: 'Cotton Stoles',
      image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Stoll Luxury / Shawl',
      tagline: 'Velvet & Shimmer',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Kurti',
      tagline: 'Designer Kurti',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Bache Ka Kapra',
      tagline: 'Kids Collection',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Undercap / Undergarments / Innerwear',
      tagline: 'Inner Caps & Essentials',
      image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    },
    {
      name: 'Dastarkhan',
      tagline: 'Dining & Table Cloth',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
      isHighlight: false
    }
  ];

  return (
    <section id="shop-by-category" className="py-5 bg-white overflow-hidden border-b border-brand-100/60">
      <div className="w-full px-3 sm:px-4">
        
        {/* Section Header */}
        <div className="text-center mb-3.5">
          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.2em] inline-flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3 h-3 text-brand-500" />
            OFFICIAL SIBA CATEGORIES
            <Sparkles className="w-3 h-3 text-brand-500" />
          </span>
          <h2 className="font-serif text-lg font-black text-gray-950 tracking-tight leading-tight">
            Shop By Category
          </h2>
          <div className="w-8 h-0.5 bg-brand-500 mx-auto mt-1 rounded-full" />
        </div>

        {/* 14 Categories in clean responsive grid */}
        <div
          id="category-grid"
          className="grid grid-cols-4 sm:grid-cols-4 gap-x-1.5 gap-y-3.5 text-center"
        >
          {categoriesList.map((cat, index) => {
            const isSelected = activeCategory === cat.name;
            const count = categoryCounts[cat.name] ?? 0;
            const isDupatta = cat.isHighlight;

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: index * 0.012 }}
                onClick={() => onSelectCategory(cat.name)}
                className="flex flex-col items-center cursor-pointer group relative"
              >
                {/* 66px Circle Category Frame - Highlighted for Dupatta categories */}
                <div
                  className={`w-[64px] h-[64px] rounded-full overflow-hidden border-2 relative shadow-xs transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-600 ring-2 ring-brand-400 scale-105 shadow-md'
                      : isDupatta
                      ? 'border-amber-500 ring-1 ring-amber-300 shadow-sm hover:scale-105'
                      : 'border-brand-200/80 hover:border-brand-400 group-hover:scale-105'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle overlay */}
                  <div
                    className={`absolute inset-0 transition-colors ${
                      isDupatta
                        ? 'bg-amber-900/10 group-hover:bg-amber-500/20'
                        : 'bg-neutral-900/10 group-hover:bg-brand-600/20'
                    }`}
                  />

                  {/* Dupatta Highlight Badge */}
                  {cat.badgeText && (
                    <span className="absolute top-0 inset-x-0 bg-gradient-to-r from-amber-600 to-brand-600 text-white text-[7px] font-black uppercase tracking-tighter py-0.5 shadow">
                      {cat.badgeText}
                    </span>
                  )}

                  {/* Item count badge on bottom right */}
                  {count > 0 && (
                    <span className="absolute bottom-0.5 right-0.5 bg-neutral-900/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-neutral-700 shadow-xs">
                      {count}
                    </span>
                  )}
                </div>

                {/* Category Name & Tagline */}
                <div className="mt-1 w-full px-0.5 flex flex-col items-center">
                  <h3
                    className={`font-serif text-[10px] font-bold tracking-tight leading-tight uppercase line-clamp-2 transition-colors ${
                      isSelected
                        ? 'text-brand-600 font-black'
                        : isDupatta
                        ? 'text-amber-900 font-black'
                        : 'text-gray-900 group-hover:text-brand-600'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-[8px] text-gray-500 font-semibold tracking-tight uppercase truncate mt-0.5 leading-none">
                    {cat.tagline} {count > 0 ? `(${count})` : ''}
                  </p>
                </div>

                {/* Active indicator dot */}
                {isSelected && (
                  <motion.span
                    layoutId="selectedCategoryDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-600"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Clear Filter button if a specific category is active */}
        {activeCategory !== 'All' && (
          <div className="text-center mt-3 pt-2 border-t border-brand-50">
            <button
              onClick={() => onSelectCategory('All')}
              className="text-[10px] font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2 tracking-wider uppercase cursor-pointer"
            >
              Show All Collection Items
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
