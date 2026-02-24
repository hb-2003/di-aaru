'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import MobileGallery from '../ui/MobileGallery';

interface GalleryImage {
  id: string | number;
  url: string;
  alternativeText?: string;
}

interface GallerySectionProps {
  data: {
    title?: string;
    images?: GalleryImage[];
  };
}

const GallerySection: React.FC<GallerySectionProps> = ({ data }) => {
  const { title, images } = data;

  const galleryItems = images?.map((image, index) => {
    const url = image.url;
    const id = image.id;
    const alt = image.alternativeText || 'Timeless Elegance';

    // Determine size based on index to create a deterministic masonry layout
    // Pattern: Big, Small, Tall, Small, Small, Wide
    const patternPos = index % 6;
    let sizeClass = '';

    if (patternPos === 0) sizeClass = 'big';
    else if (patternPos === 2) sizeClass = 'tall';
    else if (patternPos === 5) sizeClass = 'wide';

    return {
      id,
      url,
      title: alt,
      sizeClass,
    };
  }) || [];

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden" id="gallery">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6 border-b border-primary/20 pb-2">
            Our Craft
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-text-primary mb-8 leading-[1.1]">
            {title || 'Artistry in Light'}
          </h2>
        </motion.div>

        {/* Desktop Grid - Masonry style with CSS Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 auto-rows-[22rem]">
          {galleryItems.map((item, index) => (
            <GalleryItem key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Mobile View - Swiper Slider */}
        <div className="md:hidden -mx-6">
          <MobileGallery
            images={galleryItems.map((item) => ({ src: item.url, alt: item.title }))}
            showPagination
            loop
          />
        </div>
      </div>
    </section>
  );
};

const GalleryItem = ({ item, index }: { item: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Map sizeClass to Tailwind grid spans
  const getGridClasses = (size: string) => {
    switch (size) {
      case 'big':
        return 'md:col-span-2 md:row-span-2 h-[46rem]';
      case 'tall':
        return 'md:row-span-2 h-[46rem]';
      case 'wide':
        return 'md:col-span-2 h-[22rem]';
      default:
        return 'col-span-1 row-span-1 h-[22rem]';
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`relative group overflow-hidden cursor-pointer bg-secondary ${getGridClasses(
        item.sizeClass
      )}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, delay: index * 0.05, ease: [0.19, 1, 0.22, 1] },
        },
      }}
      whileHover={{ y: -8, transition: { duration: 0.4 } }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-accent/90 via-accent/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-700" />

      <Image
        src={item.url}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-[1.8s] cubic-bezier(0.19, 1, 0.22, 1) group-hover:scale-110\"
      />

      {/* Info on Hover */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out\">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-2\">
          Excellence
        </span>
        <h3 className="text-white font-serif text-2xl font-light tracking-wide\">
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
};

export default GallerySection;
