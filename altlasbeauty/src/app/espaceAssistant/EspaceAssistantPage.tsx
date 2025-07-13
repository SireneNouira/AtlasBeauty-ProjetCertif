"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { section } from "framer-motion/client";

type Intervention = {
  "@id": string;
  name: string;
};
type DemandeDevis = {
  "@id": string;
  note?: string;
  date_souhaite?: string;
  intervention_1?: string;
  intervention_2?: string;
  patient?: string;
  status?: string;
};

export default function EspaceAssistantPage() {
  const [demandes, setDemandes] = useState<DemandeDevis[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [demRes, intRes] = await Promise.all([
          api.get("/demande_devis"),
          api.get("/interventions"),
        ]);
        setDemandes(demRes.data.member);
        setInterventions(intRes.data["hydra:member"] || intRes.data.member);
      } catch (err: any) {
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getInterventionName = (iri?: string) =>
    interventions.find((i) => i["@id"] === iri)?.name || "-";

  if (loading)
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-12">{error}</div>;

  return (
    <section className="flex flex-col md:flex-row gap-8 justify-between mx-auto p-6">
      {/* Tableau demandes */}
      <div className="flex-1 bg-white/80 rounded-2xl shadow-2xl p-8 border border-blue-50 ">
        <h1 className="text-2xl font-bold mb-6 text-blue-900 tracking-tight flex items-center gap-2">
          <svg width="28" height="28" className="text-blue-400" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M18 8a6 6 0 1 0-12 0v2a6 6 0 0 0 12 0V8ZM6 8a6 6 0 1 1 12 0v2a8 8 0 1 1-16 0V8a8 8 0 0 1 4-6.93A7.96 7.96 0 0 1 12 0c4.42 0 8 3.58 8 8v2a8 8 0 1 1-16 0V8Z"/></svg>
          Tableau de bord assistant
        </h1>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-blue-50">
                <th className="px-4 py-3 text-sm text-blue-700">ID</th>
                <th className="px-4 py-3 text-sm text-blue-700">Note</th>
                <th className="px-4 py-3 text-sm text-blue-700">Date souhaitée</th>
                <th className="px-4 py-3 text-sm text-blue-700">Intervention 1</th>
                <th className="px-4 py-3 text-sm text-blue-700">Intervention 2</th>
                <th className="px-4 py-3 text-sm text-blue-700">Statut</th>
                <th className="px-4 py-3 text-sm text-blue-700">Patient</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {demandes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    Aucune demande en cours pour le moment.
                  </td>
                </tr>
              ) : (
                demandes.map((demande) => {
                  const patientId = demande.patient?.split("/").pop();
                  return (
                    <tr
                      key={demande["@id"]}
                      className="hover:bg-blue-50 transition-colors border-b last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">{demande["@id"].split("/").pop()}</td>
                      <td className="px-4 py-3">{demande.note || "-"}</td>
                      <td className="px-4 py-3">
                        {demande.date_souhaite?.substring(0, 10) || "-"}
                      </td>
                      <td className="px-4 py-3">{getInterventionName(demande.intervention_1)}</td>
                      <td className="px-4 py-3">{getInterventionName(demande.intervention_2)}</td>
                      <td className="px-4 py-3">
                        <span className={
                          demande.status === "archivée"
                            ? "bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                            : demande.status === "signée"
                              ? "bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                              : "bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                        }>
                          {demande.status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{patientId || "-"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            if (patientId) {
                              router.push(`/espaceAssistant/${patientId}`);
                            } else {
                              alert("Aucun patient lié à cette demande !");
                            }
                          }}
                          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition-transform hover:bg-blue-700 disabled:opacity-50"
                          disabled={!patientId}
                        >
                          Consulter
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archivées */}
      <div className="flex-1 bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl shadow-lg p-8 max-w-[25%] flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-blue-900 tracking-tight flex items-center gap-2">
          <svg className="text-gray-400" width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm1-17h-2v6h2V5Zm0 8h-2v2h2v-2Z"/></svg>
          Archivées
        </h2>
        <div className="flex flex-col items-center justify-center h-48">
          <svg className="mb-3 text-gray-300" width="48" height="48" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17 8h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2V6a5 5 0 0 1 10 0v2Zm-8 0h6V6a3 3 0 0 0-6 0v2Z"/>
          </svg>
          <span className="text-gray-500 text-center text-base max-w-[220px]">
            Aucune demande archivée pour l’instant.<br />
            <span className="text-xs text-gray-400">Quand vous archiverez une demande, elle s’affichera ici.</span>
          </span>
        </div>
      </div>
    </section>
  );
}