// app/espacePerso/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import MeInfo from "@/components/espacePerso/MeInfo";
import Sidebar from "@/components/espacePerso/Sidebar";
import MonDossier from '@/components/espacePerso/MonDossier'
import { useState } from 'react'

export default function EspacePersoPage() {
  const [view, setView] = useState<'info' | 'dossier'>('info')

  return (
    <AuthGuard>
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

        {/* ─────────────── PAGE BODY ─────────────── */}
        <div className="flex flex-1 bg-sky-200 ">
          {/* sidebar à gauche */}
          <Sidebar />

          {/* contenu principal */}
          <main className="flex-1 p-12 ">
          {view === 'info' ? (
              // Passe un callback à MeInfo pour changer la vue
              <MeInfo onConsult={() => setView('dossier')} />
            ) : (
              // Affiche MonDossier quand view==='dossier'
              <MonDossier />
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
