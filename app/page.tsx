import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <main className="noise-overlay relative min-h-screen">
      <Navbar />
      <HeroSection />
    </main>
  );
}
