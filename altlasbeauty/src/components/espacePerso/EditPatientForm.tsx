"use client";

import { useState } from "react";
import api from "@/utils/api";

export default function EditPatientForm({
  patient,
  onCancel,
}: {
  patient: any;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    email: patient.email || "",
    nom: patient.nom || "",
    prenom: patient.prenom || "",
    civilite: patient.civilite || "",
    annee_naissance: patient.annee_naissance || "",
    tel: patient.tel || "",
    ville: patient.ville || "",
    adress: patient.adress || "",
    code_postal: patient.code_postal || "",
    pays: patient.pays || "",
    profession: patient.profession || "",
    poids: patient.poids || "",
    taille: patient.taille || "",
    antecedents: patient.antecedents || "",
    tabac: patient.tabac || false,
    alcool: patient.alcool || false,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
      nom: form.nom,
      prenom: form.prenom,
      civilite: form.civilite,
      annee_naissance: form.annee_naissance,
      tel: form.tel,
      ville: form.ville,
      adress: form.adress,
      code_postal: form.code_postal,
      pays: form.pays,
      profession: form.profession,
      poids: form.poids.toString(), 
      taille: form.taille.toString(), 
      antecedents: form.antecedents,
      tabac: form.tabac,
      alcool: form.alcool,
    };

  try {
    await api.patch(`/patients/${patient.id}`, payload, {
      headers: {
        'Content-Type': 'application/merge-patch+json' // Header crucial
      }
    });
    setSuccess(true);
  } catch (err) {
    console.error(err);
    setError("Erreur lors de la mise à jour");
  }
};
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Prénom"
        />
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Nom"
        />
        <select
          name="civilite"
          value={form.civilite}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Civilité</option>
          <option value="Mr">Monsieur</option>
          <option value="Mme">Madame</option>
          <option value="Mlle">Mademoiselle</option>
        </select>
        <input
          name="annee_naissance"
          type="number"
          value={form.annee_naissance}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Année de naissance"
        />
        <input
          name="tel"
          value={form.tel}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Téléphone"
        />
        <input
          name="ville"
          value={form.ville}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Ville"
        />
        <input
          name="adress"
          value={form.adress}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Adresse"
        />
        <input
          name="code_postal"
          value={form.code_postal}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Code postal"
        />
        <input
          name="pays"
          value={form.pays}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Pays"
        />
        <input
          name="profession"
          value={form.profession}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Profession"
        />
        <input
          name="poids"
          value={form.poids}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Poids (kg)"
        />
        <input
          name="taille"
          value={form.taille}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Taille (cm)"
        />
      </div>

      <textarea
        name="antecedents"
        value={form.antecedents}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        placeholder="Antécédents médicaux"
      />
      <div className="flex items-center gap-4">
        <label>
          <input
            type="checkbox"
            name="tabac"
            checked={form.tabac}
            onChange={handleChange}
          />
          Tabac
        </label>
        <label>
          <input
            type="checkbox"
            name="alcool"
            checked={form.alcool}
            onChange={handleChange}
          />
          Alcool
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-600">Informations mises à jour avec succès.</p>
      )}
    </form>
  );
}
