"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Collections from "./components/Collections";
import AboutSection from "./components/AboutSection";
import CertificationSection from "./components/CertificationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import DiamondScene, { DiamondHandle } from "./components/DiamondScene";
import LoadingScreen from "./components/LoadingScreen";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const diamondRef = useRef<DiamondHandle>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;

    const diamondGroup = diamondRef.current?.getGroup();
    if (!diamondGroup) return;

    // Initialize GSAP Scrollytelling
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop, isTablet, isMobile } = context.conditions as {
            isDesktop: boolean;
            isTablet: boolean;
            isMobile: boolean;
          };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: mainRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2,
            },
          });

          // 1. Hero to Collections
          // Diamond moves to the right to clear the central heading and align with collection accents
          tl.to(diamondGroup.position, {
            x: isDesktop ? 1.4 : isTablet ? 1.0 : 0,
            y: isMobile ? -0.5 : -0.1,
            z: isMobile ? -1 : 0,
            duration: 1,
          }, "step1");

          tl.to(diamondGroup.scale, {
            x: isMobile ? 0.65 : 0.85,
            y: isMobile ? 0.65 : 0.85,
            z: isMobile ? 0.65 : 0.85,
            duration: 1,
          }, "step1");

          tl.to(diamondGroup.rotation, {
            y: Math.PI * 0.25,
            x: Math.PI * 0.05,
            duration: 1,
          }, "step1");

          // 2. Collections to About
          // Aligns perfectly within the frosted glass window on the left
          tl.to(diamondGroup.position, {
            x: isDesktop ? -1.15 : isTablet ? -0.8 : 0,
            y: isMobile ? 0.4 : 0.0,
            duration: 1,
          }, "step2");

          tl.to(diamondGroup.rotation, {
            x: -Math.PI * 0.05,
            y: Math.PI * 1.1, // Show a different face
            z: Math.PI * 0.05,
            duration: 1,
          }, "step2");

          tl.to(diamondGroup.scale, {
            x: isMobile ? 0.55 : 0.7,
            y: isMobile ? 0.55 : 0.7,
            z: isMobile ? 0.55 : 0.7,
            duration: 1,
          }, "step2");

          // 2.5 Middle of About (Ethical Focus)
          // The diamond shrinks slightly to emphasize the "Conflict-free/Pure" narrative
          tl.to(diamondGroup.scale, {
            x: isMobile ? 0.45 : 0.55,
            y: isMobile ? 0.45 : 0.55,
            z: isMobile ? 0.45 : 0.55,
            duration: 0.5,
          }, "step2+=0.6");

          tl.to(diamondGroup.rotation, {
            y: Math.PI * 1.8,
            duration: 0.5,
          }, "step2+=0.6");

          // 3. About to Certification
          // Returns to center stage for quality standards
          tl.to(diamondGroup.position, {
            x: isDesktop ? -1.3 : 0,
            y: isMobile ? -0.1 : -0.15,
            duration: 1,
          }, "step3");

          tl.to(diamondGroup.scale, {
            x: isMobile ? 0.75 : 0.95,
            y: isMobile ? 0.75 : 0.95,
            z: isMobile ? 0.75 : 0.95,
            duration: 1,
          }, "step3");

          tl.to(diamondGroup.rotation, {
            x: Math.PI * 0.15,
            y: Math.PI * 2.5, // Continuous spin feel
            z: 0,
            duration: 1,
          }, "step3");

          // 4. Certification to Contact
          // Positions to the left to clear the contact form on the right
          tl.to(diamondGroup.position, {
            x: isDesktop ? -1.2 : 0,
            y: isMobile ? -0.6 : 0.1,
            duration: 1,
          }, "step4");

          tl.to(diamondGroup.scale, {
            x: isMobile ? 0.8 : 1.2,
            y: isMobile ? 0.8 : 1.2,
            z: isMobile ? 0.8 : 1.2,
            duration: 1,
          }, "step4");

          tl.to(diamondGroup.rotation, {
            x: 0,
            y: Math.PI * 4, // Full circle completion
            duration: 1,
          }, "step4");
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <main ref={mainRef} className="noise-overlay relative min-h-screen">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Fixed 3D Background Layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <DiamondScene ref={diamondRef} />
      </div>

      {/* Content Layer */}
      <div className={`relative z-10 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <HeroSection />
        <Collections className="collection-section" />
        <AboutSection className="about-section" />
        <CertificationSection className="certification-section" />
        <ContactSection className="contact-section" />
        <Footer />
      </div>
    </main>
  );
}
