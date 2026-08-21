import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, ImageOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { generateWhatsAppBuyUrl } from '../services/googleSheetService';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
  onQuickView: () => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onQuickView
}: ProductCardProps) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [imgError, setImgError] = useState(false);

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
    const url = generateWhatsAppBuyUrl({ product, quantity: 1 });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isOutOfStock = !product.isAvailable || (product.stock !== undefined && product.stock <= 0);
  const hasValidDisplayImage = product.hasValidImage && product.image && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-100/80 hover:border-brand-300 shadow-xs hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image or "PHOTO LINK DALO YAHAN" Placeholder */}
      <div
        className="relative aspect-[3/4] bg-neutral-900 overflow-hidden cursor-pointer flex items-center justify-center select-none"
        onClick={onQuickView}
      >
        {hasValidDisplayImage ? (
          <>
            <img
              src={product.image}
              alt={product.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                isOutOfStock ? 'grayscale opacity-70' : ''
              }`}
            />
            {/* Subtle Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        ) : (
          /* Exact requested placeholder: "PHOTO LINK DALO YAHAN" */
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-brand-950 text-white relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mb-2 text-brand-400">
              <ImageOff className="w-5 h-5" />
            </div>

            <span className="bg-brand-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              PHOTO LINK DALO YAHAN
            </span>

            <p className="text-[9px] text-gray-400 font-medium mt-1.5 leading-tight max-w-[130px]">
              Sheet mein link add karein
            </p>

            <span className="text-[8px] text-brand-300 font-mono mt-1 opacity-75">
              ID: {product.productId}
            </span>
          </div>
        )}

        {/* Badges Overlay (Discount, Out of Stock, Category) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-neutral-900/90 backdrop-blur-xs text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase border border-neutral-700">
              Sold Out
            </span>
          ) : (
            <>
              {product.discountBadge && (
                <span className="bg-brand-600 text-white text-[9px] font-extrabold tracking-wide px-2 py-0.5 rounded-md uppercase shadow-sm">
                  {product.discountBadge}
                </span>
              )}
              {product.isNew && (
                <span className="bg-neutral-900/90 text-brand-300 text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-md uppercase border border-brand-500/40">
                  New
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
          className={`absolute top-2 right-2 z-20 w-7.5 h-7.5 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white/90 backdrop-blur-xs text-gray-700 hover:text-brand-600 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView();
          }}
          className="absolute bottom-2 right-2 z-20 bg-neutral-900/80 hover:bg-neutral-900 text-white p-1.5 rounded-lg shadow-sm backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
          title="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Details Section */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between bg-white">
        <div className="cursor-pointer" onClick={onQuickView}>
          {/* Category & ID badge */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] font-bold text-brand-600 uppercase tracking-wider truncate">
              {product.category}
            </span>
            {product.fabric && (
              <span className="text-[8px] text-gray-400 font-medium truncate max-w-[80px]">
                {product.fabric}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-xs sm:text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 mt-0.5 leading-snug">
            {product.title}
          </h3>

          {/* Color & Size Pills if present */}
          <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-500 font-medium">
            {product.color && <span className="truncate">{product.color}</span>}
            {product.sizes && product.sizes.length > 0 && (
              <>
                <span>•</span>
                <span className="text-gray-400">{product.sizes.join(', ')}</span>
              </>
            )}
          </div>
        </div>

        {/* Pricing Area: Current Price, OriginalPrice with cut, Discount % */}
        <div className="mt-2 pt-2 border-t border-brand-50 space-y-2">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-black text-gray-950 text-sm sm:text-base">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-sans text-gray-400 line-through text-[11px]">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {product.discountPercent}% OFF
              </span>
            ) : null}
          </div>

          {/* DUAL ACTION BUTTONS: ADD TO CART & BUY NOW (Bigger, Bold, Black Button) */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {/* ADD TO CART Button */}
            <button
              onClick={handleAddToCartClick}
              disabled={isOutOfStock || addingToCart}
              className={`h-9 rounded-xl border flex items-center justify-center gap-1 text-[9.5px] font-bold uppercase tracking-tight transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : addingToCart
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white hover:bg-brand-50 border-neutral-300 hover:border-neutral-900 text-gray-900'
              }`}
              title="Add to Cart"
            >
              <ShoppingBag className="w-3 h-3 text-brand-600 shrink-0" />
              <span className="truncate">{addingToCart ? 'Added!' : 'ADD TO CART'}</span>
            </button>

            {/* BUY NOW Button (Black color, bigger, bold, opens WhatsApp with product details) */}
            <button
              onClick={handleBuyNowClick}
              disabled={isOutOfStock}
              className={`h-9 rounded-xl flex items-center justify-center text-[10.5px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-neutral-900 text-white border border-black'
              }`}
              title="BUY NOW"
            >
              <span>BUY NOW</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
