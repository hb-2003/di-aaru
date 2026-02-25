"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#about" },
  { label: "Certification", href: "#certification" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`glass fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-0 shadow-[0_4px_30px_rgba(0,0,0,0.4)]" : "py-1"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-18 items-center justify-between">
          {/* ── Logo ── */}
          <a
            href="#"
            className="font-serif text-[1.65rem] font-light tracking-[0.18em] text-foreground transition-opacity duration-300 hover:opacity-80"
          >
            Di&apos;aaru
          </a>

          {/* ── Desktop Links ── */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-[11px] font-normal tracking-[0.14em] uppercase text-warm-gray transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── CTA ── */}
          <a
            href="#collections"
            className="btn-shimmer hidden items-center border border-gold/25 px-7 py-2.5 text-[10px] font-medium tracking-[0.16em] uppercase text-gold transition-all duration-400 hover:border-gold/50 hover:bg-gold/5 md:inline-flex"
          >
            Explore Diamonds
          </a>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-[6px] py-2 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[1px] bg-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen
                  ? "w-6 translate-y-[7px] rotate-45"
                  : "w-6"
              }`}
            />
            <span
              className={`block h-[1px] bg-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen ? "w-0 opacity-0" : "w-4 ml-auto"
              }`}
            />
            <span
              className={`block h-[1px] bg-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen
                  ? "w-6 -translate-y-[7px] -rotate-45"
                  : "w-[10px] ml-auto"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-6 border-t border-gold/10 px-6 pb-10 pt-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-light tracking-[0.12em] uppercase text-warm-gray transition-all duration-300 hover:text-foreground hover:translate-x-2"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#collections"
            onClick={() => setIsOpen(false)}
            className="btn-shimmer mt-4 inline-flex items-center justify-center border border-gold/25 px-7 py-3.5 text-[10px] font-medium tracking-[0.16em] uppercase text-gold transition-all duration-300 hover:bg-gold/5"
          >
            Explore Diamonds
          </a>
        </div>
      </div>
    </nav>
  );
}
