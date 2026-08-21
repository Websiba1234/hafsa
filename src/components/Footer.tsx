import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Sparkles, AlertCircle, CheckCircle, Store } from 'lucide-react';
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
    setFormSubmitted(true);
    setContactData({ name: '', email: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <footer id="brand-footer" className="bg-[#181818] text-gray-300 pt-8 border-t-4 border-brand-600">
      
      {/* Newsletter Bar */}
      <div className="w-full px-3 pb-6 border-b border-gray-800">
        <div className="bg-gradient-to-r from-brand-950 via-neutral-900 to-brand-950 p-4 rounded-2xl border border-brand-800/40 flex flex-col gap-3">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-sm font-bold text-white tracking-wide">
              Join Siba VIP Club
            </h3>
            <p className="text-[10px] text-gray-400 font-light">
              Get updates on new Dupatta 99, Stoll & Hijab arrivals in Muzaffarpur.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5 w-full">
            <input
              type="email"
              required
              placeholder="Enter WhatsApp / Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 text-[11px] py-2.5 px-3 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              {newsletterSubbed ? 'Joined!' : 'Join'}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full px-4 py-6">
        <div className="space-y-6">
          
          {/* Logo and Brand Summary */}
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <SibaLogo size="32" className="shadow-md rounded-full" />
              <div className="flex flex-col text-left">
                <span className="font-serif text-base font-bold tracking-wider text-white uppercase">
                  Siba Collection
                </span>
                <span className="text-[8px] tracking-[0.2em] font-medium text-brand-400 uppercase -mt-0.5">
                  Road No. 5, Mahesh Babu Chowk, Muzaffarpur
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-normal leading-relaxed max-w-xs mx-auto">
              Muzaffarpur's leading destination for Dupatta 99, Cotton & Banarasi Dupatta, Stoll, Hijab, Niqab, Kurti, Bache Ka Kapra, and Dastarkhan. All India Delivery & COD Available.
            </p>

            {/* Social Icons & WhatsApp buttons */}
            <div className="flex justify-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#E1306C] hover:text-white flex items-center justify-center text-gray-400 transition-all shadow-sm"
                aria-label="Instagram Siba Collection"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#1877F2] hover:text-white flex items-center justify-center text-gray-400 transition-all shadow-sm"
                aria-label="Facebook Siba Collection"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://wa.me/918210941262"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366] hover:text-white flex items-center gap-1.5 text-[#25D366] transition-all shadow-sm"
                aria-label="WhatsApp Siba Collection"
              >
                <span className="font-bold text-[10px] uppercase">WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Quick links & Policies in 2 columns */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest border-l-2 border-brand-500 pl-1.5">
                Quick Links
              </h4>
              <ul className="space-y-1.5 text-[10px] text-gray-400">
                <li>
                  <button onClick={() => onNavigate('home')} className="hover:text-brand-400 transition-colors cursor-pointer">
                    Home Page
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('shop')} className="hover:text-brand-400 transition-colors cursor-pointer">
                    Shop 14 Categories
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('about-us')} className="hover:text-brand-400 transition-colors cursor-pointer">
                    About Siba Collection
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact-us')} className="hover:text-brand-400 transition-colors cursor-pointer">
                    Store Location & Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest border-l-2 border-brand-500 pl-1.5">
                Customer Care
              </h4>
              <ul className="space-y-1.5 text-[10px] text-gray-400">
                <li>
                  <span className="text-gray-300">All India Delivery</span>
                </li>
                <li>
                  <span className="text-gray-300">Cash on Delivery (COD)</span>
                </li>
                <li>
                  <span className="text-gray-300">Easy 7-Day Exchange</span>
                </li>
                <li>
                  <span className="text-emerald-400 font-bold">100% Genuine Quality</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Exact Address & Contact Details */}
          <div id="contact-info" className="space-y-2.5 pt-3 border-t border-gray-800">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest border-l-2 border-brand-500 pl-1.5 flex items-center justify-between">
              <span>Store Address &amp; Contact</span>
              <span className="text-brand-400 text-[9px] font-normal lowercase">Muzaffarpur, Bihar</span>
            </h4>

            <div className="space-y-2 text-[11px] text-gray-400">
              {/* Full Address Card */}
              <div className="bg-neutral-900/90 border border-brand-500/30 p-2.5 rounded-xl space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold text-[11px]">
                      Siba Collection
                    </p>
                    <p className="text-gray-300 text-[10.5px] leading-relaxed">
                      Road No. 5, Mahesh Babu Chowk, Muzaffarpur, Bihar - 842002
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <a
                  href="tel:+918210941262"
                  className="flex-1 flex items-center gap-1.5 bg-neutral-900 border border-gray-800 p-2 rounded-lg text-white hover:border-brand-500 text-[10px]"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-400" />
                  <span>+91 8210941262</span>
                </a>

                <a
                  href="mailto:8210abdu@gmail.com"
                  className="flex-1 flex items-center gap-1.5 bg-neutral-900 border border-gray-800 p-2 rounded-lg text-white hover:border-brand-500 text-[10px] truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="truncate">8210abdu@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Google Map embed */}
            <div id="google-map-container" className="rounded-xl overflow-hidden border border-gray-800 shadow-md h-32 bg-gray-900 relative mt-2">
              <iframe
                title="Siba Collection Road No 5 Mahesh Babu Chowk Muzaffarpur Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14343.896655112521!2d85.38555805541991!3d26.12423370000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed10dfec59fa65%3A0xe54d6fa7c6c7b9e0!2sMuzaffarpur%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.6) invert(0.9) contrast(1.2)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

        {/* Contact/Write Us form inside footer */}
        <div id="write-to-us-section" className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-center mb-3">
            <h4 className="font-serif text-xs font-bold text-white tracking-wide">
              Send Enquiry to Siba Collection
            </h4>
            <p className="text-[9.5px] text-gray-500 mt-0.5">
              Direct enquiry to Road No. 5, Mahesh Babu Chowk store
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-2">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={contactData.name}
              onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
              className="w-full text-[11px] p-2.5 rounded-xl border border-gray-700 bg-gray-900/80 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            <input
              type="email"
              required
              placeholder="Email or Mobile No."
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              className="w-full text-[11px] p-2.5 rounded-xl border border-gray-700 bg-gray-900/80 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            <textarea
              rows={2}
              required
              placeholder="Write your query (Dupatta, Hijab, Bulk order...)"
              value={contactData.message}
              onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
              className="w-full text-[11px] p-2.5 rounded-xl border border-gray-700 bg-gray-900/80 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 resize-none"
            />

            {formError && (
              <p className="text-[10px] text-brand-500 flex items-center gap-1 justify-center">
                <AlertCircle className="w-3 h-3" />
                {formError}
              </p>
            )}

            {formSubmitted && (
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 justify-center font-bold bg-emerald-950/60 p-2 rounded-xl border border-emerald-800">
                <CheckCircle className="w-3.5 h-3.5" />
                Message received! We will contact you soon.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Submit Enquiry</span>
            </button>
          </form>
        </div>

      </div>

      {/* Under copyright bar */}
      <div id="copyright-footer-bar" className="bg-[#111111] py-4 border-t border-gray-900 text-[10px]">
        <div className="w-full px-3 flex flex-col items-center justify-center gap-2 text-center">
          <div className="text-gray-500">
            <span>© 2026 <b>Siba Collection</b>. Road No. 5, Mahesh Babu Chowk, Muzaffarpur, Bihar - 842002</span>
          </div>

          {/* Payment gateway icons */}
          <div className="flex items-center gap-2 opacity-60">
            <span className="bg-gray-800 text-[9px] text-gray-400 font-bold px-1.5 py-0.5 rounded tracking-wider">UPI</span>
            <span className="bg-gray-800 text-[9px] text-gray-400 font-bold px-1.5 py-0.5 rounded tracking-wider">COD</span>
            <span className="bg-gray-800 text-[9px] text-gray-400 font-bold px-1.5 py-0.5 rounded tracking-wider">VISA</span>
            <span className="bg-gray-800 text-[9px] text-gray-400 font-bold px-1.5 py-0.5 rounded tracking-wider">RUPAY</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
