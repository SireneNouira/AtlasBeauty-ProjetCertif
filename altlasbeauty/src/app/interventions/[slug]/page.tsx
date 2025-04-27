'use client';
import { interventions } from '@/utils/interventions-data';
import DetailIntervention from '@/components/DetailIntervention';
import CarouselAvantApres from '@/components/CarouselAvantApres';
import SocialSidebar from '@/components/common/SocialSidebar';
import Header from '@/components/common/Header';
import { use } from 'react';
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PresentationIntervention from '@/components/PresentationIntervention';


type Params = {
  slug: string;
};

export default function InterventionPage({ params }: { params: Promise<Params> }) {
  const { slug } = use(params); // <--- ici on "unwrap" la promesse

  const intervention = interventions.find((i) => i.slug === slug);

  if (!intervention) {
    return <div className="text-center py-20 text-2xl">Intervention non trouvée</div>;
  }

    const [showPresentation, setShowPresentation] = useState(false);
  
  return (
    <section className="py-10">
        <Header onTogglePresentation={() => setShowPresentation((prev) => !prev)}/>
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
      <DetailIntervention intervention={intervention} />

        {/* Partie en bas : carrousel + sidebar */}
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-6 gap-10 mt-20">
        <div className="md:w-2/3">
          <CarouselAvantApres slug={slug} />
        </div>
        <div className="md:w-1/3">
          <SocialSidebar />
        </div>
      </div>
    </section>
  );
}
