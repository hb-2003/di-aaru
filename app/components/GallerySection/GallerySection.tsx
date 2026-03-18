'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './GallerySection.module.css';

const GALLERY_IMAGES = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=90',
    alt: 'Luxury Diamond Ring Close-up',
    caption: 'The Solitaire Series',
    type: 'hero', // Left column
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=90',
    alt: 'Diamond Necklace Brilliance',
    caption: 'Eternal Radiance',
    type: 'stacked', // Center column
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=90',
    alt: 'Precision Cut Diamond',
    caption: 'Optical Perfection',
    type: 'stacked', // Center column
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&q=90',
    alt: 'Diamond Earrings',
    caption: 'Modern Architecture',
    type: 'large', // Right column
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=1200&q=90',
    alt: 'Minimalist Diamond Setting',
    caption: 'Subtle Distinction',
    type: 'wide', // Right column bottom
  },
];

export default function GallerySection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ''} ${className}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelLine} />
            <span className={styles.labelText}>CURATED EXHIBITION</span>
          </div>
          <h2 className={styles.heading}>
            <span className={styles.headingWhite}>Architectural</span>
            <span className={styles.headingGold}>Brilliance.</span>
          </h2>
        </div>

        <div className={styles.masonryGrid}>
          {/* Left Column - Hero */}
          <div className={`${styles.column} ${styles.leftColumn}`}>
            <div className={styles.galleryItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={GALLERY_IMAGES[0].src}
                  alt={GALLERY_IMAGES[0].alt}
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className={styles.overlay}>
                  <span className={styles.caption}>{GALLERY_IMAGES[0].caption}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Stacked */}
          <div className={`${styles.column} ${styles.centerColumn}`}>
            <div className={styles.galleryItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={GALLERY_IMAGES[1].src}
                  alt={GALLERY_IMAGES[1].alt}
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className={styles.overlay}>
                  <span className={styles.caption}>{GALLERY_IMAGES[1].caption}</span>
                </div>
              </div>
            </div>
            <div className={styles.galleryItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={GALLERY_IMAGES[2].src}
                  alt={GALLERY_IMAGES[2].alt}
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className={styles.overlay}>
                  <span className={styles.caption}>{GALLERY_IMAGES[2].caption}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Large + Wide */}
          <div className={`${styles.column} ${styles.rightColumn}`}>
            <div className={`${styles.galleryItem} ${styles.largeItem}`}>
              <div className={styles.imageWrapper}>
                <Image
                  src={GALLERY_IMAGES[3].src}
                  alt={GALLERY_IMAGES[3].alt}
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className={styles.overlay}>
                  <span className={styles.caption}>{GALLERY_IMAGES[3].caption}</span>
                </div>
              </div>
            </div>
            <div className={`${styles.galleryItem} ${styles.wideItem}`}>
              <div className={styles.imageWrapper}>
                <Image
                  src={GALLERY_IMAGES[4].src}
                  alt={GALLERY_IMAGES[4].alt}
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className={styles.overlay}>
                  <span className={styles.caption}>{GALLERY_IMAGES[4].caption}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mobileViewAll}>
          <a href="#" aria-label="View all gallery images">View All</a>
        </div>
      </div>
    </section>
  );
}
