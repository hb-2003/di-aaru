"use client";

import { useEffect, useRef, useState } from "react";


export default function HeroSection() {
  return (
    <section
      id="home"
      className="hero-section relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent sm:pt-0 py-20"
    >
      {/* ── Background Elements ── */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#1a1a18]" />

      {/* Radial Gold Glow - Widened and Softer */}
      <div className="hidden sm:flex absolute inset-0 z-[4] items-center justify-center pointer-events-none">
        <div className="h-[600px] w-[800px] animate-pulse-glow rounded-full bg-[#0a484f]/10 blur-[120px] opacity-30" />
        <div className="absolute h-[800px] w-[1000px] animate-pulse-glow-delayed rounded-full bg-[#0a484f]/5 blur-[160px] opacity-20" />
      </div>

      {/* Particle Overlay - Diamond Dust */}

      {/* Bottom Fade Gradient for Smooth Blending */}
      <div className="hidden sm:block pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-[35%] bg-gradient-to-t from-[#1a1a18] via-[#1a1a18]/60 to-transparent" />

      {/* ── Main UI Overlay ── */}
      <div className="hero-content pointer-events-none relative z-20 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center text-center">

          {/* Diamond Icon & Eyebrow - Centered Fix */}
          <div className="flex flex-col items-center animate-fade-in-up delay-200 mb-6">
            <span className="hero-eyebrow inline-flex items-center gap-4 text-[10px] font-medium tracking-[0.35em] uppercase text-[#e8e0d0]/60 sm:text-[11px]">
              <span className="h-[0.5px] w-8 bg-[#c9a96e]/30" />
              <span className="text-[#d4a853] italic">Lab-Grown</span> <span>Diamonds</span>
              <span className="h-[0.5px] w-8 bg-[#c9a96e]/30" />
            </span>
          </div>

          {/* Headline - Larger Impact */}
          <h1 className="hero-headline animate-fade-in-up delay-400 font-serif text-[44px] font-light leading-[1.08] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl text-[#e8e0d0]">
            The Future of{" "}
            <span className="text-shimmer font-normal italic">Luxury</span>
            <br />
            Diamonds
          </h1>

          {/* Subtext - Refined Typography */}
          <p className="hero-subtext animate-fade-in-up delay-600 mt-8 max-w-[550px] text-[14px] font-light tracking-[0.12em] text-[#e8e0d0]/60 sm:text-lg sm:tracking-[0.15em]">
            Sustainable. <span className="text-[#d4a853] font-bold">Ethical.</span> Brilliant.
          </p>

          {/* CTA - With Shimmer & Arrow Animation */}
          <div className="animate-fade-in-up delay-800 mt-14 pointer-events-auto">
            <a
              href="#collections"
              className="hero-cta group relative inline-flex items-center gap-5 border border-[#c9a96e]/10 px-12 py-5 text-[10px] font-medium tracking-[0.3em] uppercase text-[#c9a96e] transition-all duration-700 hover:border-[#c9a96e]/60 hover:text-[#e8e0d0] overflow-hidden"
            >
              {/* Button Shimmer Effect on Hover */}
              <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-[#c9a96e]/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

              Explore Collection
              <svg
                className="h-3 w-3 transition-transform duration-500 ease-out group-hover:translate-x-2"
                fill="none"
                viewBox="0 0 12 12"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M1 6h10M7 2l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className="hidden sm:flex hero-scroll-indicator animate-fade-in delay-1200 absolute bottom-12 left-1/2 z-20 flex-col items-center gap-4 -translate-x-1/2">
        <span className="text-[8px] font-light tracking-[0.6em] uppercase text-[#e8e0d0]/40">
          Scroll to explore
        </span>
        <div className="animate-scroll-bounce">
          <svg
            className="h-5 w-5 text-[#c9a96e]/60"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="0.8"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>
      </div>
    </section>
  );
}
