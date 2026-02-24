'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price?: number | string;
  diamondType?: string;
  carat?: number | string;
  shape?: string;
  images?: { url: string }[];
}

interface ProductSectionProps {
  data: {
    section_title?: string;
    description?: string;
    products?: Product[];
  };
}

const ProductSection: React.FC<ProductSectionProps> = ({ data }) => {
  const { section_title, description, products = [] } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden" id="products">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6 border-b border-primary/20 pb-2">
            Our Collections
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-text-primary mb-8 leading-[1.1]">
            {section_title || 'Exquisite Diamonds'}
          </h2>
          {description && (
            <p className="text-text-secondary text-base md:text-lg font-sans font-light leading-relaxed mb-10">
              {description}
            </p>
          )}
          <button className="btn-primary mt-4">
            View Full Collection
          </button>
        </motion.div>

        <motion.div
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variants={cardVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ProductCard = ({ product, variants }: { product: Product; variants: any }) => {
  const { name, price, diamondType, carat, shape, images } = product;

  const firstImage = images && images.length > 0 ? images[0] : null;
  const bgImageUrl = firstImage
    ? (typeof firstImage === 'string' ? `/images/${firstImage}` : firstImage?.url)
    : null;

  return (
    <motion.div
      className="flex-shrink-0 w-[80vw] md:w-full snap-center group cursor-pointer bg-white border border-black/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
      variants={variants}
    >
      <div className="relative aspect-[3/4] md:h-[26rem] overflow-hidden bg-secondary">
        {bgImageUrl ? (
          <Image
            src={bgImageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-accent/20">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-8 text-center bg-white">
        <h3 className="text-xl font-serif font-medium text-text-primary mb-4 tracking-wide group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {diamondType && (
            <span className="text-[9px] uppercase tracking-[0.1em] font-bold px-3 py-1 bg-accent/5 text-accent border border-accent/10">
              {diamondType}
            </span>
          )}
          {carat && (
            <span className="text-[9px] uppercase tracking-[0.1em] font-bold px-3 py-1 bg-accent/5 text-accent border border-accent/10">
              {carat} ct
            </span>
          )}
          {shape && (
            <span className="text-[9px] uppercase tracking-[0.1em] font-bold px-3 py-1 bg-accent/5 text-accent border border-accent/10">
              {shape}
            </span>
          )}
        </div>

        {price && (
          <p className="font-sans font-semibold text-lg text-primary tracking-wide">
            ${parseFloat(price.toString()).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductSection;
