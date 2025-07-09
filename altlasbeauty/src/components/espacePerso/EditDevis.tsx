"use client";

import { useState, useEffect } from "react";
import { useEspacePerso } from "@/contexts/EspacePersoContext";
import api from "@/utils/api";
import NewDemandeDevis from "./NewDemandeDevis";

type Intervention = {
  "@id": string;
  name: string;
};

export default function EditDevis() {
  const { patientData, refresh } = useEspacePerso();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialisation du formulaire avec les valeurs de la demande existante
  useEffect(() => {
    if (patientData?.demandeDevis?.member?.[0]) {
      const demande = patientData.demandeDevis.member;
      setForm({
        id: demande[0],
        note: demande[1] || "",
        date_souhaite: demande[2] || "",
        status: demande[3] || "",
        date_creation: demande[4] || "",
        intervention_1_name: demande[5] || "", // Stocke directement le nom
        intervention_2_name: demande[6] || "",
        intervention_1_id: "",
        intervention_2_id: "",
      });
    }
  }, [patientData]);

  // Chargement des interventions
  useEffect(() => {
    const fetchInterventions = async () => {
      setLoading(true);
      try {
        const response = await api.get("/interventions");
        // Adaptation selon ta pagination ou hydra
        const interventionsData =
          response.data["hydra:member"] || response.data.member || [];
        setInterventions(interventionsData);
        if (form.intervention_1_name) {
          setForm((prev) => ({
            ...prev,
            intervention_1_id:
              interventionsData.find(
                (i) => i.name === prev.intervention_1_name
              )?.["@id"] || "",
            intervention_2_id:
              interventionsData.find(
                (i) => i.name === prev.intervention_2_name
              )?.["@id"] || "",
          }));
        }
      } catch (err) {
        setError("Erreur lors du chargement des interventions");
      } finally {
        setLoading(false);
      }
    };
    fetchInterventions();
  }, []);

  // Handlers
  const handleEditClick = () => {
    setEditMode(true);
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
    setSuccess(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Validation simple
    if (!form.intervention_1_name) {
      setError("Veuillez sélectionner une intervention principale");
      setIsSubmitting(false);
      return;
    }
    if (
      form.intervention_2_name &&
      form.intervention_1_name === form.intervention_2_name
    ) {
      setError("Les deux interventions doivent être différentes.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        note: form.note,
        date_souhaite: form.date_souhaite,
        intervention_1: form.intervention_1_name,
        intervention_2: form.intervention_2_name || null,
      };
      await api.patch(`/demande_devis/${form.id}`, payload, {
        headers: { "Content-Type": "application/merge-patch+json" },
      });

      setSuccess(true);
      setEditMode(false);
      await refresh();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Erreur lors de la modification"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lecture d'une intervention à partir de son @id
  const getInterventionName = (id: string) =>
    interventions.find((i) => i["@id"] === id)?.name || "-";

  const [showNewForm, setShowNewForm] = useState(false);

  if (!patientData?.demandeDevis) {
    return (
      <div className="p-4 text-center">
        <button
          className="bg-primary px-4 py-2 rounded"
          onClick={() => setShowNewForm(true)}
        >
          Faire une nouvelle demande de devis
        </button>
        {showNewForm && (
          <NewDemandeDevis
            onSuccess={() => {
              setShowNewForm(false);
              refresh();
            }}
            onCancel={() => setShowNewForm(false)}
          />
        )}
      </div>
    );
  }

  if (loading) return <div className="p-4 text-center">Chargement...</div>;

  if (editMode) {
    return (
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-2xl shadow bg-white max-w-lg mx-auto space-y-4"
      >
        <h2 className="text-lg font-bold">Modifier ma demande de devis</h2>

        <div>
          <label className="block mb-1">Note :</label>
          <textarea
            name="note"
            value={form.note || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block mb-1">Date souhaitée :</label>
          <input
            type="date"
            name="date_souhaite"
            value={form.date_souhaite || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="space-y-1">
          <select
            name="intervention_1_name"
            value={form.intervention_1_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Intervention 1 *</option>
            {interventions.map((i) => (
              <option key={i["@id"]} value={i["@id"]}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <select
            name="intervention_2_name"
            value={form.intervention_2_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Intervention 2 (optionnel)</option>
            {interventions
              .filter((i) => i["@id"] !== form.intervention_1_name)
              .map((i) => (
                <option key={i["@id"]} value={i["@id"]}>
                  {i.name}
                </option>
              ))}
          </select>
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {success && (
          <div className="text-green-600">Modifications enregistrées</div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }

  // Affichage en mode lecture
  return (
    <section className="p-4 border rounded-2xl shadow bg-white max-w-lg mx-auto space-y-3">
      <h2 className="text-lg font-bold">Ma demande de devis</h2>
      <div>
        <strong>Note :</strong> {form.note || "-"}
      </div>
      <div>
        <strong>Date souhaitée :</strong> {form.date_souhaite || "-"}
      </div>
      <div>
        <strong>Intervention principale :</strong>{" "}
        {form.intervention_1_name || "-"}
      </div>
      <div>
        <strong>Intervention secondaire :</strong>{" "}
        {form.intervention_2_name || "-"}
      </div>
      <div>
        <strong>Statut :</strong> {form.status || "-"}
      </div>
      <div>
        <strong>Date de création :</strong> {form.date_creation || "-"}
      </div>

      <button
        className="mt-4 bg-primary  px-4 py-2 rounded"
        onClick={handleEditClick}
      >
        Modifier
      </button>
      <button
        className="mt-2 bg-red-600  px-4 py-2 rounded"
        onClick={async () => {
          if (!form.id) return;
          if (
            window.confirm(
              "Voulez-vous vraiment supprimer votre demande de devis ?"
            )
          ) {
            try {
              setLoading(true);
              setError(null);
              await api.delete(`/demande_devis/${form.id}`);
              await refresh();
              setSuccess(true); // ou un state à part pour la suppression si tu veux afficher un message spécifique
            } catch (err: any) {
              setError(
                err?.response?.data?.message ||
                  "Erreur lors de la suppression de la demande"
              );
            } finally {
              setLoading(false);
            }
          }
        }}
      >
        Supprimer la demande
      </button>
    </section>
  );
}
