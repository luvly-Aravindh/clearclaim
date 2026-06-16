import { useState } from "react";
import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";


import ClearClaimLanding from "./Components/ClearClaimLanding";

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

import ThankYou from "./Components/ThankYouPage";



function MainPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);


  const openModal = () => {
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };


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
        bullets={[
          "Free",
          "2 minutes",
          "No commitment"
        ]}
        bg="bg-white"
        onOpenModal={openModal}
      />


      <SplitSectionThree />

      <Makers />


      <CtaStrip
        label="Speak With A Recovery Specialist"
        bullets={[
          "Free valuation",
          "No originals required"
        ]}
        bg="bg-white"
        onOpenModal={openModal}
      />


      <ThreeSteps onOpenModal={openModal} />

      <Guarantee />


      <CtaStrip
        label="Get Your Free Valuation"
        bullets={[
          "Zero risk",
          "No commitment"
        ]}
        bg="bg-white"
        onOpenModal={openModal}
      />


      <Testimonials />

      <FinalCTA onOpenModal={openModal} />

      <Footer onOpenModal={openModal} />

      <ProofTicker />


      <BookModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />

    </>
  );
}





function OptinPage() {

  const navigate = useNavigate();


  const handleOptinComplete = (leadData) => {


    // save user details
    localStorage.setItem(
      "leadData",
      JSON.stringify(leadData)
    );


    // redirect main page
    navigate("/main");

  };


  return (

    <ClearClaimLanding
      onComplete={handleOptinComplete}
    />

  );

}





function App() {


  return (

    <Routes>


      <Route
        path="/"
        element={<OptinPage />}
      />


      <Route
        path="/optin"
        element={<OptinPage />}
      />


      <Route
        path="/main"
        element={<MainPage />}
      />


      <Route
        path="/thankyou"
        element={<ThankYou />}
      />


    </Routes>

  );

}



export default App;