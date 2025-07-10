"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

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

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-6">Tableau de bord assistant</h1>
      <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Note</th>
            <th className="px-4 py-2">Date souhaitée</th>
            <th className="px-4 py-2">Intervention 1</th>
            <th className="px-4 py-2">Intervention 2</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((demande) => {
            const patientId = demande.patient?.split("/").pop();
            return (
              <tr key={demande["@id"]} className="hover:bg-blue-50">
                <td className="px-4 py-2">{demande["@id"].split("/").pop()}</td>
                <td className="px-4 py-2">{demande.note || "-"}</td>
                <td className="px-4 py-2">
                  {demande.date_souhaite?.substring(0, 10) || "-"}
                </td>
                <td className="px-4 py-2">{getInterventionName(demande.intervention_1)}</td>
                <td className="px-4 py-2">{getInterventionName(demande.intervention_2)}</td>
                <td className="px-4 py-2">{demande.status || "-"}</td>
                <td className="px-4 py-2">{patientId || "-"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      if (patientId) {
                        router.push(`/espaceAssistant/${patientId}`);
                      } else {
                        alert("Aucun patient lié à cette demande !");
                      }
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    disabled={!patientId}
                  >
                    Consulter
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
