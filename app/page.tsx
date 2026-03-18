"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CollectionsSection from "./components/CollectionsSection";
import PhilosophySection from "./components/PhilosophySection";
import GallerySection from "./components/GallerySection";
import WhyChooseUs from "./components/WhyChooseUs";
import CertificationSection from "./components/CertificationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loaded = typeof window !== 'undefined' && window.sessionStorage.getItem('diaaru-loaded');
    if (!loaded) {
      setIsLoading(true);
    }
    setIsHydrated(true);
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('diaaru-loaded', 'true');
    }
    setIsLoading(false);
  };

  return (
    <main id="top" className="noise-overlay relative min-h-screen">
      {isLoading && <LoadingScreen onComplete={handleComplete} />}

      <div className={`relative z-10 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <HeroSection />
        <CollectionsSection className="collection-section" />
        <PhilosophySection className="philosophy-section" />
        <WhyChooseUs className="why-choose-us-section" />
        <GallerySection />
        <CertificationSection className="certification-section" />
        <ContactSection className="contact-section" />
        <Footer />
      </div>
    </main>
  );
}
