"use client";

const certifications = [
  {
    name: "GIA Certified",
    description: "The world's foremost authority on diamonds, ensuring every Di'aaru stone meets the highest standards of the 4Cs.",
    logo: "GIA",
  },
  {
    name: "IGI Authenticated",
    description: "International Gemological Institute certification provides an objective and scientific report of diamond quality.",
    logo: "IGI",
  },
  {
    name: "Sustainably Grown",
    description: "Third-party verified climate-neutral production processes, ensuring zero carbon footprint for every carat.",
    logo: "SCS",
  },
];

export default function CertificationSection({ className = "" }: { className?: string }) {
  return (
    <section
      id="certification"
      className={`relative overflow-hidden px-8 py-32 lg:px-16 ${className}`}
    >
      {/* Background Detail */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full -translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-screen-2xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-20 items-start">

          {/* Header Area */}
          <div className="lg:col-span-4 sticky top-32">
            <span className="mb-8 inline-flex items-center gap-4 text-[9px] font-bold tracking-[0.4em] uppercase text-gold/80 animate-fade-in-up">
              <span className="h-[1px] w-10 bg-gold/30" />
              Authentication
            </span>
            <h2 className="font-serif text-5xl font-extralight tracking-tight sm:text-6xl animate-fade-in-up delay-200">
              Standard of <br />
              <span className="font-serif-italic text-shimmer">Verification.</span>
            </h2>
            <p className="mt-10 text-[13px] font-light leading-relaxed tracking-widest text-warm-gray/80 animate-fade-in-up delay-300">
              Every Di&apos;aaru diamond is accompanied by a comprehensive digital dossier, laser-inscribed
              and authenticated by the world&apos;s leading gemological authorities. We guarantee
              absolute precision in every carat.
            </p>

            <div className="mt-16 space-y-4 animate-fade-in-up delay-400">
               {["Ethical Traceability", "Carbon Neutrality", "Optical Perfection"].map((item) => (
                 <div key={item} className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold/50" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/80">{item}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="lg:col-span-8 grid gap-1 sm:grid-cols-2 border border-white/5">
            {certifications.map((cert, i) => (
              <div
                key={cert.name}
                className="group relative flex flex-col bg-charcoal/20 p-12 transition-all duration-700 hover:bg-charcoal/40"
              >
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-gold transition-all duration-700 group-hover:w-full" />

                <div className="mb-10 flex h-16 w-16 items-center justify-center border border-gold/15 bg-charcoal/30 font-serif text-[10px] tracking-[0.4em] text-gold transition-all duration-500 group-hover:border-gold/40 group-hover:scale-105">
                  {cert.logo}
                </div>

                <h3 className="font-serif text-2xl font-light tracking-wide group-hover:text-gold transition-colors duration-500">
                  {cert.name}
                </h3>

                <p className="mt-6 text-[12px] font-light leading-[1.8] tracking-widest text-warm-gray/70">
                  {cert.description}
                </p>

                <div className="mt-12 flex items-center gap-4 text-[9px] font-bold tracking-[0.3em] uppercase text-gold/60 transition-all duration-500 group-hover:text-gold group-hover:translate-x-2">
                  Dossier Request
                  <div className="h-[1px] w-8 bg-gold/40" />
                </div>
              </div>
            ))}

            {/* 4Cs Highlight Card */}
            <div className="group relative flex flex-col bg-charcoal/40 p-12 border-l border-white/5">
              <h3 className="font-serif text-2xl font-light tracking-wide text-gold">The Perfection Grid</h3>
              <div className="mt-10 grid grid-cols-2 gap-8">
                {[
                  { l: "Color", v: "D — F" },
                  { l: "Cut", v: "Ideal" },
                  { l: "Clarity", v: "IF — VVS1" },
                  { l: "Origin", v: "Type IIa" }
                ].map(item => (
                  <div key={item.l} className="space-y-1">
                    <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-warm-gray/60">{item.l}</p>
                    <p className="text-[12px] font-medium tracking-widest text-foreground/90">{item.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-10">
                 <p className="text-[10px] font-light italic leading-relaxed text-warm-gray/50">
                   *Type IIa diamonds represent the purest chemical form of carbon, found in less than 2% of mined stones.
                 </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
