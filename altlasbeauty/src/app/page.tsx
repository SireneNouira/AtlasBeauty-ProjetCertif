"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Header from "@/components/common/Header";
import Accueil from "@/components/sections/Accueil";
import Interventions from "@/components/sections/Interventions";
import Sejour from "@/components/sections/Sejour";
import Chirurgiens from "@/components/sections/Chirurgiens";
import Footer from "@/components/common/Footer";
import PresentationIntervention from "@/components/PresentationIntervention";
import Chatbot from "@/components/Chatbot";


export default function Home() {
  const accueilRef = useRef(null);
  const [isAccueilVisible, setIsAccueilVisible] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); 


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAccueilVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1, // dès que 10% du bloc est visible
      }
    );

    if (accueilRef.current) {
      observer.observe(accueilRef.current);
    }

    return () => {
      if (accueilRef.current) {
        observer.unobserve(accueilRef.current);
      }
    };
  }, []);

  // intervention
  const [showPresentation, setShowPresentation] = useState(false);
  // useEffect(() => {
  //   if (showPresentation) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }

  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [showPresentation]);

  return (
    <>
      <Header
        isTransparent={isAccueilVisible}
        onTogglePresentation={() => setShowPresentation((prev) => !prev)}
      />

      <div ref={accueilRef}>
        <div className="pt-24"> </div>
        <Accueil />
      </div>
      <Interventions />
      <Sejour />
      <Chirurgiens />
      <Footer />
      <AnimatePresence>
        {showPresentation && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="fixed top-24 left-0 w-full h-[calc(100vh-6rem)] z-50 overflow-y-auto "
            
          >
              <PresentationIntervention />
          
          </motion.div>
        )}
      </AnimatePresence>
       {/* 🟡 Bulle flottante pour ouvrir/fermer le chatbot */}
       <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="w-16 h-16 rounded-full bg-rose-500 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-rose-600 transition sm:w-10 sm:h-10 sm:text-xl"
        >
          💬
        </button>
      </div>

      {/* 🟣 Affichage du Chatbot en bas de l'écran */}
      <AnimatePresence>
        {isChatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6  bg-white rounded-xl shadow-lg  z-40"
          >
            <Chatbot />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
