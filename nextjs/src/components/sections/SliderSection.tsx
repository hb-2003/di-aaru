'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderFile {
  url: string;
  width?: number;
  height?: number;
}

interface SliderSectionProps {
  data: {
    files?: SliderFile[];
  };
}

const SliderSection: React.FC<SliderSectionProps> = ({ data }) => {
  const { files } = data;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!files || files.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % files.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [files]);

  const nextSlide = () => {
    if (!files) return;
    setCurrentIndex((prev) => (prev + 1) % files.length);
  };

  const prevSlide = () => {
    if (!files) return;
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  if (!files || files.length === 0) return null;

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={files[currentIndex].url}
            alt={`Slide ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 pointer-events-none">
        <button
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 pointer-events-auto hover:bg-white hover:text-black transition-all"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 pointer-events-auto hover:bg-white hover:text-black transition-all"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {files.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default SliderSection;
