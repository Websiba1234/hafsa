import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import SibaLogo from './SibaLogo';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSearchChange,
  searchQuery,
  onNavigate,
  activeSection
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Home', section: 'home' },
    { name: 'Shop', section: 'shop' },
    { name: 'Dupatta', section: 'dupatta' },
    { name: 'Hijab & Naqab', section: 'hijab-naqab' },
    { name: 'Kids Wear', section: 'kids-wear' },
    { name: 'New Arrivals', section: 'new-arrivals' },
    { name: 'Sale', section: 'sale' },
    { name: 'About Us', section: 'about-us' },
    { name: 'Contact Us', section: 'contact-us' },
    { name: 'Admin', section: 'admin' }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail) {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div id="promo-banner" className="bg-brand-100 text-brand-900 text-[11px] sm:text-xs font-semibold py-2 px-2 sm:px-4 text-center tracking-wider flex items-center justify-center gap-2 relative z-50">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-600 shrink-0" />
        <span className="truncate sm:overflow-visible">Dupatta, Hijab, Naqab, Kids Wear &amp; Daily Wear Clothes at Best Price - Siba Collection</span>
      </div>

      {/* Sticky Header */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5'
            : 'bg-white py-3'
        }`}
      >
        <div className="w-full px-3.5 sm:px-4">
          <div className="flex items-center justify-between gap-2">
            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-gray-700 hover:text-brand-600 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Premium Logo "Siba Collection" */}
            <div
              id="brand-logo-container"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-8 h-8 flex items-center justify-center"
              >
                <SibaLogo size="32" className="shadow-md rounded-full" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold tracking-wider text-gray-900 group-hover:text-brand-600 transition-colors uppercase">
                  Siba Collection
                </span>
                <span className="text-[8px] tracking-[0.2em] font-bold text-brand-600 uppercase -mt-0.5">
                  Premium Fashion
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div id="navbar-actions" className="flex items-center gap-1.5">
              {/* Search Toggle */}
              <button
                id="search-toggle-btn"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 text-gray-700 hover:text-brand-600 transition-colors relative"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Login/User Button */}
              <button
                id="user-profile-btn"
                onClick={() => {
                  if (isLoggedIn) {
                    if (confirm('Do you want to log out?')) {
                      setIsLoggedIn(false);
                      setLoginEmail('');
                    }
                  } else {
                    setIsLoginOpen(true);
                  }
                }}
                className={`p-1.5 transition-colors flex items-center gap-1 text-gray-700 hover:text-brand-600 ${
                  isLoggedIn ? 'text-brand-600' : ''
                }`}
                aria-label="User Account"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Wishlist Button */}
              <button
                id="wishlist-drawer-btn"
                onClick={onOpenWishlist}
                className="p-1.5 text-gray-700 hover:text-brand-600 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                id="cart-drawer-btn"
                onClick={onOpenCart}
                className="p-1.5 text-gray-900 hover:text-brand-600 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar dropdown when open */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-2 pb-1"
              >
                <input
                  type="text"
                  placeholder="Search Dupatta, Hijab, Kids Wear..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full text-xs py-2 px-3.5 rounded-full border border-brand-200 bg-brand-50/50 focus:outline-none focus:border-brand-500 text-gray-800 font-sans shadow-xs"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Sidebar Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-50 flex flex-col p-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <SibaLogo size="32" className="shadow-md rounded-full" />
                  <span className="font-serif font-bold text-gray-800 uppercase tracking-widest text-sm">
                    Siba Collection
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-500 hover:text-brand-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onNavigate(item.section);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                      activeSection === item.section
                        ? 'text-brand-600 pl-2 border-l-2 border-brand-500'
                        : 'text-gray-700 hover:text-brand-500'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-5 mt-4 space-y-3">
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="font-bold text-gray-800">Siba Collection Store</p>
                  <p className="text-[11px] text-gray-600 leading-snug">Road No. 5, Mahesh Babu Chowk, Muzaffarpur, Bihar - 842002</p>
                  <p className="text-[11px] font-medium text-brand-600">Call/WA: +91 8210941262</p>
                  <p className="text-[10px] text-gray-500">Email: 8210abdu@gmail.com</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative z-10 border border-brand-100"
            >
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-brand-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <SibaLogo size="48" className="shadow-lg rounded-full mx-auto mb-3 animate-pulse" style={{ animationDuration: '3s' }} />
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  Welcome to Siba Collection
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Access your exclusive rewards, orders, and wishlist
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@siba.com"
                    className="w-full text-sm p-3 rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500 bg-brand-50/35"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full text-sm p-3 rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500 bg-brand-50/35"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="rounded text-brand-500 accent-brand-500" />
                    Remember me
                  </label>
                  <a href="#" className="hover:text-brand-500 underline">
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm py-3 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Sign In
                </button>
              </form>

              <div className="text-center mt-6 border-t border-gray-100 pt-4 text-xs text-gray-500">
                Don't have an account?{' '}
                <button className="text-brand-600 font-bold hover:underline">
                  Sign up for free
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
