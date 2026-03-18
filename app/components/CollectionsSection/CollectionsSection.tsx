'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CollectionsSection.module.css';
import { useInView } from '../../hooks/useInView';

const COLLECTIONS = [
  {
    id: 'solitaire',
    name: 'Solitaire',
    description: 'Timeless single-stone brilliance for the modern connoisseur.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85',
    carats: '0.5 – 3.0 ct',
    cuts: 'Round, Oval, Cushion',
    accent: 'rgba(196, 168, 105, 0.12)',
  },
  {
    id: 'eternity',
    name: 'Eternity',
    description: 'An unbroken circle of lab-grown diamonds symbolising forever.',
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&q=85',
    carats: '1.0 – 5.0 ct total',
    cuts: 'Round Brilliant',
    accent: 'rgba(96, 165, 250, 0.08)',
  },
  {
    id: 'halo',
    name: 'Halo',
    description: 'A radiant centre stone embraced by a constellation of accents.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600',
    carats: '0.8 – 2.5 ct',
    cuts: 'Cushion, Princess',
    accent: 'rgba(244, 114, 182, 0.08)',
  },
  {
    id: 'trilogy',
    name: 'Trilogy',
    description: 'Past, present, and future captured in three perfectly matched stones.',
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&q=85',
    carats: '1.5 – 4.0 ct total',
    cuts: 'Emerald, Asscher',
    accent: 'rgba(252, 211, 77, 0.08)',
  },
];

export default function CollectionsSection({ className = '' }: { className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="collections"
      className={`${styles.section} ${className}`}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* Section Header */}
        <div className="mb-16 text-center sm:mb-20">
          <span className="mb-4 inline-flex items-center gap-3 text-[10px] font-medium tracking-[0.25em] uppercase text-[#8A8580]">
            <span className="inline-block h-[0.5px] w-8 bg-[#C8A96E]/40" />
            Our Collections
            <span className="inline-block h-[0.5px] w-8 bg-[#C8A96E]/40" />
          </span>
          <h2 className="mt-4 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl text-[#F5F0EB]">
            Crafted with{' '}
            <span className="text-shimmer font-normal italic">Purpose</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-relaxed tracking-wide text-[#8A8580]">
            Each collection is a study in sustainable luxury — lab-grown diamonds
            that rival the earth-mined, without the cost to the planet.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {COLLECTIONS.map((collection, index) => (
            <a
              key={collection.id}
              href="#"
              className={styles.card}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Accent Background */}
              <div
                className={styles.accent}
                style={{ background: `radial-gradient(circle at top right, ${collection.accent}, transparent)` }}
              />

              <div className={`${styles.imageWrapper} ${imageErrors[collection.id] ? styles.showFallback : ''}`}>
                <Image
                  src={collection.image}
                  alt={`${collection.name} diamond collection`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className={styles.cardImage}
                  onError={() => handleImageError(collection.id)}
                />
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{collection.name}</h3>
                <p className={styles.cardDescription}>{collection.description}</p>

                <div className={styles.cardFooter}>
                  <div className={styles.specs}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Carats</span>
                      <span className={styles.specValue}>{collection.carats}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Cuts</span>
                      <span className={styles.specValue}>{collection.cuts}</span>
                    </div>
                  </div>

                  <div className={styles.cta}>
                    Explore
                    <svg
                      className={`${styles.ctaArrow} h-3 w-3`}
                      fill="none"
                      viewBox="0 0 12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M1 6h10M7 2l4 4-4 4" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className={styles.mobileDots}>
          {COLLECTIONS.map((_, index) => (
            <span key={index} className={styles.dot} />
          ))}
        </div>
      </div>
    </section>
  );
}
