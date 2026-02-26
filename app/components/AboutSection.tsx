"use client";

export default function AboutSection({ className = "" }: { className?: string }) {
  return (
    <section
      id="about"
      className={`relative px-8 py-32 lg:px-16 overflow-hidden ${className}`}
    >
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid items-center gap-20 lg:grid-cols-12">
            {/* ── Visual Side — Refined Frame ── */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[750px] lg:col-span-7 order-2 lg:order-1">
              <div className="absolute inset-0 flex items-center justify-center border border-white/5 bg-charcoal/10 overflow-hidden">
                {/* Subtle Ambient Glow */}
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gold/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gold/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 text-[8px] font-bold tracking-[0.5em] uppercase text-gold/30 vertical-text hidden sm:block">
                  Purity • Innovation
                </div>

                {/* Refined Frame Corners */}
                <div className="absolute top-0 left-0 h-24 w-[1px] bg-gradient-to-b from-gold/40 to-transparent" />
                <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-gold/40 to-transparent" />
                <div className="absolute bottom-0 right-0 h-24 w-[1px] bg-gradient-to-t from-gold/40 to-transparent" />
                <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gradient-to-l from-gold/40 to-transparent" />

                {/* The global 3D diamond will be positioned here via GSAP */}
              </div>

              {/* Technical Detail Badge */}
              <div className="absolute top-1/2 -right-4 lg:-right-8 -translate-y-1/2 hidden md:block z-20">
                <div className="glass-noir p-10 border border-white/5 rotate-1">
                   <div className="flex flex-col gap-6">
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold/60">Molecular Structure</p>
                        <p className="font-serif text-2xl font-extralight text-foreground">Cubic Carbon</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold/60">Clarity Grade</p>
                        <p className="font-serif text-2xl font-extralight text-foreground">VVS1 — IF</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* ── Text Side ── */}
            <div className="lg:col-span-5 order-1 lg:order-2 relative z-10">
              <div className="max-w-xl">
                <span className="mb-8 inline-flex items-center gap-4 text-[9px] font-bold tracking-[0.4em] uppercase text-gold/80 animate-fade-in-up">
                  <span className="h-[1px] w-10 bg-gold/30" />
                  Our Philosophy
                </span>

                <h2 className="font-serif text-5xl font-extralight leading-[1.1] tracking-tight sm:text-6xl animate-fade-in-up delay-200">
                  Infinite <br />
                  <span className="font-serif-italic text-shimmer">Transparency.</span>
                </h2>

                <div className="mt-12 space-y-8 text-[13px] font-light leading-[1.8] tracking-widest text-warm-gray/90 animate-fade-in-up delay-300">
                  <p>
                    Luxury is evolving. At Di&apos;aaru, we redefine the diamond not by its depth in the earth,
                    but by the heights of human ingenuity. We cultivate brilliance in controlled environments,
                    eliminating the ecological and ethical footprint of traditional extraction.
                  </p>
                  <p>
                    Every stone we create is a masterpiece of precision engineering. Atom by atom,
                    we replicate the exact conditions of the mantle to produce diamonds that are
                    optically, physically, and chemically identical to those mined — yet superior
                    in their story.
                  </p>
                </div>

                <div className="mt-16 grid grid-cols-2 gap-12 border-t border-white/5 pt-12 animate-fade-in-up delay-400">
                  <div className="space-y-2">
                    <p className="font-serif text-4xl font-extralight text-foreground">100%</p>
                    <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-gold/60">Conflict Free</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif text-4xl font-extralight text-foreground">Carbon</p>
                    <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-gold/60">Neutral Origin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
