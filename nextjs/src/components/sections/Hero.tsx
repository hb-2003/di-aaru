'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  data: {
    heading?: string;
    sub_heading?: string;
    description?: string;
    background_image?: {
      url: string;
    };
    button_text?: string;
    button_link?: string;
  };
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const { heading, sub_heading, description, background_image, button_text, button_link } = data;

  const bgImageUrl = typeof background_image === 'string'
    ? `/images/${background_image}`
    : background_image?.url || '/images/hero-fallback.png';

  return (
    <section className="relative h-screen w-full overflow-hidden bg-accent flex items-center justify-center" id="hero">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,56,36,0.85)_0%,rgba(12,56,36,0.45)_50%,rgba(12,56,36,0.85)_100%)] z-10" />
        {bgImageUrl && (
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <Image
              src={bgImageUrl}
              alt={heading || 'Hero Background'}
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {sub_heading && (
            <motion.p
              className="text-primary uppercase tracking-[0.25em] text-xs md:text-sm font-medium mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {sub_heading}
            </motion.p>
          )}

          <motion.h1
            className="text-white font-serif text-[clamp(2.5rem,8vw,5.5rem)] font-light leading-[1.1] mb-8 tracking-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {heading || "Timeless Brilliance"}
          </motion.h1>

          {description && (
            <motion.div
              className="text-white/90 text-base md:text-xl max-w-2xl mx-auto mb-12 font-sans font-light leading-relaxed prose prose-invert"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {button_text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <a
                href={button_link || '#products'}
                className="btn-primary"
              >
                {button_text}
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Scroll to discover</p>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full relative">
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-primary rounded-full"
            animate={{
              top: [8, 24, 8],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
