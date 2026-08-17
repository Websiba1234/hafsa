import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveItem: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveItem,
  onAddToCart
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black"
        />

        {/* Sliding Drawer Container */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-brand-50/50">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-600 fill-brand-600 animate-pulse" />
                <h2 className="font-serif text-lg font-bold text-gray-900 uppercase tracking-wider">
                  My Wishlist ({wishlistItems.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-brand-500 hover:bg-white border border-transparent hover:border-brand-100 transition-all cursor-pointer"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items List Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
              {wishlistItems.length === 0 ? (
                /* Empty state */
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-brand-100/50 flex items-center justify-center text-brand-500 mb-4">
                    <Heart className="w-8 h-8 fill-brand-200 text-brand-500" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed font-light">
                    Save your favorite outfits and accessories here to keep track of premium choices.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow transition-all cursor-pointer"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                /* Active list */
                wishlistItems.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-4 flex gap-4"
                  >
                    {/* Image thumb */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-none">
                      <img
                        src={product.image || undefined}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details & Actions */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h4 className="font-serif text-sm font-bold text-gray-900 leading-tight line-clamp-1">
                          {product.name}
                        </h4>

                        {/* Price Tag */}
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-serif font-bold text-gray-950 text-xs">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="font-serif text-gray-400 line-through text-[10px]">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart directly from Wishlist, and Trash Button */}
                      <div className="flex items-center justify-between mt-3">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onRemoveItem(product.id);
                          }}
                          className="flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>

                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-brand-600 font-medium cursor-pointer"
                          aria-label="Remove wishlist item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Close footer panel */}
            {wishlistItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-brand-50/20">
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
