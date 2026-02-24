'use client';

import React from 'react';
import { motion, easeOut } from 'framer-motion';

interface ExcellenceItem {
  number: string;
  title: string;
  description: string;
}

interface ExcellenceSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    items?: ExcellenceItem[];
  };
}

const ExcellenceSection: React.FC<ExcellenceSectionProps> = ({ data }) => {
  const {
    title = 'Our Excellence',
    subtitle = 'Commitment to Perfection',
    description = 'We believe in delivering nothing but the finest quality in every aspect',
    items = [
      {
        number: '01',
        title: 'Exceptional Quality',
        description: 'Meticulously crafted with the finest materials and precision'
      },
      {
        number: '02',
        title: 'Timeless Design',
        description: 'Elegant aesthetics that endure through generations'
      },
      {
        number: '03',
        title: 'Expert Craftsmanship',
        description: 'Skilled artisans dedicated to perfection in every detail'
      },
      {
        number: '04',
        title: 'Sustainable Practice',
        description: 'Ethical sourcing and environmentally conscious methods'
      }
    ]
  } = data || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  return (
    <section className="py-24 md:py-32 bg-cream relative overflow-hidden" id="excellence">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(12,56,36,0.05)_0%,transparent_70%)] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle,rgba(201,169,97,0.08)_0%,transparent_70%)] -ml-40 -mb-40 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-24 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.span
            className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6 border-b border-primary/20 pb-2"
            variants={itemVariants}
          >
            {subtitle}
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-text-primary mb-8 leading-[1.1]"
            variants={itemVariants}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-text-secondary text-base md:text-lg font-sans font-light leading-relaxed max-w-2xl mx-auto"
            variants={itemVariants}
          >
            {description}
          </motion.p>

          <motion.div
            className="w-20 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-12"
            variants={itemVariants}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="group relative bg-white p-10 md:p-12 transition-all duration-500 hover:shadow-2xl border border-primary/5 hover:-translate-y-2"
              variants={cardVariants}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Decorative Circle */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[radial-gradient(circle,rgba(201,169,97,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />

              <div className="text-6xl font-serif font-light text-primary/10 mb-8 transition-colors group-hover:text-primary/20">
                {item.number}
              </div>

              <div className="relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-text-primary mb-6 font-sans">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed font-sans font-light">
                  {item.description}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExcellenceSection;
