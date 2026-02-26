"use client";

export default function HeroSection() {
  return (
    <section className="hero-section relative min-h-screen overflow-hidden bg-transparent pt-20 sm:pt-0">
      {/* Three.js 3D Canvas removed - now in root layout */}

      {/* ── Dark gradient overlay for text readability ── */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,_transparent_30%,_rgba(11,11,15,0.5)_100%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-[45%] bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/70 to-transparent" />

      {/* ── UI Overlay ── */}
      <div className="hero-content pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 sm:pb-32 lg:justify-end lg:pb-36">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow */}
          <span className="hero-eyebrow animate-fade-in-up delay-300 mb-5 inline-flex items-center gap-3 text-[10px] font-medium tracking-[0.25em] uppercase text-warm-gray">
            <span className="inline-block h-[1px] w-8 bg-gold/40" />
            Lab-Grown Diamonds
            <span className="inline-block h-[1px] w-8 bg-gold/40" />
          </span>

          {/* Heading */}
          <h1 className="hero-headline animate-fade-in-up delay-500 font-serif text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Future of{" "}
            <span className="text-shimmer font-normal italic">Lab-Grown</span>
            <br />
            Diamonds
          </h1>

          {/* Subtext */}
          <p className="hero-subtext animate-fade-in-up delay-600 mt-5 text-sm font-light tracking-[0.1em] text-warm-gray sm:text-base">
            Sustainable.{" "}
            <span className="text-gold">Ethical.</span> Brilliant.
          </p>

          {/* CTA */}
          <a
            href="#collections"
            className="hero-cta btn-shimmer animate-fade-in-up delay-700 pointer-events-auto group mt-9 inline-flex items-center gap-4 bg-gold px-10 py-4 text-[11px] font-medium tracking-[0.18em] uppercase text-background transition-all duration-500 hover:bg-gold-light hover:shadow-[0_8px_40px_rgba(200,169,110,0.25)]"
          >
            Explore Collection
            <svg
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 12 12"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1 6h10M7 2l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className="hero-scroll-indicator animate-fade-in delay-1200 absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[9px] font-light tracking-[0.2em] uppercase text-warm-gray/50">
          Scroll to explore
        </span>
        <svg
          className="animate-scroll-bounce h-4 w-4 text-gold/40"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>
    </section>
  );
}
