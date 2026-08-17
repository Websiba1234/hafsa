import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, MessageSquare, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SibaLogo from './SibaLogo';

interface FooterProps {
  onNavigate: (section: string) => void;
  onContactFormSubmit?: () => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);
  
  // Contact Form state
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSubbed(true);
      setEmailInput('');
      setTimeout(() => setNewsletterSubbed(false), 5000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      setFormError('All fields are required.');
      return;
    }
    // Simulate contact form submission
    setFormSubmitted(true);
    setContactData({ name: '', email: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <footer id="brand-footer" className="bg-[#1c1c1c] text-gray-300 pt-12 sm:pt-16 border-t-4 border-brand-500">
      
      {/* Newsletter Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="bg-gradient-to-r from-brand-900/40 via-brand-950 to-brand-900/30 p-6 sm:p-8 rounded-3xl border border-brand-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1.5">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
              Join Our Newsletter
            </h3>
            <p className="text-xs text-gray-400 font-light">
              Stay Updated With New Arrivals & Exclusive Offers.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full max-w-md">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 text-xs py-3.5 px-4 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
            >
              {newsletterSubbed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12">
          
          {/* Logo and Brand Summary (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <SibaLogo size="40" className="shadow-lg rounded-full" />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-widest text-white uppercase">
                  Siba Collection
                </span>
                <span className="text-[10px] tracking-[0.25em] font-medium text-brand-400 uppercase -mt-0.5">
                  Premium Fashion Store
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Siba Collection is Muzaffarpur's premier style boutique, dedicated to curating high-end ethnic wear, designer Kurtis, elegant dresses, premium handbags, and tarnish-resistant rose-gold jewellery at accessible price points.
            </p>

            {/* Social Icons & WhatsApp buttons */}
            <div className="space-y-3.5">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Connect with Siba</p>
              <div className="flex gap-3">
                {/* Instagram button */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-[#E1306C] hover:text-white flex items-center justify-center text-gray-400 transition-all hover:-translate-y-0.5 shadow-sm"
                  aria-label="Instagram Siba Collection"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook button */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-[#1877F2] hover:text-white flex items-center justify-center text-gray-400 transition-all hover:-translate-y-0.5 shadow-sm"
                  aria-label="Facebook Siba Collection"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* WhatsApp button positioned in footer */}
                <a
                  href="https://wa.me/918210941262"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-[#25D366] hover:text-white flex items-center justify-center text-gray-400 transition-all hover:-translate-y-0.5 shadow-sm"
                  aria-label="WhatsApp Siba Collection"
                >
                  <span className="font-bold text-xs uppercase text-[#25D366] hover:text-white">WA</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick links & Policies (4 columns) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-brand-500 pl-2">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li>
                  <button onClick={() => onNavigate('home')} className="hover:text-brand-400 transition-colors cursor-pointer">
                    Home Page
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('shop')} className="hover:text-brand-400 transition-colors cursor-pointer">
                    Shop Collection
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('about-us')} className="hover:text-brand-400 transition-colors cursor-pointer">
                    About Siba Collection
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact-us')} className="hover:text-brand-400 transition-colors cursor-pointer">
                    Contact Store
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Policies */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-brand-500 pl-2">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li>
                  <button onClick={() => onNavigate('privacy-policy')} className="hover:text-brand-400 transition-colors cursor-pointer text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('shipping-policy')} className="hover:text-brand-400 transition-colors cursor-pointer text-left">
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('returns-exchange')} className="hover:text-brand-400 transition-colors cursor-pointer text-left">
                    Returns & Exchange
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('faq')} className="hover:text-brand-400 transition-colors cursor-pointer text-left">
                    FAQs
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Details & Google Map Embed (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-brand-500 pl-2">
              Contact Details
            </h4>

            {/* Primary Email & Address text blocks */}
            <div className="space-y-3.5 text-xs text-gray-400">
              {/* Primary Email Contact */}
              <div className="flex items-center gap-3 bg-gray-900/90 border border-brand-500/40 p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-brand-400 font-bold uppercase tracking-widest">Primary Contact</span>
                  <a href="mailto:support@sibacollection.com" className="text-white hover:text-brand-400 font-semibold truncate text-xs">
                    support@sibacollection.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 flex-none mt-0.5" />
                <span>
                  <b>Siba Collection</b>
                  <br />
                  Juran Chapra, Brahampura, Muzaffarpur, Bihar, India - 842001
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 flex-none" />
                <a href="tel:+918210941262" className="hover:text-brand-400 font-medium">
                  +91 8210941262
                </a>
              </div>
            </div>

            {/* Google Map location iframe */}
            <div id="google-map-container" className="rounded-2xl overflow-hidden border border-gray-800 shadow-lg h-44 bg-gray-900 relative">
              <iframe
                title="Siba Collection Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14343.896655112521!2d85.38555805541991!3d26.12423370000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed10dfec59fa65%3A0xe54d6fa7c6c7b9e0!2sJuran%20Chapra%2C%20Muzaffarpur%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.6) invert(0.9) contrast(1.2)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Soft overlay banner */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[9px] text-white">
                <span>Muzaffarpur, Bihar</span>
                <span className="text-brand-400 font-bold">Directions ↗</span>
              </div>
            </div>
          </div>

        </div>

        {/* Contact/Write Us form inside footer */}
        <div id="write-to-us-section" className="mt-16 pt-12 border-t border-gray-800 max-w-xl mx-auto">
          <div className="text-center mb-6">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Leave Us a Message
            </h4>
            <p className="text-[11px] text-gray-500 mt-1">
              Have questions about Siba Collection products or delivery times? We'd love to assist.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-xl border border-gray-700 bg-gray-900/40 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-xl border border-gray-700 bg-gray-900/40 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div>
              <textarea
                rows={3}
                required
                placeholder="Write your query details here..."
                value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                className="w-full text-xs p-3.5 rounded-xl border border-gray-700 bg-gray-900/40 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            {formError && (
              <p className="text-xs text-brand-500 flex items-center gap-1.5 justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
                {formError}
              </p>
            )}

            {formSubmitted && (
              <p className="text-xs text-emerald-500 flex items-center gap-1.5 justify-center font-bold bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/50">
                <CheckCircle className="w-4 h-4" />
                Thank you! Your message has been sent successfully to Siba Collection.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

      </div>

      {/* Under copyright bar with payment icons */}
      <div id="copyright-footer-bar" className="bg-[#141414] py-6 border-t border-gray-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              © 2026 <b>Siba Collection</b>. Built with Elegant Feminine Aesthetics. All Rights Reserved.
            </span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Admin Panel
            </button>
          </div>

          {/* Payment gateway icons */}
          <div className="flex items-center gap-3 opacity-60">
            <span className="bg-gray-800 text-[10px] text-gray-400 font-bold px-2 py-0.5 rounded tracking-wider">UPI</span>
            <span className="bg-gray-800 text-[10px] text-gray-400 font-bold px-2 py-0.5 rounded tracking-wider">COD</span>
            <span className="bg-gray-800 text-[10px] text-gray-400 font-bold px-2 py-0.5 rounded tracking-wider">VISA</span>
            <span className="bg-gray-800 text-[10px] text-gray-400 font-bold px-2 py-0.5 rounded tracking-wider">RUPAY</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
