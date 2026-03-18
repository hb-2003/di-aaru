'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './WhyChooseUs.module.css';

const WHY_POINTS = [
  {
    id: '01',
    title: 'Certified Excellence',
    subtitle: 'GIA & IGI AUTHENTICATED',
    description:
      'Every Di\'aaru diamond carries a full GIA or IGI grading report — laser-inscribed, digitally traceable, and verified by the world\'s leading gemological authorities.',
    icon: 'certificate',
  },
  {
    id: '02',
    title: 'Conflict Free',
    subtitle: '100% ETHICAL ORIGIN',
    description:
      'Grown in controlled laboratory environments, our diamonds are completely free from the ecological and humanitarian costs of traditional mining.',
    icon: 'shield',
  },
  {
    id: '03',
    title: 'Superior Clarity',
    subtitle: 'VVS1 — IF STANDARD',
    description:
      'We source only the highest clarity grades. Each stone meets VVS1 to Internally Flawless standards — optically identical to the finest mined diamonds.',
    icon: 'diamond',
  },
  {
    id: '04',
    title: 'Carbon Neutral',
    subtitle: 'SCS VERIFIED',
    description:
      'Our production processes are third-party verified as climate neutral by SCS Global Services — zero carbon footprint for every carat we grow.',
    icon: 'leaf',
  },
  {
    id: '05',
    title: 'Concierge Service',
    subtitle: 'PRIVATE CONSULTATION',
    description:
      'From selection to setting, our specialists guide every step. Private appointments available across our global ateliers in London, Antwerp, and New York.',
    icon: 'crown',
  },
  {
    id: '06',
    title: 'Smarter Value',
    subtitle: 'MODERN LUXURY PRICING',
    description:
      'Lab-grown quality allows us to prioritise size, purity, and design precision — delivering mined-diamond beauty without the inflated premium.',
    icon: 'gem',
  },
];

const renderIcon = (type: string) => {
  const props = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#c4a869',
    strokeWidth: '0.8',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (type) {
    case 'certificate':
      return (
        <svg {...props}>
          <path d="M9 12l2 2 4-4" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M8 21l4-4 4 4" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'diamond':
      return (
        <svg {...props}>
          <path d="M6 3h12l4 6-10 13L2 9l4-6z" />
          <path d="M2 9h20" />
          <path d="M6 3l4 6m4 0l4-6" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...props}>
          <path d="M2 22c0 0 4-2 8-8s6-14 6-14 0 8-4 14-10 8z" />
          <path d="M2 22l10-10" />
        </svg>
      );
    case 'crown':
      return (
        <svg {...props}>
          <path d="M2 19h20M4 19L2 8l5 4 5-8 5 8 5-4-2 11" />
        </svg>
      );
    case 'gem':
      return (
        <svg {...props}>
          <path d="M12 2L2 9l10 13 10-13-10-7z" />
          <path d="M2 9h20" />
        </svg>
      );
    default:
      return null;
  }
};

export default function WhyChooseUs({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px',
      }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.section} ${className}`}>
      {/* Background texture */}
      <div className={styles.bgTexture} />

      <div className={styles.container}>
        {/* SECTION HEADER — centered */}
        <div className={styles.header}>
          <div className={styles.headerLabel}>
            <span className={styles.labelLine} />
            <span className={styles.labelText}>WHY CHOOSE US</span>
            <span className={styles.labelLine} />
          </div>
          <h2 className={styles.heading}>
            Built for a <em className={styles.headingItalic}>clearer standard.</em>
          </h2>
          <p className={styles.subheading}>
            Di&apos;aaru is not positioned as an alternative to luxury. It is a tighter, more
            intelligent version of it — higher clarity, clearer provenance, and a buying experience
            shaped around confidence.
          </p>
        </div>

        {/* 6 POINT GRID */}
        <div className={styles.grid}>
          {WHY_POINTS.map((point, index) => (
            <div
              key={point.id}
              className={[styles.card, isVisible ? styles.cardVisible : ''].join(' ')}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card top row: number + icon */}
              <div className={styles.cardTop}>
                <span className={styles.cardNumber}>{point.id}</span>
                <div className={styles.iconWrap}>{renderIcon(point.icon)}</div>
              </div>

              {/* Thin gold divider */}
              <div className={styles.cardDivider} />

              {/* Content */}
              <div className={styles.cardContent}>
                <span className={styles.cardSubtitle}>{point.subtitle}</span>
                <h3 className={styles.cardTitle}>{point.title}</h3>
                <p className={styles.cardDescription}>{point.description}</p>
              </div>

              {/* Hover glow */}
              <div className={styles.cardGlow} />

              {/* Corner accent */}
              <div className={styles.cornerAccent} />
            </div>
          ))}
        </div>

        {/* BOTTOM STATS BAR */}
        <div ref={statsRef} className={styles.statsBar}>
          {[
            { value: 'D—F', label: 'COLOUR RANGE' },
            { value: 'VVS1+', label: 'CLARITY FOCUS' },
            { value: '100%', label: 'CONFLICT FREE' },
            { value: 'Type IIa', label: 'DIAMOND GRADE' },
          ].map((stat, i, arr) => (
            <div key={stat.label} className={styles.statGroup}>
              <div className={styles.statItem}>
                <span
                  className={`${styles.statValue} ${statsVisible ? styles.statVisible : ''}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {stat.value}
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
              {i < arr.length - 1 && <div className={styles.statDivider} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
