"use client";

const footerLinks = {
  collections: [
    { label: "Solitaire", href: "#collections" },
    { label: "Eternity", href: "#collections" },
    { label: "Halo", href: "#collections" },
    { label: "Trilogy", href: "#collections" },
  ],
  company: [
    { label: "Our Story", href: "#about" },
    { label: "Ethics", href: "#certification" },
    { label: "Craftsmanship", href: "#about" },
    { label: "Certification", href: "#certification" },
  ],
  support: [
    { label: "Shipping", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "Contact Us", href: "#contact" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-32 pb-16 px-8 lg:px-16 overflow-hidden border-t border-white/[0.03]">
      <div className="mx-auto max-w-screen-2xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-32">
          {/* ── Brand Area ── */}
          <div className="md:col-span-4">
            <a
              href="#"
              className="font-serif text-3xl font-light tracking-[0.3em] text-foreground transition-all duration-500 hover:text-gold"
            >
              DI&apos;AARU
            </a>
            <p className="mt-10 max-w-sm text-[12px] font-light leading-[1.8] tracking-widest text-warm-gray/60">
              Redefining luxury through the fusion of molecular science and master craftsmanship.
              Exquisite lab-grown diamonds for the conscious connoisseur.
            </p>
            <div className="mt-12 flex gap-10">
              {["Instagram", "Pinterest", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[9px] font-bold tracking-[0.25em] uppercase text-warm-gray/40 transition-all duration-500 hover:text-gold hover:translate-y-[-2px]"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* ── Nav Links ── */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold/60 mb-10">Collections</h4>
              <ul className="space-y-6">
                {footerLinks.collections.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[11px] font-light tracking-widest text-warm-gray/70 transition-colors duration-300 hover:text-gold">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold/60 mb-10">Experience</h4>
              <ul className="space-y-6">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[11px] font-light tracking-widest text-warm-gray/70 transition-colors duration-300 hover:text-gold">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold/60 mb-10">Client Care</h4>
              <ul className="space-y-6">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[11px] font-light tracking-widest text-warm-gray/70 transition-colors duration-300 hover:text-gold">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-medium tracking-[0.25em] text-warm-gray/30 uppercase">
            © {currentYear} Di&apos;aaru Diamonds. Engineered Brilliance.
          </p>
          <div className="flex gap-12">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a key={item} href="#" className="text-[9px] font-medium tracking-[0.25em] text-warm-gray/30 uppercase transition-colors duration-300 hover:text-warm-gray/60">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Decorative Background ── */}
      <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
    </footer>
  );
}
