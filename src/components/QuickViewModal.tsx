import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Plus, Minus, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (qty: number, size?: string, color?: { name: string; hex: string }) => void;
  onBuyNow: (qty: number, size?: string, color?: { name: string; hex: string }) => void;
  onWishlistToggle: () => void;
  isWishlisted: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  isWishlisted
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(undefined);
  const [addingState, setAddingState] = useState(false);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  // Initialize values when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      // Auto-select first size and color if available
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('');
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor(undefined);
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
    }, 1000);
  };

  const handleBuyNow = () => {
    onBuyNow(quantity, selectedSize, selectedColor);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-brand-100 flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-brand-50 hover:bg-brand-100 text-gray-500 hover:text-brand-600 transition-colors z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 flex-1">
            {/* Left Side: Images View Panel */}
            <div className="space-y-4">
              {/* Active Image frame */}
              <div className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden border border-brand-100/40 relative">
                <img
                  src={selectedImage || product.image || FALLBACK_IMAGE}
                  alt={product.name}
                  onError={handleImgError}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />
                
                {product.discountBadge && (
                  <span className="absolute top-4 left-4 bg-brand-600 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow">
                    {product.discountBadge}
                  </span>
                )}
              </div>

              {/* Thumbnails Swapper List */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedImage(product.image)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === product.image ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-200 hover:border-brand-300'
                  }`}
                >
                  <img src={product.image || FALLBACK_IMAGE} alt="Thumbnail 1" onError={handleImgError} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={() => setSelectedImage(product.hoverImage)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === product.hoverImage ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-200 hover:border-brand-300'
                  }`}
                >
                  <img src={product.hoverImage || product.image || FALLBACK_IMAGE} alt="Thumbnail 2" onError={handleImgError} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            {/* Right Side: Product Details & Controls */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category Tag */}
                <span className="text-xs text-brand-500 font-bold uppercase tracking-widest">
                  {product.category}
                </span>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2 tracking-tight">
                  {product.name}
                </h2>

                {/* Stars and Reviews */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {product.rating} Rating
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400 underline cursor-pointer">
                    {product.reviewCount} customer reviews
                  </span>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-3 mt-4 bg-brand-50/50 p-3 rounded-xl border border-brand-100/30">
                  <span className="font-serif text-2xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="font-serif text-gray-400 line-through text-sm">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  {product.discountBadge && (
                    <span className="text-brand-600 text-xs font-bold tracking-wide uppercase">
                      Save {product.discountBadge}
                    </span>
                  )}
                </div>

                {/* Brief description */}
                <p className="text-sm text-gray-600 font-light leading-relaxed mt-4">
                  {product.description}
                </p>

                {/* Bullet details list */}
                <ul className="mt-4 space-y-1.5 text-xs text-gray-500 list-disc pl-5">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="font-light">
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Select Size
                      </span>
                      <button className="text-[10px] text-brand-500 font-semibold hover:underline">
                        Size Guide
                      </button>
                    </div>
                    <div className="flex gap-2.5 mt-2.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-10 h-10 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all flex items-center justify-center cursor-pointer ${
                            selectedSize === size
                              ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-6">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Select Color:{' '}
                      <span className="font-light text-gray-500 normal-case ml-1">
                        {selectedColor?.name || ''}
                      </span>
                    </span>
                    <div className="flex gap-3 mt-2.5">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-7.5 h-7.5 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer relative group/color`}
                          style={{ borderColor: selectedColor?.name === color.name ? '#e84167' : '#e5e7eb' }}
                        >
                          <span
                            className="w-5.5 h-5.5 rounded-full block shadow-inner"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="absolute bottom-full mb-1.5 hidden group-hover/color:block bg-gray-800 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap z-30">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Adjust Quantity and Purchase Controls */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Quantity adjustment panel */}
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 w-full sm:max-w-[110px]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-gray-500 hover:text-brand-500 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-semibold text-sm text-gray-800 w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-gray-500 hover:text-brand-500 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Bag CTA (Secondary / Outline style) */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addingState || (product.stock !== undefined && product.stock <= 0)}
                    className={`flex-1 flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all ${
                      product.stock !== undefined && product.stock <= 0
                        ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-2 border-brand-600 text-brand-700 hover:bg-brand-50 active:scale-95 cursor-pointer'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {product.stock !== undefined && product.stock <= 0
                        ? 'Out of Stock'
                        : addingState
                        ? 'Adding...'
                        : 'Add to Bag'}
                    </span>
                  </button>

                  {/* Buy Now CTA (Primary / Solid style) */}
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock !== undefined && product.stock <= 0}
                    className={`flex-1 flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-all ${
                      product.stock !== undefined && product.stock <= 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95 cursor-pointer'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{product.stock !== undefined && product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}</span>
                  </button>


                  {/* Add to Wishlist Toggle */}
                  <button
                    onClick={onWishlistToggle}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-colors cursor-pointer shrink-0 ${
                      isWishlisted
                        ? 'bg-brand-100 border-brand-200 text-brand-600'
                        : 'bg-white border-gray-200 text-gray-500 hover:text-brand-500 hover:border-brand-200'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Safe Checkout trust indicators */}
                <div className="mt-6 flex flex-wrap gap-4 text-[10px] text-gray-500 justify-center sm:justify-start">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-brand-500" />
                    Dispatch within 24 Hours
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 text-brand-500" />
                    7-Day Easy Exchange Policy
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                    100% Secure Checkout Guaranteed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
