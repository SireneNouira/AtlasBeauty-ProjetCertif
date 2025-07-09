"use client";

import { useState, useEffect } from "react";
import { useEspacePerso } from "@/contexts/EspacePersoContext";
import api from "@/utils/api";

type Intervention = {
  "@id": string;
  name: string;
};

export default function NewDemandeDevis({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { patientData } = useEspacePerso();
  const [form, setForm] = useState({
    note: "",
    date_souhaite: "",
    intervention_1: "",
    intervention_2: "",
  });
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/interventions")
      .then((res) => {
        const data = res.data["hydra:member"] || res.data.member || [];
        setInterventions(data);
      })
      .catch(() => setError("Erreur lors du chargement des interventions"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!form.intervention_1) {
      setError("L'intervention principale est obligatoire");
      setIsSubmitting(false);
      return;
    }
    if (form.intervention_1 === form.intervention_2 && form.intervention_1) {
      setError("Les deux interventions doivent être différentes");
      setIsSubmitting(false);
      return;
    }

    try {
      // Format correct pour l'API Platform
   const payload = {
  note: form.note || null,
  date_souhaite: form.date_souhaite || null,
  intervention_1: form.intervention_1 || null, // valeur type "/api/interventions/3"
  intervention_2: form.intervention_2 || null  // valeur type "/api/interventions/4" ou null
};


      await api.post("/demande_devis", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      onSuccess();
    } catch (err: any) {
      console.error("Erreur détaillée:", err.response?.data);
      setError(
        err?.response?.data?.message ||
        "Erreur lors de la création de la demande"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 border rounded-2xl shadow bg-white max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-lg font-bold">Nouvelle demande de devis</h2>
      <div>
        <label className="block mb-1">Note (optionnelle) :</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={2}
        />
      </div>
      <div>
        <label className="block mb-1">Date souhaitée (optionnelle) :</label>
        <input
          type="date"
          name="date_souhaite"
          value={form.date_souhaite}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block mb-1">Intervention principale* :</label>
        <select
          name="intervention_1"
          value={form.intervention_1}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        >
          <option value="">Choisir une intervention</option>
          {interventions.map((i) => (
            <option key={i["@id"]} value={i["@id"]}>
              {i.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Intervention secondaire (optionnel) :</label>
        <select
          name="intervention_2"
          value={form.intervention_2}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Aucune</option>
          {interventions
            .filter((i) => i["@id"] !== form.intervention_1)
            .map((i) => (
              <option key={i["@id"]} value={i["@id"]}>
                {i.name}
              </option>
            ))}
        </select>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi..." : "Envoyer"}
        </button>
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}