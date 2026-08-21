import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Plus, Minus, ShieldCheck, Truck, MessageCircle, ImageOff, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { generateWhatsAppBuyUrl } from '../services/googleSheetService';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (qty: number, size?: string, color?: string) => void;
  onWishlistToggle: () => void;
  isWishlisted: boolean;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onWishlistToggle,
  isWishlisted
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addingState, setAddingState] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || '');
      setQuantity(1);
      setImgError(false);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Free Size');
      }
      if (product.color) {
        setSelectedColor(product.color);
      } else {
        setSelectedColor('Standard');
      }
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    setAddingState(true);
    onAddToCart(quantity, selectedSize, selectedColor);
    setTimeout(() => {
      setAddingState(false);
      onClose();
    }, 900);
  };

  const handleWhatsAppBuy = () => {
    const url = generateWhatsAppBuyUrl({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isOutOfStock = !product.isAvailable || (product.stock !== undefined && product.stock <= 0);
  const hasValidDisplayImage = product.hasValidImage && selectedImage && !imgError;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto relative z-10 border border-brand-200 flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white transition-colors z-30 cursor-pointer shadow-md"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Product Image Frame */}
          <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden flex items-center justify-center">
            {hasValidDisplayImage ? (
              <img
                src={selectedImage}
                alt={product.title}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              /* Exact requested placeholder */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-brand-950 text-white relative">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mb-2.5 text-brand-400">
                  <ImageOff className="w-6 h-6" />
                </div>
                <span className="bg-brand-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                  PHOTO LINK DALO YAHAN
                </span>
                <p className="text-xs text-gray-400 font-medium mt-2 leading-tight">
                  Google Sheet mein image URL enter karein
                </p>
                <span className="text-[10px] text-brand-300 font-mono mt-1">
                  Product ID: {product.productId}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
              {product.discountBadge && (
                <span className="bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                  {product.discountBadge}
                </span>
              )}
              <span className="bg-neutral-900/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-neutral-700">
                {product.category}
              </span>
            </div>

            {/* Wishlist button */}
            <button
              onClick={onWishlistToggle}
              className={`absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white/90 text-gray-800 hover:text-brand-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Info & Controls */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              {/* Product Title */}
              <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-950 tracking-tight leading-snug">
                {product.title}
              </h2>

              {/* Price & MRP Block */}
              <div className="flex items-baseline gap-2.5 mt-2 p-2.5 rounded-xl bg-brand-50/60 border border-brand-100/80">
                <span className="font-serif text-xl font-black text-gray-950">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-gray-400 line-through text-xs font-medium">
                    MRP: ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountBadge && (
                  <span className="text-brand-700 bg-brand-100 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ml-auto">
                    Save {product.discountBadge}
                  </span>
                )}
              </div>

              {/* Description & Fabric Specs */}
              <p className="text-xs text-gray-600 font-normal leading-relaxed mt-2.5">
                {product.description}
              </p>

              {product.fabric && (
                <div className="mt-2 text-[11px] text-gray-700 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200/70 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">Fabric & Material:</span>
                  <span className="text-brand-700 font-semibold">{product.fabric}</span>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-3.5">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wide block mb-1.5">
                    Available Size:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          selectedSize === s
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Info */}
              {product.color && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wide block mb-1">
                    Color: <span className="font-normal text-brand-700 ml-1">{product.color}</span>
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-3.5 flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wide">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-gray-600 hover:text-brand-600 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-xs text-gray-900 w-7 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-gray-600 hover:text-brand-600 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons: Add to Cart & WhatsApp Buy */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* ADD TO CART */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingState}
                  className={`h-11 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : addingState
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-neutral-900 text-neutral-950 hover:bg-neutral-50 active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-brand-600" />
                  <span>{addingState ? 'Added!' : 'ADD TO CART'}</span>
                </button>

                {/* BUY NOW (Black Button, Opens WhatsApp) */}
                <button
                  onClick={handleWhatsAppBuy}
                  disabled={isOutOfStock}
                  className={`h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-neutral-900 text-white border border-black'
                  }`}
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Assurances */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-brand-600" /> Fast Delivery
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-brand-600" /> 100% Authentic Quality
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
