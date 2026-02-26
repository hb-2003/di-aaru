const collections = [
  {
    title: "Solitaire",
    description: "Timeless single-stone brilliance for the modern connoisseur.",
    carats: "0.5 – 3.0 ct",
    cuts: "Round, Oval, Cushion",
    accent: "from-gold/20 to-transparent",
  },
  {
    title: "Eternity",
    description: "An unbroken circle of lab-grown diamonds symbolising forever.",
    carats: "1.0 – 5.0 ct total",
    cuts: "Round Brilliant",
    accent: "from-blue-400/15 to-transparent",
  },
  {
    title: "Halo",
    description: "A radiant centre stone embraced by a constellation of accents.",
    carats: "0.8 – 2.5 ct",
    cuts: "Cushion, Princess",
    accent: "from-rose-300/15 to-transparent",
  },
  {
    title: "Trilogy",
    description: "Past, present, and future captured in three perfectly matched stones.",
    carats: "1.5 – 4.0 ct total",
    cuts: "Emerald, Asscher",
    accent: "from-amber-300/15 to-transparent",
  },
];

export default function Collections({ className = "" }: { className?: string }) {
  return (
    <section
      id="collections"
      className={`relative px-6 py-24 sm:py-32 lg:px-12 ${className}`}
    >
      {/* Background Window for Diamond */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%] h-full hidden lg:flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-gold/5 bg-gold/[0.01] blur-[100px] opacity-40 translate-x-1/4" />
      </div>

      {/* Section Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center sm:mb-20">
          <span className="mb-4 inline-flex items-center gap-3 text-[10px] font-medium tracking-[0.25em] uppercase text-warm-gray">
            <span className="inline-block h-[1px] w-8 bg-gold/40" />
            Our Collections
            <span className="inline-block h-[1px] w-8 bg-gold/40" />
          </span>
          <h2 className="mt-4 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
            Crafted with{" "}
            <span className="text-shimmer font-normal italic">Purpose</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-relaxed tracking-wide text-warm-gray">
            Each collection is a study in sustainable luxury — lab-grown diamonds
            that rival the earth-mined, without the cost to the planet.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((col, i) => (
            <a
              key={col.title}
              href="#"
              className="glass-card group relative flex flex-col overflow-hidden p-7 transition-transform duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {/* Accent gradient */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${col.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              {/* Diamond icon */}
              <div className="relative mb-6">
                <svg
                  className="h-8 w-8 text-gold/60 transition-colors duration-300 group-hover:text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M2.5 9.5L12 3l9.5 6.5L12 21 2.5 9.5z" />
                  <path d="M2.5 9.5h19M12 3v18M7 9.5L12 21l5-11.5" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="relative font-serif text-xl font-light tracking-wide">
                {col.title}
              </h3>
              <p className="relative mt-3 flex-1 text-[13px] font-light leading-relaxed text-warm-gray">
                {col.description}
              </p>

              {/* Specs */}
              <div className="relative mt-6 space-y-2 border-t border-white/[0.06] pt-5">
                <div className="flex justify-between text-[11px] tracking-wide">
                  <span className="uppercase text-warm-gray/70">Carats</span>
                  <span className="text-foreground/80">{col.carats}</span>
                </div>
                <div className="flex justify-between text-[11px] tracking-wide">
                  <span className="uppercase text-warm-gray/70">Cuts</span>
                  <span className="text-foreground/80">{col.cuts}</span>
                </div>
              </div>

              {/* CTA arrow */}
              <div className="relative mt-6 flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] uppercase text-gold/70 transition-colors duration-300 group-hover:text-gold">
                Explore
                <svg
                  className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M1 6h10M7 2l4 4-4 4" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
