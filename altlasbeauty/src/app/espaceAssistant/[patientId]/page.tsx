"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utils/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

export default function DossierPatientPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [demandes, setDemandes] = useState<DemandeDevis[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
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
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [patientId]);
  const filteredPhotos = photos.filter(
    (photo) => photo.patient === `/api/patients/${patientId}`
  );
  if (loading) return <div>Chargement…</div>;
  if (!patient) return <div>Patient introuvable</div>;

  return (
    <div className="p-8 space-y-8">
      {/* Infos principales */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold mb-2">
          Dossier de {patient.prenom} {patient.nom}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-gray-800">
          <div>
            Email : <span className="font-medium">{patient.email}</span>
          </div>
          <div>
            Téléphone :{" "}
            <span className="font-medium">{patient.tel || "-"}</span>
          </div>
          <div>
            Ville : <span className="font-medium">{patient.ville || "-"}</span>
          </div>
          <div>
            Pays : <span className="font-medium">{patient.pays || "-"}</span>
          </div>
          <div>
            Naissance :{" "}
            <span className="font-medium">
              {patient.annee_naissance || "-"}
            </span>
          </div>
          <div>
            Adresse :{" "}
            <span className="font-medium">{patient.adress || "-"}</span>
          </div>
          <div>
            Profession :{" "}
            <span className="font-medium">{patient.profession || "-"}</span>
          </div>
          <div>
            Poids/Taille :{" "}
            <span className="font-medium">
              {patient.poids || "-"} kg / {patient.taille || "-"} cm
            </span>
          </div>
          <div>
            Tabac :{" "}
            <span className="font-medium">{patient.tabac ? "Oui" : "Non"}</span>
          </div>
          <div>
            Alcool :{" "}
            <span className="font-medium">
              {patient.alcool ? "Oui" : "Non"}
            </span>
          </div>
          <div>
            Antécédents :{" "}
            <span className="font-medium">{patient.antecedents || "-"}</span>
          </div>
        </div>
      </div>

      {/* Galerie de photos */}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-3">Photos du patient</h2>
        <div className="flex flex-wrap gap-4">
          {filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="flex flex-col items-center p-4 rounded-xl shadow bg-white"
              >
                <img
                  src={`${API_BASE_URL}/uploads/${
                    photo.photoPath ?? photo.path
                  }`}
                  alt={`Photo ${photo.id}`}
                  className="w-36 h-36 object-cover rounded-xl mb-2 border"
                />
                <div className="text-xs text-gray-500 mb-2">
                  {photo.updatedAt &&
                    format(new Date(photo.updatedAt), "dd/MM/yyyy à HH:mm", {
                      locale: fr,
                    })}
                </div>
                <div className="text-sm text-blue-700 underline font-mono">
                  {photo.photoPath ?? photo.path}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">Aucune photo enregistrée.</div>
          )}
        </div>
      </div>

      {/* Demandes de devis */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-3">Demandes de devis</h2>
        {demandes.length > 0 ? (
          <div className="space-y-4">
            {demandes.map((d) => (
              <div key={d.id} className="border rounded-lg p-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <span className="text-xs text-gray-500">
                    {d.date_creation &&
                      `Demande créée le ${d.date_creation.slice(0, 10)}`}
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
                  Note : <span className="font-medium">{d.note || "-"}</span>
                </div>
                <div>
                  Date souhaitée :{" "}
                  <span className="font-medium">
                    {d.date_souhaite?.slice(0, 10) || "-"}
                  </span>
                </div>
                <div>
                  Intervention 1 :{" "}
                  <span className="font-medium">{d.intervention_1 || "-"}</span>
                </div>
                <div>
                  Intervention 2 :{" "}
                  <span className="font-medium">{d.intervention_2 || "-"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">
            Aucune demande de devis enregistrée.
          </div>
        )}
      </div>

      {/* Liste des devis */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-3">Devis</h2>
        {devis.length > 0 ? (
          <div className="space-y-3">
            {devis.map((devis) => (
              <div
                key={devis.id}
                className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-medium">
                    Fichier : {devis.fichier || "Aucun"}
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
                    className={`px-2 py-1 rounded text-xs font-semibold
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
          <div className="text-gray-500">Aucun devis enregistré.</div>
        )}
      </div>

      <button
        onClick={() => {
                      if (patientId) {
                        router.push(`/assistant/chat/${patientId}`);
                      } else {
                        alert("Aucun patient lié à cette demande !");
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    disabled={!patientId}
                  >
        Envoyer un message au patient
      </button>
    </div>
  );
}
