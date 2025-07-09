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

type ViewType =
  | "info"
  | "dossier"
  | "personal-data"
  | "devis"
  | "edit-devis"
  | "messages";

export default function EspacePersoPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewType>("info");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const viewParam = urlParams.get('view') as ViewType | null
    if (viewParam && ['info', 'dossier', 'personal-data', 'devis', 'edit-devis', 'messages'].includes(viewParam)) {
      setView(viewParam)
    }
  }, [])

  const handleNavigation = (targetView: ViewType) => {
    setView(targetView);
    // Optionnel: mettre à jour l'URL sans recharger la page
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
      case "messages":
        return <div>Messages (à implémenter)</div>;
      default:
        return <MeInfo onConsult={() => handleNavigation("dossier")} />;
    }
  };

  return (
    <AuthGuard>
      <EspacePersoProvider>
        <div className="flex flex-col min-h-screen">
          {/* ─────────────── HEADER ─────────────── */}
          <header className="grid grid-cols-3 items-center bg-white px-8 py-2 shadow-md z-10">
            {/* logo */}
            <div className="col-start-1">
              <Image
                src="/atlas/logo.png"
                alt="Atlas Beauty"
                width={80}
                height={40}
                priority
              />
            </div>

            {/* fleur */}
            <div className="col-start-2 flex justify-center">
              <Image
                src="/atlas/fleur.png"
                alt="Lotus"
                width={60}
                height={40}
                priority
              />
            </div>

            {/* bouton Retour */}
            <div className="col-start-3 flex justify-end">
              <Link
                href="/"
                className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
              >
                Retour au site
              </Link>
            </div>
          </header>

          {/* ─────────────── CONTENT ─────────────── */} 
          <div className="flex flex-1 bg-sky-200">
            <Sidebar onNavigate={handleNavigation} currentView={view} />
            <main className="flex-1 p-12">{renderContent()}</main>
          </div>
        </div>
      </EspacePersoProvider>
    </AuthGuard>
  );
}
