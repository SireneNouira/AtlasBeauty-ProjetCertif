"use client";

import Link from "next/link";
import { useEspacePerso } from "@/contexts/EspacePersoContext";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaUserMd,
  FaFileMedical,
  FaCheckCircle,
  FaRegImages,
} from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { MdEventNote } from "react-icons/md";
import { motion } from "framer-motion";

interface MeInfoProps {
  onConsult: () => void;
}

const steps = [
  {
    label: "Compte créé",
    icon: <FaUserMd className="w-8 h-8 text-blue-700" aria-hidden="true" />,
  },
  {
    label: "Photos ",
    icon: <FaRegImages className="w-8 h-8 text-sky-700" aria-hidden="true" />,
  },
  {
    label: "Diagnostic ",
    icon: <MdEventNote className="w-8 h-8 text-cyan-700" aria-hidden="true" />,
  },
  {
    label: "Devis généré",
    icon: <FaFileMedical className="w-8 h-8 text-teal-800" aria-hidden="true" />,
  },
  {
    label: "Devis signé",
    icon: <FaCheckCircle className="w-8 h-8 text-emerald-700" aria-hidden="true" />,
  },
];

export default function MeInfo({ onConsult }: MeInfoProps) {
  const { patientData, loading, error } = useEspacePerso();

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="text-red-600 font-semibold">Erreur : {error}</p>;
  if (!patientData) return <p>Aucune donnée utilisateur disponible.</p>;

  // Calcul étape actuelle
  const getCurrentStep = () => {
    if (patientData.status.devisSigned) return 5;
    if (patientData.status.hasDevis) return 4;
    if (patientData.status.demandeDevisStatus === "diagnostic_fait") return 3;
    if (patientData.status.hasPhotos) return 2;
    return 1;
  };
  const currentStep = getCurrentStep();

  const initials =
    (patientData.prenom?.[0] ?? "") + (patientData.nom?.[0] ?? "");

  return (
    <div className="space-y-8">
      {/* ── CARD PRINCIPALE ── */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-sky-100"
        aria-label="Espace personnel patient"
      >
        {/* Avatar & Date */}
        <div className="flex items-center gap-4 mb-2">
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-200 via-white to-sky-400 flex items-center justify-center text-2xl font-bold shadow-inner border-2 border-sky-300 text-blue-800"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div>
            <div className="text-xs text-gray-500">Bienvenue </div>
            <div className="text-lg font-bold text-blue-900">
              {patientData.prenom} {patientData.nom}
            </div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Message d’intro */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          Votre espace vous permet de suivre chaque étape de votre parcours médical en toute confidentialité : infos, devis, photos et assistance dédiée.
        </p>

        {/* Timeline d’étapes */}
        <nav
          className="flex items-center gap-2 mb-6 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-sky-100"
          aria-label="Progression du parcours patient"
        >
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center min-w-[85px]">
              <div
                className={`rounded-full p-3 border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
                  ${i + 1 <= currentStep
                    ? "bg-sky-50 border-sky-400"
                    : "bg-gray-100 border-gray-200"}
                `}
                tabIndex={0}
                aria-current={i + 1 === currentStep ? "step" : undefined}
                aria-label={
                  i + 1 === currentStep
                    ? `${step.label} (étape en cours)`
                    : step.label
                }
              >
                {step.icon}
              </div>
              <div
                className={`text-xs mt-2 text-center max-w-[72px]
                  ${i + 1 === currentStep
                    ? "font-semibold text-blue-800"
                    : i + 1 < currentStep
                    ? "text-emerald-700"
                    : "text-gray-400"}
                `}
              >
                {step.label}
              </div>
            </div>
          ))}
        </nav>

        {/* Actions principales */}
        <div className="flex flex-wrap gap-4 items-center mt-2">
          <button
            onClick={onConsult}
            className="bg-gradient-to-r from-blue-700 to-sky-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            aria-label="Voir ma demande médicale"
            tabIndex={0}
          >
           Voir ma demande
          </button>
          <Link href="/patient/chat" legacyBehavior>
            <a
              className="flex items-center gap-2 bg-white border-2 border-blue-300 text-blue-700 px-5 py-2.5 rounded-xl font-semibold shadow hover:bg-blue-50 hover:scale-105 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              aria-label="Discuter avec une assistante"
              tabIndex={0}
            >
              <HiOutlineChatAlt2 className="w-5 h-5" aria-hidden="true" />
              Discuter avec une assistante
            </a>
          </Link>
        </div>
        <div className="mt-6 text-center text-gray-500 italic text-sm">
          "Notre équipe vous accompagne à chaque étape, avant, pendant et après votre séjour médical."
        </div>
      </motion.div>

      {/* ── FOOTER MODERNE ET ACCESSIBLE ── */}
      <footer className="bg-gradient-to-br from-sky-100 via-white to-blue-50 rounded-2xl shadow p-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm border border-blue-50">
        <div className="space-y-1 text-gray-600 text-center sm:text-left">
          <p>
            <span className="font-semibold text-blue-900">Adresse :</span>{" "}
            14, rue Imam Abou Hanifa, 2070 La Marsa, Tunisie
          </p>
          <p>
            <span className="font-semibold text-blue-900">Tél. :</span>{" "}
            00 216 00 000 000 / 00 216 00 000 000
          </p>
        </div>
        <div className="flex space-x-5 mt-2 sm:mt-0">
          <Link href="https://wa.me/21600000000" aria-label="Whatsapp" target="_blank">
            <FaWhatsapp className="w-6 h-6 hover:text-green-600 transition" />
          </Link>
          <Link href="https://instagram.com/atlas.beauty" aria-label="Instagram" target="_blank">
            <FaInstagram className="w-6 h-6 hover:text-pink-600 transition" />
          </Link>
          <Link href="https://facebook.com/atlasbeauty" aria-label="Facebook" target="_blank">
            <FaFacebookF className="w-6 h-6 hover:text-blue-900 transition" />
          </Link>
        </div>
      </footer>
    </div>
  );
}

