'use client';

import React, { useState, useEffect } from 'react';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import styles from './Navbar.module.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-montserrat',
});

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#top' },
  { label: 'Collections', href: '#collections' },
  { label: 'About', href: '#about' },
  { label: 'Certification', href: '#certification' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <header
      className={`
        ${styles.navbar}
        ${cormorant.variable}
        ${montserrat.variable}
        ${isScrolled ? styles.scrolled : styles.atTop}
      `}
    >
      <div className={styles.container}>
        {/* DESKTOP NAV LEFT */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`
                ${styles.navLink}
                ${activeLink === link.href.replace('/#', '').replace('/', 'home') ? styles.navLinkActive : ''}
              `}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* LOGO - CENTERED */}
        <a href="/" className={styles.logo}>
          Di<em className={styles.logoAccent}>&apos;</em>aaru
        </a>

        {/* RIGHT SIDE */}
        <div className={styles.navRight}>
          <a href="/#contact" className={styles.ctaButton}>
            Explore Diamonds
          </a>

          {/* MOBILE HAMBURGER */}
          <button
            className={`${styles.hamburger} ${isMobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`${styles.mobileMenu} ${isMobileOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuPanel}>
          <button
            className={styles.mobileCloseBtn}
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <span className={styles.closeIcon}>✕</span>
          </button>

          <nav className={styles.mobileNav}>
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.mobileNavLink}
                style={{ transitionDelay: `${i * 60}ms` }}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className={styles.mobileLinkNum}>0{i + 1}</span>
                {link.label}
              </a>
            ))}
            <a
              href="/#contact"
              className={styles.mobileCtaBtn}
              onClick={() => setIsMobileOpen(false)}
            >
              Explore Diamonds →
            </a>

            <div className={styles.mobileSocials}>
              {['Instagram', 'LinkedIn', 'Pinterest'].map((social) => (
                <a key={social} href="#" className={styles.mobileSocialLink}>
                  {social}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
