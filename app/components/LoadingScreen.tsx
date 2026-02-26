"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [text, setText] = useState("");
  const fullText = "DI'AARU";

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Hold for a moment after finishing the text
        gsap.to(".loading-container", {
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.inOut",
          onComplete: onComplete,
        });
      },
    });

    // Typewriter effect
    fullText.split("").forEach((char, i) => {
      tl.to({}, {
        duration: 0.15,
        onStart: () => {
          setText((prev) => prev + char);
        },
      }, i * 0.15 + 0.5); // Start after 0.5s delay
    });

    // Subtle pulse for the text - Separate from timeline so onComplete fires
    gsap.to(".loading-text", {
      opacity: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5,
    });

    return () => {
      tl.kill();
      gsap.killTweensOf(".loading-text");
    };
  }, [onComplete]);

  return (
    <div className="loading-container fixed inset-0 z-[100] flex items-center justify-center bg-[#070709]">
      <div className="relative text-center">
        {/* Animated background glow */}
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[120px] animate-pulse-glow" />

        <h1 className="loading-text font-serif text-4xl tracking-[0.5em] text-gold sm:text-6xl">
          {text}
          {/* <span className="animate-pulse ml-1 inline-block h-[1em] w-[2px] bg-gold/50 align-middle" /> */}
        </h1>

        <div className="mt-8 flex justify-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-warm-gray/40">
            Establishing Purity
          </span>
        </div>
      </div>
    </div>
  );
}
