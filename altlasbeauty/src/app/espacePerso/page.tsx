// app/espacePerso/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/espacePerso/Sidebar";
import MeInfo from "@/components/espacePerso/MeInfo";
import MonDossier from "@/components/espacePerso/MonDossier";
import DonneePerso from "@/components/espacePerso/DonneePerso";
import Image from "next/image"
import Link from "next/link"
import { EspacePersoProvider } from "@/contexts/EspacePersoContext";
import Devis from "@/components/espacePerso/Devis";
import EditDevis from "@/components/espacePerso/EditDevis";
import Photos from "@/components/espacePerso/Photos";

type ViewType =
  | "info"
  | "dossier"
  | "personal-data"
  | "devis"
  | "edit-devis"
  | "photos"
  | "messages";

export default function EspacePersoPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewType>("info");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const viewParam = urlParams.get('view') as ViewType | null
    if (viewParam && ['info', 'dossier', 'personal-data', 'devis', 'edit-devis','photos', 'messages'].includes(viewParam)) {
      setView(viewParam)
    }
  }, [])

  const handleNavigation = (targetView: ViewType) => {
    setView(targetView);
    router.replace(`/espacePerso?view=${targetView}`, { scroll: false });
  };

  const renderContent = () => {
    switch (view) {
      case "info":
        return <MeInfo onConsult={() => handleNavigation("dossier")} />;
      case "dossier":
        return <MonDossier />;
      case "personal-data":
        return <DonneePerso />;
      case "devis":
        return <Devis />;
      case "edit-devis":
        return <EditDevis />;
      case "photos":
        return <Photos />;
      case "messages":
        return (
          <div className="rounded-2xl shadow-md bg-white p-8 text-center">
            Messages (à implémenter)
          </div>
        );
      default:
        return <MeInfo onConsult={() => handleNavigation("dossier")} />;
    }
  };

  return (
    <AuthGuard>
      <EspacePersoProvider>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100">
          {/* HEADER */}
          <header
            className="grid grid-cols-3 items-center bg-white/90 px-8 py-3 shadow-sm border-b border-blue-100 sticky top-0 z-20"
            aria-label="En-tête espace personnel"
          >
            {/* logo */}
            <div className="col-start-1">
              <Image
                src="/atlas/logo.png"
                alt="Atlas Beauty"
                width={80}
                height={40}
                priority
                className="rounded-xl shadow focus:outline-blue-500 focus-visible:outline-2"
                tabIndex={0}
              />
            </div>

            {/* fleur */}
            <div className="col-start-2 flex justify-center">
              <Image
                src="/atlas/fleur.png"
                alt="Symbole lotus"
                width={60}
                height={40}
                priority
                className="opacity-80"
                tabIndex={0}
              />
            </div>

            {/* bouton Retour */}
            <div className="col-start-3 flex justify-end">
              <Link
                href="/"
                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-2 rounded-xl shadow hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 transition text-lg font-semibold"
                aria-label="Retour à la page d'accueil du site"
              >
                Retour au site
              </Link>
            </div>
          </header>

          {/* CONTENT */}
          <div className="flex flex-1 bg-sky-100/60" aria-label="Contenu espace personnel">
            <Sidebar onNavigate={handleNavigation} currentView={view} />
            <main
              className="flex-1 flex flex-col items-center px-4 py-10 md:px-12 lg:px-24"
              tabIndex={0}
              aria-live="polite"
            >
              <div className="w-full max-w-3xl">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </EspacePersoProvider>
    </AuthGuard>
  );
}
