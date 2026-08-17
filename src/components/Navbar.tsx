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
    { name: 'Clothing', section: 'clothing' },
    { name: 'Accessories', section: 'accessories' },
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
      <div id="promo-banner" className="bg-brand-100 text-brand-800 text-xs font-medium py-2 px-4 text-center tracking-wider flex items-center justify-center gap-2 relative z-50">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-500" />
        <span>FREE SHIPPING ON ORDERS OVER ₹999 | EASY RETURNS & EXCHANGES</span>
      </div>

      {/* Sticky Header */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
            : 'bg-white py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand-500 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Premium Logo "Siba Collection" */}
            <div
              id="brand-logo-container"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-10 h-10 flex items-center justify-center"
              >
                <SibaLogo size="40" className="shadow-lg rounded-full" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-widest text-gray-900 group-hover:text-brand-500 transition-colors uppercase">
                  Siba Collection
                </span>
                <span className="text-[10px] tracking-[0.25em] font-medium text-brand-500 uppercase -mt-0.5">
                  Premium Fashion
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav id="desktop-nav" className="hidden lg:flex items-center gap-7">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.section)}
                  className={`relative py-1 text-sm font-medium tracking-wide transition-colors uppercase ${
                    activeSection === item.section
                      ? 'text-brand-600 font-semibold'
                      : 'text-gray-600 hover:text-brand-500'
                  }`}
                >
                  {item.name}
                  {activeSection === item.section && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Action Buttons */}
            <div id="navbar-actions" className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle */}
              <div className="relative">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 180, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute right-full top-1/2 -translate-y-1/2 mr-2 hidden sm:block"
                    >
                      <input
                        type="text"
                        placeholder="Search collection..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 rounded-full border border-brand-200 bg-brand-50 focus:outline-none focus:border-brand-500 text-gray-800 font-sans"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  id="search-toggle-btn"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-600 hover:text-brand-500 transition-colors relative"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

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
                className={`p-2 transition-colors flex items-center gap-1 text-gray-600 hover:text-brand-500 ${
                  isLoggedIn ? 'text-brand-500' : ''
                }`}
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
                {isLoggedIn && (
                  <span className="hidden md:inline text-xs font-semibold max-w-[80px] truncate text-brand-600">
                    Hi, Siba!
                  </span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                id="wishlist-drawer-btn"
                onClick={onOpenWishlist}
                className="p-2 text-gray-600 hover:text-brand-500 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                id="cart-drawer-btn"
                onClick={onOpenCart}
                className="p-2 text-gray-900 hover:text-brand-500 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Input (Visible always on mobile) */}
        <div className="block sm:hidden px-4 pt-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Siba Collection..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs py-2 pl-9 pr-4 rounded-full border border-brand-100 bg-brand-50/50 focus:outline-none focus:border-brand-300 text-gray-800"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
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

              <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
                <div className="text-xs text-gray-500">
                  <p className="font-semibold text-gray-700">Need help?</p>
                  <p className="mt-1">Call: +91 8210941262</p>
                  <p>Juran Chapra, Muzaffarpur</p>
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
