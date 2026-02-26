"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const fullText = "DI'AARU";

  useEffect(() => {
    const chars = textRef.current?.querySelectorAll(".char");
    if (!chars) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Hold for a moment before transitioning out
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.2,
          delay: 1,
          ease: "power2.inOut",
          onComplete: onComplete,
        });
      },
    });

    // Reset initial states
    gsap.set(chars, { opacity: 0, filter: "blur(12px)", scale: 1.2 });
    gsap.set(taglineRef.current, { opacity: 0, y: 10 });
    gsap.set(textRef.current, { letterSpacing: "0.2em" });

    // Cinematic character revelation
    tl.to(chars, {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Smooth letter-spacing increase
    tl.to(textRef.current, {
      letterSpacing: "0.6em",
      duration: 3,
      ease: "power1.inOut",
    }, 0);

    // Tagline fade-in
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power2.out",
    }, "-=1.5");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
    >
      <div className="relative text-center px-4">
        {/* Subtle background glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <h1
          ref={textRef}
          className="font-serif text-5xl md:text-7xl text-gold tracking-[0.2em] relative z-10 flex justify-center"
        >
          {fullText.split("").map((char, i) => (
            <span key={i} className="char inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <div
          ref={taglineRef}
          className="mt-12 overflow-hidden"
        >
          <span className="block text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-warm-gray opacity-60 font-light">
            Establishing Purity
          </span>
        </div>
      </div>
    </div>
  );
}
