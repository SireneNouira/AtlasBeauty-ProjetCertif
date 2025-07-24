"use client";

import { useState, useEffect } from "react";
import { useEspacePerso } from "@/contexts/EspacePersoContext";
import api from "@/utils/api";
import NewDemandeDevis from "./NewDemandeDevis";
import { LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";

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
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    if (patientData?.demandeDevis?.member?.[0]) {
      const demande = patientData.demandeDevis.member;
      setForm({
        id: demande[0],
        note: demande[1] || "",
        date_souhaite: demande[2] || "",
        status: demande[3] || "",
        date_creation: demande[4] || "",
        intervention_1_name: demande[5] || "",
        intervention_2_name: demande[6] || "",
        intervention_1_id: "",
        intervention_2_id: "",
      });
    }
  }, [patientData]);

  useEffect(() => {
    const fetchInterventions = async () => {
      setLoading(true);
      try {
        const response = await api.get("/interventions");
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
    // eslint-disable-next-line
  }, []);

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

  // -- Définition des styles
  const card =
    "bg-white shadow-xl border-2 border-blue-100/50 rounded-3xl px-8 py-8  mx-auto flex flex-col gap-6";
  const sectionTitle =
    "text-2xl md:text-3xl font-bold text-sky-900 mb-2 flex items-center gap-3";
  const label =
    "block text-base font-semibold text-sky-800 mb-1 tracking-wide";
  const input =
    "w-full border-2 border-sky-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition bg-blue-50 placeholder:text-blue-400 outline-none";
  const btn =
    "inline-flex items-center gap-2 px-6 py-3 rounded-2xl shadow font-semibold text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 transition-all";
  const btnPrimary =
    btn +
    " bg-gradient-to-tr from-sky-600 to-sky-400 text-white hover:from-sky-700 hover:to-sky-500";
  const btnDanger =
    btn +
    " bg-gradient-to-tr from-red-500 to-rose-400 text-white hover:from-red-600 hover:to-red-500";
  const btnGray =
    btn +
    " bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100";
  const select =
    input + " pr-10";

  if (!patientData?.demandeDevis) {
    return (
      <div className={card + " items-center justify-center text-center"}>
        <button
          className={btnPrimary + " text-lg"}
          onClick={() => setShowNewForm(true)}
        >
          <span className="text-xl">➕</span> Nouvelle demande de devis
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

  if (loading) {
    return (
      <div className={card + " items-center text-sky-700"}>
        <LoaderCircle className="animate-spin w-10 h-10 mb-3" />
        Chargement des informations…
      </div>
    );
  }

  if (editMode) {
    return (
      <form onSubmit={handleSubmit} className={card + " space-y-3"}>
        <h2 className={sectionTitle}>
          <span className="text-sky-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#E0F2FE" /><path d="M7 12h10M12 7v10" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </span>
          Modifier ma demande de devis
        </h2>
        <div>
          <label className={label}>Note</label>
          <textarea
            name="note"
            value={form.note || ""}
            onChange={handleChange}
            className={input}
            placeholder="Précisez votre besoin…"
            rows={3}
            aria-label="Note sur la demande"
          />
        </div>
        <div>
          <label className={label}>Date souhaitée</label>
          <input
            type="date"
            name="date_souhaite"
            value={form.date_souhaite || ""}
            onChange={handleChange}
            className={input}
            aria-label="Date souhaitée"
          />
        </div>
        <div>
          <label className={label}>
            Intervention principale <span className="text-red-600">*</span>
          </label>
          <select
            name="intervention_1_name"
            value={form.intervention_1_name}
            onChange={handleChange}
            required
            className={select}
            aria-required="true"
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
          <label className={label}>
            Intervention secondaire (optionnel)
          </label>
          <select
            name="intervention_2_name"
            value={form.intervention_2_name}
            onChange={handleChange}
            className={select}
          >
            <option value="">Aucune</option>
            {interventions
              .filter((i) => i["@id"] !== form.intervention_1_name)
              .map((i) => (
                <option key={i["@id"]} value={i["@id"]}>
                  {i.name}
                </option>
              ))}
          </select>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-xl p-3 mt-2 border border-red-200">
            <AlertCircle className="w-6 h-6" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl p-3 mt-2 border border-green-200">
            <CheckCircle2 className="w-6 h-6" /> Modifications enregistrées
          </div>
        )}

        <div className="flex gap-4 justify-end pt-2">
          <button
            type="submit"
            className={btnPrimary}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin w-6 h-6" /> Enregistrement…
              </>
            ) : (
              "Enregistrer"
            )}
          </button>
          <button
            type="button"
            className={btnGray}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }

  // Mode lecture
  return (
    <section className={card + " shadow-blue-200"}>
      <h2 className={sectionTitle}>
        <span>📄</span> Ma demande de devis
      </h2>
      <div className="grid grid-cols-1 gap-y-3 text-sky-900">
        <div>
          <span className="font-semibold">Note&nbsp;:</span>{" "}
          <span className="text-sky-600">{form.note || <span className="text-sky-400">-</span>}</span>
        </div>
        <div>
          <span className="font-semibold">Date souhaitée&nbsp;:</span>{" "}
          <span className="text-sky-600">{form.date_souhaite || <span className="text-sky-400">-</span>}</span>
        </div>
        <div>
          <span className="font-semibold">Intervention principale&nbsp;:</span>{" "}
          <span className="text-sky-700">{form.intervention_1_name || "-"}</span>
        </div>
        <div>
          <span className="font-semibold">Intervention secondaire&nbsp;:</span>{" "}
          <span className="text-sky-700">{form.intervention_2_name || "-"}</span>
        </div>
        <div>
          <span className="font-semibold">Statut&nbsp;:</span>{" "}
          <span className="text-sky-700">{form.status || <span className="text-sky-400">-</span>}</span>
        </div>
        <div>
          <span className="font-semibold">Date de création&nbsp;:</span>{" "}
          <span className="text-sky-700">{form.date_creation || <span className="text-sky-400">-</span>}</span>
        </div>
      </div>
<div className="flex flex-row gap-4 mt-8 justify-end">
  <button
    className="px-5 py-2 rounded-md border border-sky-700 bg-white text-sky-800 font-medium text-sm shadow-sm hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 transition"
    onClick={handleEditClick}
    type="button"
  >
    Modifier
  </button>
  <button
    className="px-5 py-2 rounded-md border border-red-400 bg-white text-red-600 font-medium text-sm shadow-sm hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition"
    onClick={async () => {
      if (!form.id) return;
      if (
        window.confirm(
          "Voulez-vous vraiment supprimer votre demande de devis ?"
        )
      ) {
        try {
          setLoading(true);
          setError(null);
          await api.delete(`/demande_devis/${form.id}`);
          await refresh();
          setSuccess(true);
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
    type="button"
  >
    Supprimer la demande
  </button>
</div>

      {error && (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-xl p-3 mt-3 border border-red-200">
          <AlertCircle className="w-6 h-6" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl p-3 mt-3 border border-green-200">
          <CheckCircle2 className="w-6 h-6" /> Suppression effectuée
        </div>
      )}
    </section>
  );
}
