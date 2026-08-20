import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onQuickView: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({
  product,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onBuyNow,
  onQuickView
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingToCart(true);
    onAddToCart();
    setTimeout(() => {
      setAddingToCart(false);
    }, 1200);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-3 h-3">
            <Star className="w-3 h-3 text-gray-200" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-gray-200" />);
      }
    }
    return stars;
  };

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-100/50 hover:shadow-xl transition-all duration-300"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer" onClick={onQuickView}>
        {/* Main image */}
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          } ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
        />

        {/* Hover image (fades in) */}
        <img
          src={product.hoverImage || product.image || FALLBACK_IMAGE}
          alt={`${product.name} view 2`}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          } ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
        />

        {/* Brand/Promotional & Stock Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-red-600 text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-md">
              Out of Stock
            </span>
          ) : (
            <>
              {product.discountBadge && (
                <span className="bg-brand-600 text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-sm">
                  {product.discountBadge}
                </span>
              )}
              {product.isNew && (
                <span className="bg-emerald-500 text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-sm">
                  New In
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-amber-500 text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-sm">
                  Best Seller
                </span>
              )}
            </>
          )}
        </div>

        {/* Hover Wishlist Action button (always visible top right, beautifully integrated) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
          className={`absolute top-3.5 right-3.5 z-20 w-8.5 h-8.5 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-brand-500 border-white hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Bottom Action Panel (Quick View & Add to Cart) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-4 left-4 right-4 z-20 grid grid-cols-2 gap-2"
            >
              {/* Quick View Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView();
                }}
                className="flex items-center justify-center gap-1 bg-white/95 hover:bg-white text-gray-800 text-[10px] font-bold tracking-wider uppercase py-2.5 rounded-xl shadow-md border border-brand-100 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </button>

              {/* Direct Buy Now */}
              <button
                onClick={handleBuyNowClick}
                className="flex items-center justify-center gap-1 bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold tracking-wider uppercase py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Buy Now</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Details Info Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="cursor-pointer" onClick={onQuickView}>
          {/* Category Tag */}
          <span className="text-[10px] text-brand-500 font-bold uppercase tracking-widest block">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1 mt-1">
            {product.name}
          </h3>

          {/* Ratings & Count */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex gap-0.5">{renderStars(product.rating)}</div>
            <span className="text-[10px] font-medium text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing & CTA Buttons Layout */}
        <div className="mt-3 sm:mt-3.5 pt-2.5 sm:pt-3 border-t border-brand-50/50 space-y-2 sm:space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-gray-900 text-sm sm:text-base">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="font-serif text-gray-400 line-through text-xs">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Dual Action Buttons: Add to Cart (Icon/Quick) & Buy Now (Full) */}
          <div className="flex items-center gap-1.5 pt-1 w-full">
            <button
              onClick={handleAddToCartClick}
              disabled={addingToCart || isOutOfStock}
              className={`h-8 px-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : addingToCart
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-brand-50/50 hover:bg-brand-100/70 border-brand-200 text-brand-700'
              }`}
              title="Add to Cart"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleBuyNowClick}
              disabled={isOutOfStock}
              className={`flex-1 h-8 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 rounded-xl shadow-xs transition-all text-center ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer active:scale-95'
              }`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span className="truncate">{isOutOfStock ? 'Sold Out' : 'Buy Now'}</span>
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
