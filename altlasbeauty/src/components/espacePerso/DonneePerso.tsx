// components/espacePerso/DonneePerso.tsx
"use client";
import { useState } from "react";
import { useEspacePerso } from "@/contexts/EspacePersoContext";
import EditPatientForm from "./EditPatientForm";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function DonneePerso() {
  const { patientData, loading, error } = useEspacePerso();
  const [isEditing, setIsEditing] = useState(false);

  if (loading)
    return (
      <div className="p-8 text-center text-sky-600 animate-pulse">
        Chargement des données...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Erreur : {error}
      </div>
    );
  if (!patientData)
    return (
      <div className="p-8 text-center text-gray-500">
        Aucune donnée patient disponible
      </div>
    );

  return (
    <section
      className="bg-white/80 max-w-4xl mx-auto rounded-3xl shadow-2xl border border-sky-100 p-8 space-y-8"
      aria-labelledby="donnees-perso-title"
      tabIndex={-1}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="donnees-perso-title"
          className="text-3xl font-extrabold text-sky-700 tracking-tight"
        >
          Mes informations personnelles
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sky-700 hover:text-sky-900 font-semibold text-sm px-4 py-2 rounded-xl border border-sky-200 shadow-sm bg-sky-50 hover:bg-sky-100 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Modifier mes informations"
          >
            Modifier mes infos
          </button>
        )}
      </div>

      {isEditing ? (
        <EditPatientForm
          patient={patientData}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonne 1 - Identité */}
            <div className="space-y-4">
              <SectionTitle>Identité</SectionTitle>
              <InfoItem label="Civilité" value={patientData.civilite} />
              <InfoItem label="Prénom" value={patientData.prenom} />
              <InfoItem label="Nom" value={patientData.nom} />
              <InfoItem
                label="Âge"
                value={
                  patientData.annee_naissance
                    ? `${new Date().getFullYear() - patientData.annee_naissance} ans`
                    : undefined
                }
              />
              <InfoItem label="Email" value={patientData.email} />
              <InfoItem label="Téléphone" value={patientData.tel} />
            </div>

            {/* Colonne 2 - Adresse */}
            <div className="space-y-4">
              <SectionTitle>Adresse</SectionTitle>
              <InfoItem label="Adresse" value={patientData.adress} />
              <InfoItem label="Code postal" value={patientData.code_postal} />
              <InfoItem label="Ville" value={patientData.ville} />
              <InfoItem label="Pays" value={patientData.pays} />
              <InfoItem label="Profession" value={patientData.profession} />
            </div>
          </div>

          {/* Santé */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="space-y-4">
              <SectionTitle>Informations médicales</SectionTitle>
              <InfoItem
                label="Taille"
                value={patientData.taille ? `${patientData.taille} cm` : undefined}
              />
              <InfoItem
                label="Poids"
                value={patientData.poids ? `${patientData.poids} kg` : undefined}
              />
              <InfoItem label="Tabagisme" value={patientData.tabac} isBoolean />
              <InfoItem label="Consommation d'alcool" value={patientData.alcool} isBoolean />
            </div>
            <div className="space-y-4">
              <SectionTitle>Antécédents médicaux</SectionTitle>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 min-h-[70px]">
                {patientData.antecedents ? (
                  <p className="whitespace-pre-line text-gray-700">
                    {patientData.antecedents}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">Aucun antécédent renseigné</p>
                )}
              </div>
            </div>
          </div>

          {/* Devis */}
          {patientData.devis && (
            <div className="mt-10">
              <SectionTitle>Devis</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Fichier" value={patientData.devis.fichier} />
                <InfoItem
                  label="Signé"
                  value={patientData.devis.is_signed}
                  isBoolean
                />
                {patientData.devis.date_operation && (
                  <InfoItem
                    label="Date d'opération"
                    value={new Date(
                      patientData.devis.date_operation
                    ).toLocaleDateString("fr-FR")}
                  />
                )}
                {patientData.devis.date_sejour && (
                  <InfoItem
                    label="Date de séjour"
                    value={new Date(
                      patientData.devis.date_sejour
                    ).toLocaleDateString("fr-FR")}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// Composants helpers, modernes et accessibles
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-bold text-sky-700 border-l-4 border-sky-300 pl-3 mb-2">
      {children}
    </h3>
  );
}

function InfoItem({
  label,
  value,
  isBoolean = false,
}: {
  label: string;
  value?: string | number | boolean | null;
  isBoolean?: boolean;
}) {
  const formatValue = () => {
    if (value === undefined || value === null || value === "") {
      return (
        <span className="inline-flex items-center gap-1 text-gray-400">
          <FaTimesCircle className="text-xl text-gray-300" aria-hidden />
          Non renseigné
        </span>
      );
    }
    if (isBoolean) {
      return value ? (
        <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
          <FaCheckCircle className="text-lg text-green-400" aria-hidden />
          Oui
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-red-700 font-semibold">
          <FaTimesCircle className="text-lg text-red-400" aria-hidden />
          Non
        </span>
      );
    }
    return <span>{value}</span>;
  };

  return (
    <div className="flex items-center gap-3 py-2" tabIndex={0} aria-label={`${label}: ${typeof value === "boolean" ? (value ? "Oui" : "Non") : value || "Non renseigné"}`}>
      <span className="w-44 md:w-48 font-medium text-gray-600 select-none">
        {label}
      </span>
      <span className="flex-1 text-gray-800">{formatValue()}</span>
    </div>
  );
}
