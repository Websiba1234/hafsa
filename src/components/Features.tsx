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
    <section id="brand-features" className="py-6 bg-white border-b border-brand-50/50">
      <div className="w-full px-3.5 sm:px-4">
        <div className="grid grid-cols-2 gap-2.5">
          {featuresList.slice(0, 4).map((feat, index) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col items-center text-center p-3 rounded-2xl bg-brand-50/30 border border-brand-100/40"
            >
              {/* Icon frame */}
              <div className="w-9 h-9 rounded-full bg-brand-100/80 flex items-center justify-center mb-1.5">
                {feat.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-[11px] font-bold text-gray-900 tracking-wide uppercase">
                {feat.title}
              </h3>

              {/* Description */}
              <p className="text-[9px] text-gray-500 mt-0.5 font-medium leading-tight">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
