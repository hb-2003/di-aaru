'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import styles from './PhilosophySection.module.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-montserrat',
});

interface PhilosophySectionProps {
  className?: string;
}

const STATS = [
  { value: '100%', label: 'CONFLICT FREE' },
  { value: 'VVS1+', label: 'CLARITY STANDARD' },
  { value: 'Type IIa', label: 'DIAMOND CLASSIFICATION' },
];

export default function PhilosophySection({ className = '' }: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) sectionObserver.observe(sectionRef.current);
    if (statsRef.current) statsObserver.observe(statsRef.current);

    return () => {
      sectionObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`${styles.section} ${cormorant.variable} ${montserrat.variable} ${className}`}
    >
      <div className={styles.container}>
        {/* LEFT PANEL — IMAGE VISUAL */}
        <div className={styles.leftPanel}>
          <div className={styles.imageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=90"
              alt="Di'aaru diamond ring craftsmanship"
              fill
              priority
              className={styles.heroImage}
              sizes="(max-width: 768px) 100vw, 55vw"
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
          </div>

          <div className={styles.overlayVignette} />
          <div className={styles.overlayBottomFade} />
          <div className={styles.overlayGoldTint} />
          <div className={styles.overlayTopFade} />

          {/* Particles */}

          <span className={styles.watermark}>PURITY · INNOVATION</span>

          {/* Top-right origin card */}
          <div className={`${styles.card} ${styles.cardTopRight}`}>
            <span className={styles.cardLabel}>ORIGIN</span>
            <span className={styles.cardValue}>Lab Grown</span>
            <span className={styles.badge}>CONFLICT FREE</span>
          </div>

          {/* Bottom-left spec card */}
          <div className={`${styles.card} ${styles.cardBottomLeft}`}>
            <span className={styles.pulseDot} />
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>MOLECULAR STRUCTURE</span>
              <span className={styles.cardValue}>Cubic Carbon</span>
            </div>
            <div className={styles.cardDivider} />
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>CLARITY GRADE</span>
              <span className={styles.cardValue}>VVS1 — IF</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — CONTENT */}
        <div className={styles.rightPanel}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelLine} />
            <span className={styles.labelText}>OUR PHILOSOPHY</span>
          </div>

          <div className={styles.headingWrap}>
            <h2
              className={`${styles.headingLine1} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: '0ms' }}
            >
              Infinite
            </h2>
            <h2
              className={`${styles.headingLine2} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: '150ms' }}
            >
              Transparency.
            </h2>
          </div>

          <p
            className={`${styles.bodyText} ${isVisible ? styles.visible : ''}`}
            style={{ transitionDelay: '300ms' }}
          >
            Luxury is evolving. At Di&apos;aaru, we redefine the diamond not by
            its depth in the earth, but by the heights of human ingenuity.
            We cultivate brilliance in controlled environments, eliminating
            the ecological and ethical footprint of traditional extraction.
          </p>

          <blockquote
            className={`${styles.pullQuote} ${isVisible ? styles.visible : ''}`}
            style={{ transitionDelay: '450ms' }}
          >
            Atom by atom, we replicate the exact conditions of the mantle.
          </blockquote>

          <p
            className={`${styles.bodyText} ${isVisible ? styles.visible : ''}`}
            style={{ transitionDelay: '550ms' }}
          >
            Every stone we create is a masterpiece of precision engineering.
            We produce diamonds that are optically, physically, and chemically
            identical to those mined — yet superior in their story.
          </p>

          <button className={styles.ctaLink}>
            Discover Our Process →
          </button>
        </div>
      </div>

      {/* STATS BAR */}
      <div ref={statsRef} className={styles.statsBar}>
        {STATS.map((stat, i) => (
          <React.Fragment key={stat.label}>
            <div className={styles.statItem}>
              <span className={`${styles.statValue} ${statsVisible ? styles.countUp : ''}`}>
                {stat.value}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            {i < STATS.length - 1 && <div className={styles.statDivider} />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
