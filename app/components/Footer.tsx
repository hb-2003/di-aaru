'use client';

import React, { useState } from 'react';

const footerLinks = {
  collections: [
    { label: 'The Solitaire', href: '/#collections' },
    { label: 'Eternity Bands', href: '/#collections' },
    { label: 'Trilogy Series', href: '/#collections' },
    { label: 'Bespoke Creations', href: '/#contact' },
  ],
  experience: [
    { label: 'Our Heritage', href: '/#about' },
    { label: 'Molecular Science', href: '/#about' },
    { label: 'Provenance', href: '/#certification' },
    { label: 'Certification', href: '/#certification' },
  ],
  care: [
    { label: 'Diamond Care', href: '#' },
    { label: 'Private Concierge', href: '/#contact' },
    { label: 'Shipping & Delivery', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<'collections'|'experience'|'care'|null>(null);

  type FooterSectionKey = 'collections' | 'experience' | 'care';
  const sections: Array<{ key: FooterSectionKey; label: string; links: { label: string; href: string }[] }> = [
    { key: 'collections', label: 'Collections', links: footerLinks.collections },
    { key: 'experience', label: 'Experience', links: footerLinks.experience },
    { key: 'care', label: 'Client Care', links: footerLinks.care },
  ];

  return (
    <footer className="bg-[#1a1a18] pt-24 pb-12 px-8 lg:px-20 border-t border-white/[0.05] overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-12">

          {/* Column 1: Brand */}
          <div className="lg:col-span-4">
            <a href="/" className="font-serif text-2xl tracking-[0.4em] text-[#e8e0d0] uppercase">
              Di<span className="italic text-[#c9a96e]">&apos;</span>aaru
            </a>
            <p className="mt-8 text-[12px] font-light leading-relaxed tracking-widest text-[#e8e0d0]/50 max-w-xs">
              Redefining luxury through the fusion of molecular science and master craftsmanship.
              Exquisite lab-grown diamonds for the conscious connoisseur.
            </p>
            <div className="mt-10 flex gap-8">
              {['Instagram', 'LinkedIn', 'Pinterest'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="lg:hidden col-span-1">
            <div className="space-y-3">
              {sections.map((section) => (
                <div key={section.key}>
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === section.key ? null : section.key)}
                    className="w-full flex justify-between items-center p-3 bg-[#1d1d1b] text-left border border-white/[0.05] rounded-lg"
                    aria-expanded={openSection === section.key}
                  >
                    <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#c9a96e]">{section.label}</span>
                    <span className="text-[#e8e0d0]">{openSection === section.key ? '−' : '+'}</span>
                  </button>
                  {openSection === section.key && (
                    <ul className="mt-2 space-y-2 pl-3">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <a href={link.href} className="text-[12px] font-light tracking-wider text-[#e8e0d0]/60 hover:text-[#e8e0d0] transition-colors">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2 lg:col-start-6">
            <h4 className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#c9a96e] mb-8">Collections</h4>
            <ul className="space-y-4">
              {footerLinks.collections.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[12px] font-light tracking-wider text-[#e8e0d0]/60 hover:text-[#e8e0d0] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Experience */}
          <div className="hidden lg:block lg:col-span-2">
            <h4 className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#c9a96e] mb-8">Experience</h4>
            <ul className="space-y-4">
              {footerLinks.experience.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[12px] font-light tracking-wider text-[#e8e0d0]/60 hover:text-[#e8e0d0] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Client Care */}
          <div className="hidden lg:block lg:col-span-3">
            <h4 className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#c9a96e] mb-8">Client Care</h4>
            <ul className="space-y-4">
              {footerLinks.care.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[12px] font-light tracking-wider text-[#e8e0d0]/60 hover:text-[#e8e0d0] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Anchor Diamond Icon & Concierge - Tightened Gap */}
        <div className="flex flex-col items-center mb-10 pt-4">
          <span className="text-[#c9a96e] opacity-30 text-lg mb-6">♦</span>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.3em] text-[#e8e0d0]/40 uppercase">Global Concierge</span>
            <a href="mailto:concierge@diaaru.com" className="text-[13px] font-serif tracking-[0.05em] text-[#c9a96e] hover:text-[#e8e0d0] transition-colors">
              concierge@diaaru.com
            </a>
          </div>
        </div>

        {/* Bottom Bar - Reduced pt */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-[0.2em] text-[#e8e0d0]/30 uppercase">
            © {currentYear} Di&apos;aaru Diamonds. All rights reserved.
          </p>
          <div className="flex gap-10">
            {['Terms', 'Privacy', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-[10px] tracking-[0.2em] text-[#e8e0d0]/30 uppercase hover:text-[#e8e0d0]/60 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
