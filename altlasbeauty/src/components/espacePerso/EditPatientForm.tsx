"use client";

import { useState } from "react";
import api from "@/utils/api";
import { FaSmoking, FaWineBottle } from "react-icons/fa";

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
          "Content-Type": "application/merge-patch+json",
        },
      });
      setSuccess(true);
      setError(null);
    } catch (err) {
      setSuccess(false);
      setError("Erreur lors de la mise à jour");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-2xl mx-auto p-6 rounded-2xl shadow-xl border border-sky-100 space-y-6"
      aria-labelledby="titre-edition"
    >
      <h2
        id="titre-edition"
        className="text-2xl font-bold text-sky-700 mb-4 text-center"
      >
        Modifier mes informations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prénom */}
        <div className="flex flex-col gap-1">
          <label htmlFor="prenom" className="text-sky-900 font-semibold">
            Prénom
          </label>
          <input
            id="prenom"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Prénom"
            required
            autoComplete="given-name"
          />
        </div>
        {/* Nom */}
        <div className="flex flex-col gap-1">
          <label htmlFor="nom" className="text-sky-900 font-semibold">
            Nom
          </label>
          <input
            id="nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Nom"
            required
            autoComplete="family-name"
          />
        </div>
        {/* Civilité */}
        <div className="flex flex-col gap-1">
          <label htmlFor="civilite" className="text-sky-900 font-semibold">
            Civilité
          </label>
          <select
            id="civilite"
            name="civilite"
            value={form.civilite}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            required
          >
            <option value="">Choisir…</option>
            <option value="Mr">Monsieur</option>
            <option value="Mme">Madame</option>
            <option value="Mlle">Mademoiselle</option>
          </select>
        </div>
        {/* Année de naissance */}
        <div className="flex flex-col gap-1">
          <label htmlFor="annee_naissance" className="text-sky-900 font-semibold">
            Année de naissance
          </label>
          <input
            id="annee_naissance"
            name="annee_naissance"
            type="number"
            value={form.annee_naissance}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Année"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>
        {/* Téléphone */}
        <div className="flex flex-col gap-1">
          <label htmlFor="tel" className="text-sky-900 font-semibold">
            Téléphone
          </label>
          <input
            id="tel"
            name="tel"
            value={form.tel}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Téléphone"
            autoComplete="tel"
          />
        </div>
        {/* Ville */}
        <div className="flex flex-col gap-1">
          <label htmlFor="ville" className="text-sky-900 font-semibold">
            Ville
          </label>
          <input
            id="ville"
            name="ville"
            value={form.ville}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Ville"
          />
        </div>
        {/* Adresse */}
        <div className="flex flex-col gap-1">
          <label htmlFor="adress" className="text-sky-900 font-semibold">
            Adresse
          </label>
          <input
            id="adress"
            name="adress"
            value={form.adress}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Adresse"
            autoComplete="street-address"
          />
        </div>
        {/* Code postal */}
        <div className="flex flex-col gap-1">
          <label htmlFor="code_postal" className="text-sky-900 font-semibold">
            Code postal
          </label>
          <input
            id="code_postal"
            name="code_postal"
            value={form.code_postal}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Code postal"
            autoComplete="postal-code"
          />
        </div>
        {/* Pays */}
        <div className="flex flex-col gap-1">
          <label htmlFor="pays" className="text-sky-900 font-semibold">
            Pays
          </label>
          <input
            id="pays"
            name="pays"
            value={form.pays}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Pays"
            autoComplete="country"
          />
        </div>
        {/* Profession */}
        <div className="flex flex-col gap-1">
          <label htmlFor="profession" className="text-sky-900 font-semibold">
            Profession
          </label>
          <input
            id="profession"
            name="profession"
            value={form.profession}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Profession"
          />
        </div>
        {/* Poids */}
        <div className="flex flex-col gap-1">
          <label htmlFor="poids" className="text-sky-900 font-semibold">
            Poids (kg)
          </label>
          <input
            id="poids"
            name="poids"
            type="number"
            value={form.poids}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Poids"
            min={20}
            max={500}
          />
        </div>
        {/* Taille */}
        <div className="flex flex-col gap-1">
          <label htmlFor="taille" className="text-sky-900 font-semibold">
            Taille (cm)
          </label>
          <input
            id="taille"
            name="taille"
            type="number"
            value={form.taille}
            onChange={handleChange}
            className="p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Taille"
            min={100}
            max={250}
          />
        </div>
      </div>

      {/* Antécédents */}
      <div className="flex flex-col gap-1">
        <label htmlFor="antecedents" className="text-sky-900 font-semibold">
          Antécédents médicaux
        </label>
        <textarea
          id="antecedents"
          name="antecedents"
          value={form.antecedents}
          onChange={handleChange}
          className="min-h-[70px] p-3 rounded-xl border border-sky-100 bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-none"
          placeholder="Indiquez vos antécédents (maladies, opérations, allergies…)"
        />
      </div>

      {/* Tabac & alcool */}
      <div className="flex gap-8 items-center justify-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="tabac"
            checked={form.tabac}
            onChange={handleChange}
            className="w-5 h-5 accent-sky-500 focus:ring-2 focus:ring-sky-400"
            aria-checked={form.tabac}
            aria-label="Tabac"
          />
          <FaSmoking className="text-sky-600" aria-hidden />
          <span className="text-sky-900">Tabac</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="alcool"
            checked={form.alcool}
            onChange={handleChange}
            className="w-5 h-5 accent-sky-500 focus:ring-2 focus:ring-sky-400"
            aria-checked={form.alcool}
            aria-label="Alcool"
          />
          <FaWineBottle className="text-sky-600" aria-hidden />
          <span className="text-sky-900">Alcool</span>
        </label>
      </div>

      {/* Actions & feedback */}
      <div className="flex gap-4 justify-center">
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 transition-colors text-white font-bold px-6 py-3 rounded-2xl shadow-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
          aria-label="Enregistrer les modifications"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 transition-colors text-sky-800 font-semibold px-6 py-3 rounded-2xl shadow focus:ring-2 focus:ring-sky-400 focus:outline-none"
          aria-label="Annuler la modification"
        >
          Annuler
        </button>
      </div>
      {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      {success && (
        <p className="text-green-600 text-center mt-2">
          Informations mises à jour avec succès.
        </p>
      )}
    </form>
  );
}
