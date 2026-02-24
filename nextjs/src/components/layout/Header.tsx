'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
}

interface HeaderProps {
  sections?: any[];
  globalSettings?: any;
}

const Header: React.FC<HeaderProps> = ({ sections = [], globalSettings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const navigationMap: Record<string, NavItem> = {
    'shared.hero-section': { id: 'hero', label: 'Home' },
    'shared.about-section': { id: 'about', label: 'Our Story' },
    'shared.product-section': { id: 'products', label: 'Collections' },
    'shared.why-choose-us': { id: 'why-choose-us', label: 'Excellence' },
    'shared.gallery-section': { id: 'gallery', label: 'Gallery' },
    'shared.testimonial-section': { id: 'testimonials', label: 'Testimonials' },
    'shared.contact-section': { id: 'contact', label: 'Contact' },
  };

  const availableNavItems = sections
    .filter(section => section.isShow !== false && navigationMap[section.__component])
    .map(section => navigationMap[section.__component])
    .filter((item, index, self) => item && index === self.findIndex(t => t.id === item.id));

  const topBarMessage = globalSettings?.topBarMessage || "Welcome to Di'aaru Luxury Lab-Grown Diamonds";
  const topBarPhone = globalSettings?.topBarPhone || '+1 (212) 555-DIAM';
  const topBarEmail = globalSettings?.topBarEmail || 'concierge@diaaru.com';

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-primary-dark shadow-xl' : 'bg-primary'}`}>
      <div className="bg-black/10 text-white text-[10px] md:text-xs py-2 tracking-widest uppercase border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center font-sans font-medium">
          <span>{topBarMessage}</span>
          <div className="hidden md:flex space-x-6">
            {topBarPhone && (
              <a href={`tel:${topBarPhone.replace(/[^\d+]/g, '')}`} className="flex items-center hover:opacity-80 transition-opacity">
                <span className="mr-2">📞</span> {topBarPhone}
              </a>
            )}
            {topBarEmail && (
              <a href={`mailto:${topBarEmail}`} className="flex items-center hover:opacity-80 transition-opacity">
                <span className="mr-2">✉️</span> {topBarEmail}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-4 md:py-6 flex justify-between items-center">
        <Link href="/" className="logo group">
          <span className="text-2xl md:text-3xl font-serif font-bold tracking-[0.1em] text-white uppercase leading-none">
            Di'aaru
          </span>
        </Link>

        <nav className={`nav ${menuOpen ? 'fixed inset-0 bg-primary flex flex-col justify-center items-center gap-8 z-40' : 'hidden'} md:flex md:relative md:bg-transparent md:flex-row md:items-center md:gap-12 md:p-0 transition-all duration-500`}>
          {availableNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-white text-xs md:text-sm uppercase tracking-[0.15em] font-medium relative py-2 group overflow-hidden"
            >
              <span className="relative z-10 group-hover:opacity-80 transition-opacity">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
          {menuOpen && (
            <button
              onClick={() => setMenuOpen(false)}
              className="md:hidden absolute top-10 right-10 text-white text-4xl"
            >
              ×
            </button>
          )}
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 z-50 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>
    </header>
  );
};

export default Header;
