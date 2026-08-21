import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (discountAmount: number, promoApplied: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); // decimal discount (e.g. 0.20 for 20%)
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate math totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 999;
  const shippingCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 99;
  const freeShippingProgress = Math.min((subtotal / 999) * 100, 100);
  const amountToFreeShipping = 999 - subtotal;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.toUpperCase().trim();
    if (code === 'SIBA20' || code === 'WELCOME20') {
      setAppliedPromo(code);
      setPromoDiscount(0.20);
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try SIBA20!');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoDiscount(0);
  };

  const discountAmount = subtotal * promoDiscount;
  const finalTotal = subtotal - discountAmount + shippingCost;

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
                <ShoppingBag className="w-5 h-5 text-brand-600" />
                <h2 className="font-serif text-lg font-bold text-gray-900 uppercase tracking-wider">
                  Shopping Bag ({cartItems.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-brand-500 hover:bg-white border border-transparent hover:border-brand-100 transition-all cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress bar */}
            {cartItems.length > 0 && (
              <div className="px-6 py-4 bg-brand-50/30 border-b border-gray-100 text-xs">
                {isFreeShipping ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-bounce" />
                    <span>You've unlocked FREE Standard Shipping! 🎉</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-gray-600 flex justify-between">
                      <span>Add <b>₹{amountToFreeShipping.toLocaleString('en-IN')}</b> more for <b>FREE Shipping</b></span>
                      <span className="font-semibold text-brand-600">₹{subtotal} / ₹999</span>
                    </div>
                    {/* Progress Slider track */}
                    <div className="w-full bg-brand-100 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${freeShippingProgress}%` }}
                        className="bg-brand-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Items List area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
              {cartItems.length === 0 ? (
                /* Empty state */
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-brand-100/50 flex items-center justify-center text-brand-500 mb-4 animate-bounce" style={{ animationDuration: '4s' }}>
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    Your shopping bag is empty
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed font-light">
                    Looks like you haven't added any premium outfits yet. Explore our Siba Collection.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow transition-all cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                /* Active items */
                cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-4 flex gap-4"
                  >
                    {/* Thumb frame */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden border border-gray-100 bg-neutral-900 flex-none relative flex items-center justify-center">
                      {item.product.hasValidImage && item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-1 text-[8px] font-bold text-brand-300">
                          SIBA
                        </div>
                      )}
                    </div>

                    {/* Details and quantity adjustments */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h4 className="font-serif text-sm font-bold text-gray-900 leading-tight line-clamp-1">
                          {item.product.name || item.product.title}
                        </h4>

                        {/* Selected Variants */}
                        <div className="flex flex-wrap gap-2 items-center mt-1 text-[10px] text-gray-500">
                          {item.selectedSize && (
                            <span className="bg-brand-100 text-brand-800 font-bold px-1.5 py-0.5 rounded uppercase">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-medium">
                              Color: {typeof item.selectedColor === 'object' ? (item.selectedColor as any).name : item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Math Price and adjustments controls */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Adjust qty buttons */}
                        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-2 py-1 w-24">
                          <button
                            onClick={() => onUpdateQty(index, Math.max(1, item.quantity - 1))}
                            className="p-0.5 text-gray-500 hover:text-brand-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(index, item.quantity + 1)}
                            className="p-0.5 text-gray-500 hover:text-brand-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Total pricing + Trash action */}
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-gray-900 text-sm">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="p-1.5 text-gray-400 hover:text-brand-600 transition-colors cursor-pointer"
                            aria-label="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Calculations and Checkout block (Sticky bottom) */}
            {cartItems.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 bg-brand-50/20 space-y-4">
                {/* Promo application Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. SIBA20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedPromo}
                      className="w-full text-xs p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:border-brand-500 bg-white disabled:bg-gray-100 uppercase"
                    />
                    <Percent className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3.5" />
                  </div>
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs uppercase px-4 rounded-xl cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </form>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                      Promo Applied: <b>{appliedPromo}</b>
                    </span>
                    <span>20% OFF applied!</span>
                  </div>
                )}

                {promoError && (
                  <p className="text-[10px] text-brand-600 font-medium pl-1">{promoError}</p>
                )}

                {/* Subtotals breakdown list */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Bag Subtotal</span>
                    <span className="font-serif">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promo Discount (20%)</span>
                      <span className="font-serif">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charges</span>
                    <span className="font-serif">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-700 font-semibold uppercase">Free</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-gray-900 border-t border-dashed border-gray-200 pt-3.5">
                    <span>Total Amount</span>
                    <span className="font-serif">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  id="cart-checkout-btn"
                  onClick={() => onCheckout(discountAmount, appliedPromo)}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
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
