import { BookingProvider } from "./context/BookingContext";
import BeforeAfter from "./components/BeforeAfter";
import { BookingModal, BookingSection } from "./components/BookingWizard";
import Contact from "./components/Contact";
import EyewearBoutique from "./components/EyewearBoutique";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import { BackToTop, MobileCTABar, WhatsAppButton } from "./components/Floating";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import MeetTheTeam from "./components/MeetTheTeam";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import TrustMarquee from "./components/TrustMarquee";
import VisionTest from "./components/VisionTest";
import WhyUs from "./components/WhyUs";

export default function App() {
  return (
    <BookingProvider>
      {/* Skip link for keyboard users */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:font-bold focus:text-white"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <TrustMarquee />
        <BookingSection />
        <Services />
        <MeetTheTeam />
        <WhyUs />
        <BeforeAfter />
        <HowItWorks />
        <EyewearBoutique />
        <VisionTest />
        <Testimonials />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>

      <Footer />

      {/* Floating UI */}
      <WhatsAppButton />
      <MobileCTABar />
      <BackToTop />

      {/* Global booking modal — opened from every "Book" button */}
      <BookingModal />
    </BookingProvider>
  );
}
