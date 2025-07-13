"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utils/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import UploadDevis from "@/components/assistant/UploadDevis";

type Photo = { id: number; path: string; uploadedAt?: string };
type DemandeDevis = {
  id: number;
  note?: string;
  date_souhaite?: string;
  status: string;
  date_creation?: string;
  intervention_1?: string;
  intervention_2?: string;
};
type Devis = {
  id: number;
  fichier?: string;
  date_operation?: string;
  is_signed?: boolean;
  date_sejour?: string;
};
type Patient = {
  id: number;
  email: string;
  prenom?: string;
  nom?: string;
  civilite?: string;
  annee_naissance?: number;
  adress?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  profession?: string;
  tel?: string;
  poids?: number;
  taille?: number;
  tabac?: boolean;
  alcool?: boolean;
  antecedents?: string;
};
type Intervention = { "@id": string; id: number; name: string };
export default function DossierPatientPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [demandes, setDemandes] = useState<DemandeDevis[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_BASE_URL = "http://localhost:8000";
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const patientRes = await api.get(`/patients/${patientId}`);
        setPatient(patientRes.data);

        // Récupère les photos liées au patient
        const photoRes = await api.get("/photos", {
          params: { patient: `/api/patients/${patientId}` },
        });
        setPhotos(photoRes.data.member || photoRes.data["hydra:member"] || []);

        // Récupère les demandes de devis liées au patient
        const demandeRes = await api.get("/demande_devis", {
          params: { patient: `/api/patients/${patientId}` },
        });

        setDemandes(
          demandeRes.data.member || demandeRes.data["hydra:member"] || []
        );

        // Récupère les devis liés au patient
        const devisRes = await api.get("/devis", {
          params: { "patient.id": patientId },
        });
        setDevis(devisRes.data.member || devisRes.data["hydra:member"] || []);

        // Récupérer toutes les interventions (NOUVEAU)
        const interventionsRes = await api.get("/interventions");
        setInterventions(
          interventionsRes.data["hydra:member"] ||
            interventionsRes.data.member ||
            []
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [patientId]);
  const filteredPhotos = photos.filter(
    (photo) => photo.patient === `/api/patients/${patientId}`
  );

  const getInterventionName = (iri?: string) =>
    interventions.find((i) => i["@id"] === iri)?.name || "-";

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  if (!patient)
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Patient introuvable
      </div>
    );

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Infos principales */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-100 rounded-2xl shadow-xl p-7 flex flex-col gap-4 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18 8a6 6 0 1 0-12 0v2a6 6 0 0 0 12 0V8ZM6 8a6 6 0 1 1 12 0v2a8 8 0 1 1-16 0V8a8 8 0 0 1 4-6.93A7.96 7.96 0 0 1 12 0c4.42 0 8 3.58 8 8v2a8 8 0 1 1-16 0V8Z"
              />
            </svg>
            Dossier de {patient.prenom} {patient.nom}
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-blue-950">
          <div>
            Email : <span className="font-semibold">{patient.email}</span>
          </div>
          <div>
            Téléphone :{" "}
            <span className="font-semibold">{patient.tel || "-"}</span>
          </div>
          <div>
            Ville :{" "}
            <span className="font-semibold">{patient.ville || "-"}</span>
          </div>
          <div>
            Pays : <span className="font-semibold">{patient.pays || "-"}</span>
          </div>
          <div>
            Naissance :{" "}
            <span className="font-semibold">
              {patient.annee_naissance || "-"}
            </span>
          </div>
          <div>
            Adresse :{" "}
            <span className="font-semibold">{patient.adress || "-"}</span>
          </div>
          <div>
            Profession :{" "}
            <span className="font-semibold">{patient.profession || "-"}</span>
          </div>
          <div>
            Poids/Taille :{" "}
            <span className="font-semibold">
              {patient.poids || "-"} kg / {patient.taille || "-"} cm
            </span>
          </div>
          <div>
            Tabac :{" "}
            <span className="font-semibold">
              {patient.tabac ? "Oui" : "Non"}
            </span>
          </div>
          <div>
            Alcool :{" "}
            <span className="font-semibold">
              {patient.alcool ? "Oui" : "Non"}
            </span>
          </div>
          <div>
            Antécédents :{" "}
            <span className="font-semibold">{patient.antecedents || "-"}</span>
          </div>
        </div>
      </div>

      {/* Galerie de photos */}
      <div className="bg-white/80 rounded-2xl shadow-lg p-7 border border-blue-50">
        <h2 className="text-xl font-semibold mb-5 text-blue-800 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 4h16v16H4V4Zm3 4h10v2H7V8Zm0 4h10v2H7v-2Z"
            />
          </svg>
          Photos du patient
        </h2>
        <div className="flex flex-wrap gap-5">
          {filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="flex flex-col items-center bg-blue-50 border border-blue-100 p-3 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={`${API_BASE_URL}/uploads/${
                    photo.photoPath ?? photo.path
                  }`}
                  alt={`Photo ${photo.id}`}
                  className="w-36 h-36 object-cover rounded-xl mb-2 border border-blue-200"
                />
                <div className="text-xs text-gray-500 mb-1">
                  {photo.updatedAt &&
                    format(new Date(photo.updatedAt), "dd/MM/yyyy à HH:mm", {
                      locale: fr,
                    })}
                </div>
                <div className="text-xs text-blue-700 font-mono">
                  {photo.photoPath ?? photo.path}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-8 text-blue-300 w-full">
              <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Zm0-2V6h14v12H5Zm4-6 2.03 2.71L14 10l4 6H6l3-4Z"
                />
              </svg>
              <span>Aucune photo enregistrée.</span>
            </div>
          )}
        </div>
      </div>

      {/* Demandes de devis */}
      <div className="bg-white/80 rounded-2xl shadow-lg p-7 border border-blue-50">
        <h2 className="text-xl font-semibold mb-5 text-blue-800 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M8 17v-4h8v4h5v2H3v-2h5Zm4-10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-8 8v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1H4Z"
            />
          </svg>
          Demandes de devis
        </h2>
        {demandes.length > 0 ? (
          <div className="space-y-4">
            {demandes.map((d) => (
              <div
                key={d.id}
                className="border border-blue-100 bg-blue-50/60 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-gray-500">
                      {d.date_creation &&
                        `Créée le ${d.date_creation.slice(0, 10)}`}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
                        ${
                          d.status === "envoyé"
                            ? "bg-blue-100 text-blue-800"
                            : d.status === "accepté"
                            ? "bg-green-100 text-green-800"
                            : d.status === "refusé"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-700"
                        }
                    `}
                    >
                      {d.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">Note :</span>{" "}
                    {d.note || "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Date souhaitée :</span>{" "}
                    {d.date_souhaite?.slice(0, 10) || "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Intervention 1 :</span>{" "}
                    {getInterventionName(d.intervention_1)}
                  </div>
                  <div>
                    <span className="font-semibold">Intervention 2 :</span>{" "}
                    {getInterventionName(d.intervention_2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-blue-200">
            <svg className="w-14 h-14 mb-2" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 18H5V4h14v16ZM7 14h10v2H7v-2Z"
              />
            </svg>
            Aucune demande de devis enregistrée.
          </div>
        )}
      </div>

      {/* Liste des devis */}
      <div className="bg-white/80 rounded-2xl shadow-lg p-7 border border-blue-50">
        <h2 className="text-xl font-semibold mb-5 text-blue-800 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M17 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10ZM7 19h10V5H7v14Zm6-6h2v2h-2v-2Zm-4-2h2v2H9v-2Zm0 4h6v2H9v-2Z"
            />
          </svg>
          Devis
        </h2>
        {devis.length > 0 ? (
          <div className="space-y-4">
            {devis.map((devis) => (
              <div
                key={devis.id}
                className="border border-blue-100 bg-blue-50/60 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <div className="font-medium">
                    Fichier :{" "}
                    {devis.fichier || (
                      <span className="text-gray-400">Aucun</span>
                    )}
                  </div>
                  <div>
                    Date opération : {devis.date_operation?.slice(0, 10) || "-"}
                  </div>
                  <div>
                    Date séjour : {devis.date_sejour?.slice(0, 10) || "-"}
                  </div>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold tracking-wide shadow-sm
                    ${
                      devis.is_signed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  `}
                  >
                    {devis.is_signed ? "Signé" : "Non signé"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-blue-200">
            <svg className="w-14 h-14 mb-2" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10ZM7 19h10V5H7v14Zm6-6h2v2h-2v-2Zm-4-2h2v2H9v-2Zm0 4h6v2H9v-2Z"
              />
            </svg>
            <p>Aucun devis enregistré.</p>
            <UploadDevis
              patientId={patientId}
              demandeDevisId={
                demandes.length > 0
                  ? demandes[demandes.length - 1].id
                  : undefined
              }
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            if (patientId) {
              router.push(`/assistant/chat/${patientId}`);
            } else {
              alert("Aucun patient lié à cette demande !");
            }
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition text-lg font-bold"
          disabled={!patientId}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 14h-2v-2h2v2Zm0-4h-2V7h2v5Z"
            />
          </svg>
          Envoyer un message au patient
        </button>
      </div>
    </div>
  );
}
