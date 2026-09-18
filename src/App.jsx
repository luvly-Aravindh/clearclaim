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
import ProofTicker from "./Components/ProofTicker";

const AUDIT_FORM_URL = "/audit-form";

function goToAuditForm(lead) {
  const q = new URLSearchParams();
  if (lead?.email) q.set("email", lead.email);
  if (lead?.whatsapp) {
    const digits = String(lead.whatsapp).replace(/\D/g, "");
    if (digits) q.set("phone", digits.slice(-10));
  }
  if (lead?.name) q.set("name", lead.name);
  const qs = q.toString();
  window.location.href = AUDIT_FORM_URL + (qs ? `?${qs}` : "");
}

function App() {
  // ClearClaimLanding (the opt-in gate) is the entry point on every page
  // load. The landing page is reached only by submitting the opt-in (the
  // funnel functionality), so a refresh always returns to the opt-in gate.
  const [view, setView] = useState("optin");
  const [lead, setLead] = useState(() => loadLead());

  const openAudit = () => goToAuditForm(lead);

  const handleOptinComplete = (submittedLead) => {
    setLead(submittedLead);
    setView("landing");
    window.scrollTo(0, 0);
  };

  // Opt-in Page -> Landing Page -> Audit form -> Book a Call (TidyCal)
  if (view === "landing") {
    return <ClearClaimLanding onComplete={handleOptinComplete} />;
  }

  return (
    <>
      <TopBar onOpenModal={openAudit} />

      <HeroSection onOpenModal={openAudit} />

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
        onOpenModal={openAudit}
      />

      <Checklist />

      <CtaStrip
        label="Submit My Certificate Details Now"
        bullets={["Free", "2 minutes", "No commitment"]}
        bg="bg-white"
        onOpenModal={openAudit}
      />

      <SplitSectionThree />

      <Makers />

      <CtaStrip
        label="Speak With A Recovery Specialist"
        bullets={["Free valuation", "No originals required"]}
        bg="bg-white"
        onOpenModal={openAudit}
      />

      <ThreeSteps onOpenModal={openAudit} />

      <Guarantee />

      <CtaStrip
        label="Get Your Free Valuation"
        bullets={["Zero risk", "No commitment"]}
        bg="bg-white"
        onOpenModal={openAudit}
      />

      <Testimonials />

      <FinalCTA onOpenModal={openAudit} />

      <Footer onOpenModal={openAudit} />

      <ProofTicker />
    </>
  );
}

export default App;
