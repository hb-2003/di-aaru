'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './CertificationSection.module.css';

const PERFECTION_GRID = [
  { label: 'COLOR', value: 'D — F', delay: 0 },
  { label: 'CUT', value: 'Ideal', delay: 100 },
  { label: 'CLARITY', value: 'IF — VVS1', delay: 200 },
  { label: 'ORIGIN', value: 'Type IIa', delay: 300 },
];

const LASER_INSCRIPTION = 'DIA·2024·IIa·0047821';

export default function CertificationSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const gridObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGridVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) sectionObserver.observe(sectionRef.current);
    if (gridRef.current) gridObserver.observe(gridRef.current);

    return () => {
      sectionObserver.disconnect();
      gridObserver.disconnect();
    };
  }, []);

  return (
    <section id="certification" ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ''} ${className}`}>
      <div className={styles.container}>
        {/* LEFT COLUMN */}
        <aside className={styles.leftColumn}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelLine} />
            <span className={styles.labelText}>AUTHENTICATION</span>
          </div>

          <h2 className={styles.heading}>
            <span className={styles.headingWhite}>Standard of</span>
            <span className={styles.headingGold}>Verification.</span>
          </h2>

          <p className={styles.bodyText}>
            Every Di&apos;aaru diamond is accompanied by a comprehensive digital dossier, laser-inscribed
            and authenticated by the world&apos;s leading gemological authorities. We guarantee
            absolute precision in every carat.
          </p>

          <div className={styles.inscriptionWrap}>
            <span className={styles.inscriptionLabel}>LASER INSCRIPTION</span>
            <div className={styles.inscriptionBox}>
              <span className={styles.inscriptionCode}>{LASER_INSCRIPTION}</span>
              <span className={styles.inscriptionGlow} />
            </div>
            <span className={styles.inscriptionNote}>
              Unique ID inscribed on girdle, visible under 10× magnification
            </span>
          </div>

          <div className={styles.leftCta}>
            <p className={styles.ctaText}>
              Every Di&apos;aaru diamond ships with a complete digital dossier accessible via QR code.
            </p>
            <button className={styles.ctaButton}>
              Request Your Dossier →
            </button>
          </div>

          {/* PROCESS TIMELINE */}
          <div className={styles.processTimeline}>
            <div className={styles.timelineItem}>
              <span className={styles.timelineNum}>01</span>
              <div>
                <span className={styles.timelineLabel}>SELECTION</span>
                <span className={styles.timelineText}>
                  Choose your stone from our curated inventory
                </span>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.timelineNum}>02</span>
              <div>
                <span className={styles.timelineLabel}>CERTIFICATION</span>
                <span className={styles.timelineText}>
                  Full GIA or IGI grading report issued
                </span>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.timelineNum}>03</span>
              <div>
                <span className={styles.timelineLabel}>INSCRIPTION</span>
                <span className={styles.timelineText}>
                  Unique laser ID inscribed on girdle
                </span>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.timelineNum}>04</span>
              <div>
                <span className={styles.timelineLabel}>DELIVERY</span>
                <span className={styles.timelineText}>
                  Shipped with digital dossier and QR certificate
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <div className={styles.rightColumn}>
          {/* Row 1: GIA + IGI side by side */}
          <div
            className={`${styles.certCard} ${styles.certCardGIA} ${isVisible ? styles.cardVisible : ''}`}
            style={{ animationDelay: '0ms' }}
          >
            <div className={styles.stampWrap}>
              <div className={styles.stamp}>
                <svg className={styles.stampRing} viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(196,168,105,0.3)" strokeWidth="0.5" strokeDasharray="4 3" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(196,168,105,0.15)" strokeWidth="0.5" />
                </svg>
                <span className={`${styles.stampText} ${styles.stampPrimary}`}>GIA</span>
              </div>
              <span className={styles.stampBadge}>PREMIER AUTHORITY</span>
            </div>
            <div className={styles.certContent}>
              <h3 className={styles.certName}>GIA Certified</h3>
              <p className={styles.certFullName}>Gemological Institute of America</p>
              <p className={styles.certDescription}>The world&apos;s foremost authority on diamonds, ensuring every Di&apos;aaru stone meets the highest standards of the 4Cs.</p>
            </div>
            <div className={styles.certFooter}>
              <button className={styles.dossierBtn}>
                <span>DOSSIER REQUEST</span>
                <span className={styles.dossierArrow}>→</span>
              </button>
            </div>
            <div className={styles.cardGlow} />
          </div>

          <div
            className={`${styles.certCard} ${styles.certCardIGI} ${isVisible ? styles.cardVisible : ''}`}
            style={{ animationDelay: '120ms' }}
          >
            <div className={styles.stampWrap}>
              <div className={styles.stamp}>
                <svg className={styles.stampRing} viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(196,168,105,0.3)" strokeWidth="0.5" strokeDasharray="4 3" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(196,168,105,0.15)" strokeWidth="0.5" />
                </svg>
                <span className={styles.stampText}>IGI</span>
              </div>
              <span className={styles.stampBadge}>GLOBAL STANDARD</span>
            </div>
            <div className={styles.certContent}>
              <h3 className={styles.certName}>IGI Authenticated</h3>
              <p className={styles.certFullName}>International Gemological Institute</p>
              <p className={styles.certDescription}>International Gemological Institute certification provides an objective and scientific report of diamond quality.</p>
            </div>
            <div className={styles.certFooter}>
              <button className={styles.dossierBtn}>
                <span>DOSSIER REQUEST</span>
                <span className={styles.dossierArrow}>→</span>
              </button>
            </div>
            <div className={styles.cardGlow} />
          </div>

          {/* Row 2: SCS full width */}
          <div
            className={`${styles.certCard} ${styles.certCardFull} ${isVisible ? styles.cardVisible : ''}`}
            style={{ animationDelay: '240ms' }}
          >
            <div className={styles.scsLayout}>
              {/* Left side: stamp + name + description */}
              <div className={styles.scsLeft}>
                <div className={styles.stampWrap}>
                  <div className={styles.stamp}>
                    <svg className={styles.stampRing} viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(196,168,105,0.3)" strokeWidth="0.5" strokeDasharray="4 3" />
                      <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(196,168,105,0.15)" strokeWidth="0.5" />
                    </svg>
                    <span className={styles.stampText}>SCS</span>
                  </div>
                  <span className={styles.stampBadge}>CARBON NEUTRAL</span>
                </div>
                <h3 className={styles.certName}>Sustainably Grown</h3>
                <p className={styles.certFullName}>SCS Global Services</p>
                <p className={styles.certDescription}>
                  Third-party verified climate-neutral production processes, ensuring zero carbon footprint for every carat.
                </p>
              </div>

              {/* Right side: extra SCS details */}
              <div className={styles.scsRight}>
                <div className={styles.scsDetail}>
                  <span className={styles.cardLabel}>VERIFIED SINCE</span>
                  <span className={styles.cardValue}>2019</span>
                </div>
                <div className={styles.scsDetail}>
                  <span className={styles.cardLabel}>STANDARD</span>
                  <span className={styles.cardValue}>Climate Neutral</span>
                </div>
                <div className={styles.scsDetail}>
                  <span className={styles.cardLabel}>SCOPE</span>
                  <span className={styles.cardValue}>Full Production Chain</span>
                </div>
              </div>
            </div>

            {/* Footer spanning full width */}
            <div className={styles.certFooter}>
              <button className={styles.dossierBtn}>
                <span>DOSSIER REQUEST</span>
                <span className={styles.dossierArrow}>→</span>
              </button>
            </div>
            <div className={styles.cardGlow} />
          </div>

          {/* Row 3: Perfection Grid full width */}
          <div
            ref={gridRef}
            className={`${styles.perfectionGrid} ${gridVisible ? styles.gridVisible : ''}`}
          >
            <h3 className={styles.gridTitle}>The Perfection Grid</h3>
            <div className={styles.gridItems}>
              {PERFECTION_GRID.map((item) => (
                <div
                  key={item.label}
                  className={`${styles.gridItem} ${gridVisible ? styles.gridItemVisible : ''}`}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <span className={styles.gridLabel}>{item.label}</span>
                  <span className={styles.gridValue}>{item.value}</span>
                </div>
              ))}
            </div>
            <p className={styles.gridNote}>
              *Type IIa diamonds represent the purest chemical form of carbon, found in less than 2%
              of mined stones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
