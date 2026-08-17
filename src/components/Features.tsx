import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function Features() {
  const featuresList = [
    {
      id: 'feat-1',
      icon: <Award className="w-6 h-6 text-brand-600" />,
      title: 'Premium Quality',
      desc: 'Handpicked fabrics, artisan stitching, and high-luster materials.'
    },
    {
      id: 'feat-2',
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
      title: 'Secure Payments',
      desc: 'Encrpyted checkouts, cash on delivery, and instant safe UPI payments.'
    },
    {
      id: 'feat-3',
      icon: <Truck className="w-6 h-6 text-brand-600" />,
      title: 'Fast Delivery',
      desc: 'Quick dispatch and rapid delivery across India within 3-5 days.'
    },
    {
      id: 'feat-4',
      icon: <RotateCcw className="w-6 h-6 text-brand-600" />,
      title: 'Easy Returns',
      desc: 'Hassle-free, smooth 7-day returns & simple product exchanges.'
    },
    {
      id: 'feat-5',
      icon: <Headphones className="w-6 h-6 text-brand-600" />,
      title: '24×7 Customer Support',
      desc: 'Dedicated round-the-clock WhatsApp support for any shopping assistance.'
    }
  ];

  return (
    <section id="brand-features" className="py-16 bg-white border-b border-brand-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {featuresList.map((feat, index) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-brand-50/20 hover:bg-brand-50 hover:shadow-md border border-transparent hover:border-brand-100/30 transition-all duration-300"
            >
              {/* Icon frame */}
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                {feat.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-sm font-bold text-gray-900 tracking-wide uppercase">
                {feat.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed max-w-[200px]">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
