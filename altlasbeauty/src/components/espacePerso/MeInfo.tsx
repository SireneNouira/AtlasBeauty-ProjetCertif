"use client";

import Link from "next/link";
import { useEspacePerso } from "@/contexts/EspacePersoContext";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

interface MeInfoProps {
  onConsult: () => void;
}

export default function MeInfo({ onConsult }: MeInfoProps) {
  const { patientData, loading, error } = useEspacePerso();

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="text-red-500">Erreur : {error}</p>;
  if (!patientData) return <p>Aucune donnée utilisateur disponible.</p>;

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const getCurrentStep = () => {
    if (patientData.status.devisSigned) return 5;
    if (patientData.status.hasDevis) return 4;
    if (patientData.status.demandeDevisStatus === "diagnostic_fait") return 3;
    if (patientData.status.hasPhotos) return 2;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="space-y-8">
      {/* ─── BLOC BLEU-CIEL AVEC CONTENU BLANC ─── */}
      <div className="relative bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-blue-600 text-xl font-semibold mb-4">
          Bonjour {patientData.prenom} {patientData.nom} et bienvenue dans votre
          Espace Perso.
        </h2>
        <p className="text-gray-700">
          Cet espace personnel vous permet de consulter et modifier vos
          informations, suivre l’état de votre demande médicale, télécharger
          votre devis, et discuter directement avec une assistante dédiée à
          votre accompagnement.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={onConsult}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ▶ Consulter ma demande
          </button>

          <Link href="/espace-perso/modifier-infos">
            <button className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              ✎ Modifier mes informations
            </button>
          </Link>

          <Link href="/chat">
            <button className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition">
              💬 Contacter une assistante
            </button>
          </Link>

          <p className="mt-6 text-sm text-gray-400 italic">
            "Notre équipe est à vos côtés à chaque étape de votre parcours."
          </p>
        </div>
      </div>

      {/* ─── FOOTER / ADRESSE ET RÉSEAUX ─── */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center text-gray-300 text-sm">
        <div className="space-y-1">
          <p>Adresse : 14, rue Imam Abou Hanifa – 2070 La Marsa – Tunisie</p>
          <p>Tél. : 00 216 00 000 000 / 00 216 00 000 000</p>
        </div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <Link href="https://wa.me/21600000000">
            <FaWhatsapp className="w-5 h-5 hover:text-gray-500 transition" />
          </Link>
          <Link href="https://instagram.com/atlas.beauty">
            <FaInstagram className="w-5 h-5 hover:text-gray-500 transition" />
          </Link>
          <Link href="https://facebook.com/atlasbeauty">
            <FaFacebookF className="w-5 h-5 hover:text-gray-500 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
