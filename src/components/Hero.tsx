import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, PhoneCall, Sparkles, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onContactClick: () => void;
}

export default function Hero({ onShopClick, onContactClick }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section
      id="hero-banner"
      className="relative overflow-hidden bg-gradient-to-r from-brand-50 via-brand-100/65 to-brand-50 py-16 sm:py-24 md:py-32 flex items-center min-h-[550px] md:min-h-[680px]"
    >
      {/* Video Background */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/bwanhwiz/video/upload/v1783887045/gemini_generated_video_e96d6ae6_i0kkhg.mp4"
        />
        {/* Subtle dark overlay (25%) */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Text Content Area */}
          <motion.div
            id="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
          >
            {/* Minimal Premium Label */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 bg-brand-200/50 text-brand-800 text-xs font-bold tracking-widest uppercase rounded-full self-center lg:self-start mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span>NEW ARRIVALS AVAILABLE NOW</span>
            </motion.div>

            {/* Hero Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl font-black text-[#FFFFFF] leading-[1.08] tracking-tight"
            >
              Discover Your <br className="hidden sm:inline" />
              <span className="text-[#F5F5F5] italic font-medium pr-1">
                Perfect Style
              </span>
            </motion.h1>

            {/* Hero Subheading */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 font-sans font-light leading-relaxed"
            >
              Latest Women's Fashion, Kurtis, Dresses, Tops, Bottom Wear, Bags & Accessories at Affordable Prices.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                id="hero-primary-cta"
                onClick={onShopClick}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={onContactClick}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-50 text-gray-800 font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-sm hover:shadow-md border border-brand-200 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-brand-500" />
                <span>Contact Us</span>
              </button>
            </motion.div>

            {/* High-End Inline Trust Elements (Matching the reference layout) */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-10 border-t border-brand-200/50 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1.5 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-brand-500" />
                  <span>Free Shipping</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-sans">On orders over ₹999</span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1.5 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <RefreshCw className="w-3.5 h-3.5 text-brand-500" />
                  <span>Easy Returns</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-sans">Hassle free returns</span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1.5 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-brand-500" />
                  <span>Secure Payment</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-sans">100% secure checkout</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Area: Abstract Floral & Fabric Luxury Card Composition */}
          {/* The design represents the fashion store brand abstract elements (fully human-free) */}
          <motion.div
            id="hero-graphic"
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.4 }}
            className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[420px]"
          >
            {/* Main elegant visual frame */}
            <div className="relative w-full max-w-[380px] h-[480px] rounded-[100px] border-[12px] border-white shadow-2xl overflow-hidden bg-gradient-to-b from-brand-100 to-brand-200 flex flex-col justify-between p-8">
              {/* Overlay abstract artwork inside */}
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
              
              {/* Premium geometric layout lines */}
              <div className="absolute top-10 left-10 right-10 bottom-10 rounded-[60px] border border-brand-300/40 pointer-events-none" />

              {/* Top Details */}
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-display font-medium tracking-widest text-brand-800 uppercase">
                  Est. 2026
                </span>
                <span className="text-[10px] font-display font-medium tracking-widest text-brand-800 uppercase">
                  Siba Collection
                </span>
              </div>

              {/* Center Abstract Floral Line-Art Element (Stunning Vector Look) */}
              <div className="relative z-10 text-center py-4 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border border-brand-300 flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center animate-spin" style={{ animationDuration: '30s' }}>
                    <svg viewBox="0 0 100 100" className="w-14 h-14 text-brand-600">
                      <path d="M50 0 C60 30 70 30 100 50 C70 70 60 70 50 100 C40 70 30 70 0 50 C30 30 40 30 50 0 Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                <h4 className="font-serif font-bold text-gray-900 tracking-wide text-lg">
                  LUXURY SILHOUETTES
                </h4>
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mt-1">
                  Crafted To Perfection
                </p>
              </div>

              {/* Bottom Premium Details */}
              <div className="relative z-10 text-center">
                <p className="font-serif italic text-sm text-brand-800">
                  "Fashion is the armor to survive the reality of everyday life."
                </p>
                <div className="mt-4 flex justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-300" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-200" />
                </div>
              </div>
            </div>

            {/* Little floating decorative label cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute left-0 top-[25%] bg-white rounded-2xl shadow-lg p-3.5 border border-brand-50/50 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                20%
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-900 tracking-wide">FLAT DISCOUNT</p>
                <p className="text-[9px] text-gray-500">Selected Festivewear</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute right-0 bottom-[20%] bg-white rounded-2xl shadow-lg p-3.5 border border-brand-50/50 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-900 tracking-wide">PREMIUM ONLY</p>
                <p className="text-[9px] text-gray-500">100% Handpicked Quality</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
