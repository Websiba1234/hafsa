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
      className="relative overflow-hidden bg-gradient-to-r from-brand-50 via-brand-100/65 to-brand-50 min-h-[90vh] flex flex-col justify-center items-center py-12 px-4 w-full text-center"
    >
      {/* Video Background - full cover */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          src="https://res.cloudinary.com/bwanhwiz/video/upload/v1783887045/gemini_generated_video_e96d6ae6_i0kkhg.mp4"
        />
        {/* Subtle dark gradient overlay for crystal clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="w-full relative z-10 flex flex-col items-center">
        {/* Text Content Area */}
        <motion.div
          id="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center w-full"
        >
          {/* Label */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600/90 backdrop-blur-md text-white text-[11px] font-extrabold tracking-widest uppercase rounded-full mb-4 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>SIBA COLLECTION • NEW ARRIVALS</span>
          </motion.div>

          {/* Hero Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-5xl font-black text-white leading-[1.12] tracking-tight drop-shadow-lg max-w-sm mx-auto"
          >
            Stand Out! <br />
            <span className="text-amber-100 italic font-bold">
              Discover Your Perfect Style
            </span>
          </motion.h1>

          {/* Hero Subheading */}
          <motion.p
            variants={itemVariants}
            className="mt-3.5 text-sm sm:text-base text-gray-100 font-medium leading-relaxed max-w-xs sm:max-w-sm mx-auto drop-shadow"
          >
            Dupatta, Hijab, Naqab, Kids Wear &amp; Daily Wear Clothes at Best Price - Siba Collection
          </motion.p>

          {/* Big Touch-Friendly CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-7 flex flex-col gap-3 w-full max-w-xs mx-auto"
          >
            <button
              id="hero-primary-cta"
              onClick={onShopClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-2xl shadow-xl transition-all cursor-pointer min-h-[50px]"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={onContactClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-white active:scale-[0.98] text-gray-900 font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-2xl shadow-lg border border-white/70 transition-all cursor-pointer min-h-[50px]"
            >
              <PhoneCall className="w-4 h-4 text-brand-600" />
              <span>CONTACT US</span>
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-5 border-t border-white/20 grid grid-cols-3 gap-2 w-full max-w-xs mx-auto"
          >
            <div className="flex flex-col items-center text-center bg-black/25 backdrop-blur-sm p-2 rounded-xl">
              <div className="flex items-center gap-1 text-amber-200 font-bold text-[10px] uppercase tracking-wider">
                <Truck className="w-3 h-3 text-amber-300" />
                <span>Free Delivery</span>
              </div>
              <span className="text-[9px] text-gray-200 mt-0.5">Over ₹999</span>
            </div>

            <div className="flex flex-col items-center text-center bg-black/25 backdrop-blur-sm p-2 rounded-xl">
              <div className="flex items-center gap-1 text-amber-200 font-bold text-[10px] uppercase tracking-wider">
                <RefreshCw className="w-3 h-3 text-amber-300" />
                <span>Easy Return</span>
              </div>
              <span className="text-[9px] text-gray-200 mt-0.5">7 Days</span>
            </div>

            <div className="flex flex-col items-center text-center bg-black/25 backdrop-blur-sm p-2 rounded-xl">
              <div className="flex items-center gap-1 text-amber-200 font-bold text-[10px] uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>100% Safe</span>
              </div>
              <span className="text-[9px] text-gray-200 mt-0.5">COD Avail</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
