'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  customer_name: string;
  review: string;
  rating?: number;
  position?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
}

interface TestimonialSectionProps {
  data: {
    section_title?: string;
    testimonials?: Testimonial[];
  };
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ data }) => {
  const { section_title, testimonials } = data;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const checkScrollPoints = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowPrev(scrollLeft > 5);
      setShowNext(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    checkScrollPoints();
    const currentRef = sliderRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollPoints);
      window.addEventListener('resize', checkScrollPoints);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollPoints);
        window.removeEventListener('resize', checkScrollPoints);
      }
    };
  }, [checkScrollPoints]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const cardWidth = 400;
      const gap = 32;
      const scrollAmount = cardWidth + gap;

      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });

      setTimeout(checkScrollPoints, 500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-24 md:py-32 bg-cream overflow-hidden" id="testimonials">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6 border-b border-primary/20 pb-2">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-text-primary mb-8 leading-[1.1]">
            {section_title || 'What Our Clients Say'}
          </h2>
        </motion.div>

        <div className="relative group">
          {/* Navigation Buttons */}
          <div className="hidden md:flex justify-between absolute top-1/2 -translate-y-1/2 -left-6 -right-6 z-10 pointer-events-none">
             <button
              onClick={() => scroll('left')}
              className={`w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-text-primary transition-all pointer-events-auto ${
                !showPrev ? 'opacity-0 scale-75' : 'opacity-100 scale-100 hover:bg-primary hover:text-white'
              }`}
              disabled={!showPrev}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className={`w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-text-primary transition-all pointer-events-auto ${
                !showNext ? 'opacity-0 scale-75' : 'opacity-100 scale-100 hover:bg-primary hover:text-white'
              }`}
              disabled={!showNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <motion.div
            ref={sliderRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 px-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
          >
            {testimonials?.map((testimonial, index) => (
              <motion.div
                key={index}
                className="min-w-[320px] md:min-w-[450px] bg-white p-10 md:p-12 snap-center border border-primary/5 flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                variants={cardVariants}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8">
                  <Quote size={24} fill="currentColor" />
                </div>

                <div
                  className="text-text-primary font-serif italic text-xl md:text-2xl leading-relaxed mb-10 flex-grow"
                  dangerouslySetInnerHTML={{ __html: testimonial.review }}
                />

                <div className="flex items-center justify-between pt-8 border-t border-primary/10 mt-auto">
                  <div className="flex items-center gap-4">
                    {testimonial.image?.url && (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                        <Image
                          src={testimonial.image.url}
                          alt={testimonial.customer_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-text-primary">{testimonial.customer_name}</h4>
                      {testimonial.position && (
                        <p className="text-[10px] text-text-light uppercase tracking-wider mt-1 font-medium">{testimonial.position}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={i < (testimonial.rating || 5) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
