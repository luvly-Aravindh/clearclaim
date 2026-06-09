import { useState } from "react";
import "./App.css";

import ClearClaimLanding from "./Components/ClearClaimLanding";
import { loadLead } from "./Components/ccLead";
import TopBar from "./Components/TopBar";
import HeroSection from "./Components/HeroSection";
import ProofBar from "./Components/ProofBar";
import Features from "./Components/Features";
import SplitSectionOne from "./Components/SplitSectionOne";
import SplitSectionTwo from "./Components/SplitSectionTwo";
import CtaStrip from "./Components/CtaStrip";
import Checklist from "./Components/Checklist";
import SplitSectionThree from "./Components/SplitSectionThree";
import Makers from "./Components/Makers";
import ThreeSteps from "./Components/ThreeSteps";
import Guarantee from "./Components/Guarantee";
import Testimonials from "./Components/Testimonials";
import FinalCTA from "./Components/FinalCTA";
import Footer from "./Components/Footer";
import BookModal from "./Components/BookModal";
import ProofTicker from "./Components/ProofTicker";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ClearClaimLanding (the opt-in gate) is the entry point on every page
  // load. The landing page is reached only by submitting the opt-in (the
  // funnel functionality), so a refresh always returns to the opt-in gate.
  const [view, setView] = useState("optin");
  const [lead, setLead] = useState(() => loadLead());

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOptinComplete = (submittedLead) => {
    setLead(submittedLead);
    setView("landing");
    window.scrollTo(0, 0);
  };

  // Opt-in Page -> Landing Page -> Book a Call (TidyCal)
  if (view === "optin") {
    return <ClearClaimLanding onComplete={handleOptinComplete} />;
  }

  return (
    <>
      <TopBar onOpenModal={openModal} />

      <HeroSection onOpenModal={openModal} />

      <ProofBar />

      <Features />

      <SplitSectionOne />

      <SplitSectionTwo />

      <CtaStrip
        label="Get My Free Share Valuation"
        bullets={[
          "Most families finish submission in under 2 minutes",
        ]}
        bg="bg-white"
        onOpenModal={openModal}
      />

      <Checklist />

      <CtaStrip
        label="Submit My Certificate Details Now"
        bullets={["Free", "2 minutes", "No commitment"]}
        bg="bg-white"
        onOpenModal={openModal}
      />

      <SplitSectionThree />

      <Makers />

      <CtaStrip
        label="Speak With A Recovery Specialist"
        bullets={["Free valuation", "No originals required"]}
        bg="bg-white"
        onOpenModal={openModal}
      />

      <ThreeSteps onOpenModal={openModal} />

      <Guarantee />

      <CtaStrip
        label="Get Your Free Valuation"
        bullets={["Zero risk", "No commitment"]}
        bg="bg-white"
        onOpenModal={openModal}
      />

      <Testimonials />

      <FinalCTA onOpenModal={openModal} />

      <Footer onOpenModal={openModal} />

      <ProofTicker />

      <BookModal isOpen={isModalOpen} onClose={closeModal} prefill={lead} />
    </>
  );
}

export default App;
