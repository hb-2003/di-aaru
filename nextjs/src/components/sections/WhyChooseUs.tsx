'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  feature_title: string;
  feature_description: string;
  icon?: 'quality' | 'ethical' | 'craftsmanship' | 'warranty';
}

interface WhyChooseUsProps {
  data: {
    title?: string;
    subtitle?: string;
    features?: Feature[];
  };
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ data }) => {
  const { title, subtitle, features } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
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

  const icons = {
    quality: (
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    ),
    ethical: (
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    ),
    craftsmanship: (
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
    ),
    warranty: (
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    ),
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden" id="why-choose-us">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,rgba(12,56,36,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-24 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6 border-b border-primary/20 pb-2">
            {subtitle || 'Excellence'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-accent mb-8 leading-[1.1]">
            {title || "Why Choose Di'aaru"}
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {features?.map((feature, index) => (
            <motion.div
              key={index}
              className="relative w-full md:w-[min(350px,100%)] min-h-[25rem] p-12 bg-white flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(12,56,36,0.1)] group border border-primary/10"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
              }}
              variants={itemVariants}
            >
              {/* Inner container to preserve spacing because of clip-path */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full py-8">
                <div className="w-16 h-16 flex items-center justify-center text-accent mb-8 transition-all duration-500 group-hover:text-primary group-hover:scale-110">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill={index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)'}>
                    {icons[feature.icon as keyof typeof icons] || icons.quality}
                  </svg>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-text-primary mb-6 font-sans">
                  {feature.feature_title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-[200px] font-sans font-light">
                  {feature.feature_description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
