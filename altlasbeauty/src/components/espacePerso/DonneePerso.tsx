// components/espacePerso/DonneePerso.tsx
"use client";
import { useState } from "react";
import { useEspacePerso } from "@/contexts/EspacePersoContext";
import EditPatientForm from "./EditPatientForm";

export default function DonneePerso() {
  const { patientData, loading, error } = useEspacePerso();
const [isEditing, setIsEditing] = useState(false);


  if (loading)
    return <div className="p-4 text-center">Chargement des données...</div>;
  if (error) return <div className="p-4 text-red-500">Erreur : {error}</div>;
  if (!patientData)
    return <div className="p-4">Aucune donnée patient disponible</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600 border-b pb-2">
        Mes informations personnelles
      </h2>
 {!isEditing ? (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Modifier mes infos
          </button>

          {/* ici tu laisses tout ton affichage en lecture seule */}
          {/* ... */}
        </>
      ) : (
        <EditPatientForm patient={patientData} onCancel={() => setIsEditing(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                ? `${
                    new Date().getFullYear() - patientData.annee_naissance
                  } ans`
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
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
          <InfoItem
            label="Consommation d'alcool"
            value={patientData.alcool}
            isBoolean
          />
        </div>
        <div>
          {/* Antécédents médicaux */}
          <SectionTitle>Antécédents médicaux</SectionTitle>

          {patientData.antecedents ? (
            <p className="whitespace-pre-line">{patientData.antecedents}</p>
          ) : (
            <p className="text-gray-400">Aucun antécédent renseigné</p>
          )}
        </div>
      </div>

      {/* Devis */}
      {patientData.devis && (
        <div className="mt-6">
          <SectionTitle>Devis</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}

// Composants helpers
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-gray-700">{children}</h3>;
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
    if (value === undefined || value === null)
      return <span className="text-gray-400">Non renseigné</span>;
    if (isBoolean) return value ? "Oui" : "Non";
    return value;
  };

  return (
    <div className="flex py-2">
      <span className="w-48 font-medium text-gray-500">{label}</span>
      <span className="flex-1 text-gray-800">{formatValue()}</span>
    </div>
  );
}
