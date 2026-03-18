"use client";

import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const steps: Array<[number, string]> = [
  [0, "Preparing your experience"],
  [20, "Calibrating clarity"],
  [45, "Verifying cut precision"],
  [70, "Authenticating origin"],
  [90, "Polishing final facets"],
  [100, "Collection ready"],
];

const particles = Array.from({ length: 18 }, (_, index) => {
  const size = ((index * 37) % 25) / 10 + 0.5;
  const left = (index * 17.5) % 100;
  const bottom = (index * 11) % 30;
  const duration = 6 + ((index * 13) % 8);
  const delay = ((index * 7) % 8) * 0.8;

  return {
    id: index,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      bottom: `${bottom}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    },
  };
});

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState(steps[0][1]);
  const [showEnter, setShowEnter] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    steps.forEach(([pct, msg], index) => {
      const delay = index === 0 ? 1200 : 1200 + index * 850;
      const timeoutId = window.setTimeout(() => {
        setProgress(pct);
        setLabel(msg);

        if (pct === 100) {
          const revealId = window.setTimeout(() => {
            setShowEnter(true);
          }, 800);
          timeoutRefs.current.push(revealId);
        }
      }, delay);

      timeoutRefs.current.push(timeoutId);
    });

    return () => {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutRefs.current = [];
    };
  }, []);

  const handleEnter = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onComplete, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#1a1a18] transition-opacity duration-700 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(201,169,110,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(201,169,110,0.8)_1px,transparent_1px)] [background-size:60px_60px] animate-grid-drift" />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-[rgba(201,169,110,0.6)] opacity-0 animate-float-up"
          style={particle.style}
        />
      ))}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="relative flex flex-col items-center gap-9">
          <div className="relative flex h-[100px] w-[100px] items-center justify-center">
            <div className="absolute inset-[-12px] rounded-full border border-[rgba(201,169,110,0.25)] animate-ring-pulse" />
            <div className="absolute inset-[-24px] rounded-full border border-[rgba(201,169,110,0.12)] animate-ring-pulse-delayed" />

            <svg
              className="h-20 w-20 animate-diamond-spin [filter:drop-shadow(0_0_12px_rgba(201,169,110,0.5))]"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="40,8 72,30 40,72 8,30"
                fill="rgba(201,169,110,0.08)"
                stroke="rgba(201,169,110,0.9)"
                strokeWidth="0.8"
              />
              <polygon
                points="40,8 72,30 40,36 8,30"
                fill="rgba(201,169,110,0.15)"
                stroke="rgba(201,169,110,0.6)"
                strokeWidth="0.5"
              />
              <line x1="8" y1="30" x2="40" y2="36" stroke="rgba(201,169,110,0.5)" strokeWidth="0.4" />
              <line x1="72" y1="30" x2="40" y2="36" stroke="rgba(201,169,110,0.5)" strokeWidth="0.4" />
              <line x1="40" y1="8" x2="40" y2="36" stroke="rgba(201,169,110,0.4)" strokeWidth="0.4" />
              <line x1="8" y1="30" x2="40" y2="72" stroke="rgba(201,169,110,0.35)" strokeWidth="0.4" />
              <line x1="72" y1="30" x2="40" y2="72" stroke="rgba(201,169,110,0.35)" strokeWidth="0.4" />
              <line x1="40" y1="36" x2="40" y2="72" stroke="rgba(201,169,110,0.45)" strokeWidth="0.4" />
              <polygon points="40,8 56,8 72,30 56,30" fill="rgba(201,169,110,0.06)" />
              <polygon points="40,8 24,8 8,30 24,30" fill="rgba(201,169,110,0.10)" />
            </svg>
          </div>

          <div className="animate-fade-up-soft">
            <span className="block font-serif text-[42px] font-light tracking-[0.18em] text-[#e8e0d0] sm:text-[48px]">
              Di<span className="text-[#c9a96e] italic">&apos;</span>aaru
            </span>
            <span className="mt-2 block text-[9px] font-light uppercase tracking-[0.38em] text-[rgba(201,169,110,0.6)] sm:text-[10px]">
              Lab-Grown Diamonds • Engineered Brilliance
            </span>
          </div>

          <div className="animate-fade-up-soft flex items-center gap-3 [animation-delay:0.2s]">
            <div className="h-px w-10 bg-[rgba(201,169,110,0.4)]" />
            <div className="h-[3px] w-[3px] rounded-full bg-[rgba(201,169,110,0.6)]" />
            <div className="h-px w-10 bg-[rgba(201,169,110,0.4)]" />
          </div>

          <div
            className={`w-[200px] transition-all duration-500 ${
              showEnter ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <div className="relative h-px overflow-hidden bg-[rgba(201,169,110,0.15)]">
              <div
                className="relative h-full bg-[rgba(201,169,110,0.8)] transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <span className="absolute right-0 top-1/2 h-[3px] w-1 -translate-y-1/2 rounded-full bg-[#c9a96e] blur-[1px]" />
              </div>
            </div>
            <div className="mt-3 text-center text-[8.5px] uppercase tracking-[0.3em] text-[rgba(201,169,110,0.45)]">
              {label}
            </div>
          </div>

          <button
            type="button"
            onClick={handleEnter}
            className={`border border-[rgba(201,169,110,0.6)] px-10 py-3 text-[9px] font-normal uppercase tracking-[0.32em] text-[#c9a96e] transition-all duration-300 hover:border-[rgba(201,169,110,0.9)] hover:bg-[rgba(201,169,110,0.1)] hover:text-[#e8e0d0] ${
              showEnter
                ? "animate-fade-up-soft opacity-100"
                : "pointer-events-none hidden opacity-0"
            }`}
          >
            Enter Collection
          </button>
        </div>
      </div>
    </div>
  );
}
