'use client';
import { useEffect, useRef, useState } from "react";

import Header from "@/components/common/Header";
import Accueil from "@/components/sections/Accueil";
import Interventions from "@/components/sections/Interventions";

export default function Home() {
  const accueilRef = useRef(null);
  const [isAccueilVisible, setIsAccueilVisible] = useState(true);
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

  return (
    <>
      <Header isTransparent={isAccueilVisible} />
      <div ref={accueilRef}>
      <div className="pt-24"> </div>
        <Accueil />
      </div>
      <Interventions />
    </>
  );
}
