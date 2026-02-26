"use client";

import { useState } from "react";

export default function ContactSection({ className = "" }: { className?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you. A Di'aaru specialist will reach out within 24 hours.");
    setFormData({ name: "", email: "" , subject: "", message: "" });
  };

  return (
    <section id="contact" className={`relative px-8 py-32 lg:px-16 overflow-hidden ${className}`}>
      {/* Background Detail */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="mx-auto max-w-screen-2xl relative z-10">
        <div className="grid gap-24 lg:grid-cols-12 lg:items-center">

          {/* ── Info Side ── */}
          <div className="lg:col-span-5">
            <span className="mb-8 inline-flex items-center gap-4 text-[9px] font-bold tracking-[0.4em] uppercase text-gold/80 animate-fade-in-up">
              <span className="h-[1px] w-10 bg-gold/30" />
              Concierge
            </span>
            <h2 className="font-serif text-5xl font-extralight leading-[1.1] tracking-tight sm:text-6xl animate-fade-in-up delay-200">
              Personalized <br />
              <span className="font-serif-italic text-shimmer">Consultation.</span>
            </h2>
            <p className="mt-10 text-[13px] font-light leading-relaxed tracking-widest text-warm-gray/90 animate-fade-in-up delay-300">
              Our specialists are available for private appointments across our global ateliers.
              Whether you seek a bespoke masterpiece or a guided tour of our collections,
              we are here to assist.
            </p>

            <div className="mt-20 space-y-12 animate-fade-in-up delay-400">
              <div className="group flex items-start gap-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/5 bg-charcoal/20 transition-all duration-500 group-hover:border-gold/30">
                   <span className="text-[10px] font-bold tracking-widest text-gold/60">HQ</span>
                </div>
                <div>
                  <h4 className="text-[9px] font-bold tracking-[0.25em] uppercase text-foreground">Global Atelier</h4>
                  <p className="mt-4 text-[12px] font-light leading-loose tracking-widest text-warm-gray/70">
                    London • Antwerp • New York <br />
                    By appointment only.
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/5 bg-charcoal/20 transition-all duration-500 group-hover:border-gold/30">
                   <span className="text-[10px] font-bold tracking-widest text-gold/60">EM</span>
                </div>
                <div>
                  <h4 className="text-[9px] font-bold tracking-[0.25em] uppercase text-foreground">Digital Inquiry</h4>
                  <p className="mt-4 text-[12px] font-light tracking-widest text-warm-gray/70">concierge@diaaru.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Form Side ── */}
          <div className="lg:col-span-7">
            <div className="glass-noir p-10 sm:p-16 border border-white/5 relative overflow-hidden">
              {/* Subtle line decoration */}
              <div className="absolute top-0 right-10 h-full w-[1px] bg-white/[0.02]" />

              <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                <div className="grid gap-12 sm:grid-cols-2">
                  <div className="space-y-4">
                    <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold/60">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-b border-white/10 bg-transparent py-4 text-[12px] font-light tracking-widest text-foreground outline-none transition-all focus:border-gold/50"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold/60">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border-b border-white/10 bg-transparent py-4 text-[12px] font-light tracking-widest text-foreground outline-none transition-all focus:border-gold/50"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold/60">Area of Interest</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border-b border-white/10 bg-transparent py-4 text-[12px] font-light tracking-widest text-foreground/70 outline-none transition-all focus:border-gold/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-charcoal">Select interest</option>
                    <option value="bespoke" className="bg-charcoal">Bespoke Creation</option>
                    <option value="collection" className="bg-charcoal">Collection Inquiry</option>
                    <option value="press" className="bg-charcoal">Press & Media</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold/60">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border-b border-white/10 bg-transparent py-4 text-[12px] font-light tracking-widest text-foreground outline-none transition-all focus:border-gold/50 resize-none"
                    placeholder="Tell us about your requirements"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden border border-gold/40 bg-transparent py-6 text-[10px] font-bold tracking-[0.4em] uppercase text-gold transition-all duration-700 hover:border-gold"
                >
                  <span className="relative z-10 transition-transform duration-500 group-hover:scale-110 inline-block">Submit Inquiry</span>
                  <div className="absolute inset-0 z-0 translate-y-full bg-gold/5 transition-transform duration-500 group-hover:translate-y-0" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
