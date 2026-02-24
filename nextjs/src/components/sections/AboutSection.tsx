'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Feature {
  title: string;
  description: string;
}

interface AboutSectionProps {
  data: {
    title?: string;
    description?: string;
    image?: {
      url: string;
    };
    features?: Feature[];
  };
}

const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  const { title, description, image, features } = data;

  const bgImageUrl = typeof image === 'string'
    ? `/images/${image}`
    : image?.url || '/images/gallery/luxury_diamond_macro.png';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-24 md:py-32 bg-cream overflow-hidden" id="about">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            <motion.span
              className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-8 border-b border-primary/20 pb-2"
              variants={itemVariants}
            >
              Our Story
            </motion.span>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-text-primary mb-10 leading-[1.1]"
              variants={itemVariants}
            >
              {title || 'Crafting Timeless Elegance'}
            </motion.h2>

            <motion.div
              className="text-text-secondary text-base md:text-lg leading-[1.8] font-sans font-light mb-12 prose prose-gray max-w-xl"
              variants={itemVariants}
              dangerouslySetInnerHTML={{ __html: description || '' }}
            />

            {features && features.length > 0 && (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12" variants={containerVariants}>
                {features.map((feature, idx) => (
                  <motion.div key={idx} className="flex flex-col gap-4 group" variants={itemVariants}>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-text-primary mb-2">{feature.title}</h4>
                      <p className="text-sm text-text-light leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {bgImageUrl && (
              <div className="relative aspect-[4/5] w-full max-w-xl mx-auto p-4 bg-white shadow-2xl">
                <Image
                  src={bgImageUrl}
                  alt={title || 'About Image'}
                  fill
                  className="object-cover p-2"
                />
                {/* Decorative element */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l-2 border-b-2 border-primary/30 -z-10" />
                <div className="absolute -top-6 -right-6 w-32 h-32 border-r-2 border-t-2 border-primary/30 -z-10" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
