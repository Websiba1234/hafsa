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
      name: 'Dupatta',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      tagline: 'Silk & Chiffon'
    },
    {
      name: 'Hijab',
      image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80',
      tagline: 'Modest & Elegant'
    },
    {
      name: 'Naqab',
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=400&q=80',
      tagline: 'Pure & Breathable'
    },
    {
      name: 'Dastarkhan',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      tagline: 'Printed Dining'
    },
    {
      name: 'Trouser',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
      tagline: 'Daily Comfort'
    },
    {
      name: 'Nicker / Underwear',
      image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=400&q=80',
      tagline: 'Soft Cotton'
    },
    {
      name: 'Sando / Ganji',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      tagline: 'Combed Cotton'
    },
    {
      name: 'Stoll / Shawl',
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
      tagline: 'Warm & Stylish'
    },
    {
      name: 'Rumal',
      image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80',
      tagline: 'Cotton Hankies'
    },
    {
      name: 'Nighty',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80',
      tagline: 'Relaxed Fit'
    },
    {
      name: 'Kurti',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
      tagline: 'Ethnic Designer'
    },
    {
      name: 'Bache Ka Kapra',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80',
      tagline: 'Kids & Baby Wear'
    }
  ];

  return (
    <section id="shop-by-category" className="py-8 bg-white overflow-hidden">
      <div className="w-full px-3.5 sm:px-4">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-brand-600 uppercase tracking-[0.2em] inline-flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Shop By Category
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          </span>
          <h2 className="font-serif text-[22px] font-black text-gray-900 tracking-tight leading-tight">
            Explore Our Top Picks
          </h2>
          <div className="w-10 h-0.5 bg-brand-200 mx-auto mt-2 rounded-full" />
        </div>

        {/* 4 Circle Categories Per Row (3 rows of 4 items = 12 categories) */}
        <div
          id="category-grid"
          className="grid grid-cols-4 gap-x-2 gap-y-4 text-center"
        >
          {categoriesList.map((cat, index) => {
            const isSelected = activeCategory === cat.name;

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.02 }}
                onClick={() => onSelectCategory(cat.name)}
                className="flex flex-col items-center cursor-pointer group relative"
              >
                {/* 75px Circle Category Frame */}
                <div
                  className={`w-[75px] h-[75px] rounded-full overflow-hidden border-[3px] relative shadow-sm transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-300 scale-105 shadow-md'
                      : 'border-brand-100 hover:border-brand-300 group-hover:scale-105'
                  }`}
                >
                  <img
                    src={cat.image || undefined}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle tint on hover */}
                  <div className="absolute inset-0 bg-brand-500/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Category Name & Tagline Text */}
                <div className="mt-1.5 w-full px-0.5">
                  <h3
                    className={`font-serif text-[11px] font-bold tracking-tight leading-tight uppercase line-clamp-1 transition-colors ${
                      isSelected ? 'text-brand-600 font-extrabold' : 'text-gray-900 group-hover:text-brand-600'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-[9px] text-gray-500 font-medium tracking-tight uppercase truncate mt-0.5 leading-none">
                    {cat.tagline}
                  </p>
                </div>

                {/* Active indicator dot */}
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
          <div className="text-center mt-6">
            <button
              onClick={() => onSelectCategory('All')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4 tracking-wider uppercase cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
