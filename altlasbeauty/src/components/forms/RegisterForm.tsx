"use client";

import { useEffect, useState } from "react";
import api from "../../utils/api";
import { DatePickerField } from "../DatePickerField";

type Civilite = "Mr" | "Mme" | "Mlle" | "";

type FormDataType = {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  civilite: Civilite;
  annee_naissance: string;
  pays: string;
  profession: string;
  tel: string;
  ville: string;
  adress: string;
  code_postal: string;
  poids: string;
  taille: string;
  antecedents: string;
  tabac: boolean;
  alcool: boolean;
  photoFiles: File[];
  note: string;
  date_souhaite: Date | null;
  intervention_1_name: string;
  intervention_2_name: string;
};

type Intervention = {
  "@id": string;
  name: string;
};

export default function RegisterForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    civilite: "",
    annee_naissance: "",
    pays: "",
    profession: "",
    tel: "",
    ville: "",
    adress: "",
    code_postal: "",
    poids: "",
    taille: "",
    antecedents: "",
    tabac: false,
    alcool: false,
    photoFiles: [],
    note: "",
    date_souhaite: null,
    intervention_1_name: "",
    intervention_2_name: "",
  });

  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await api.get("/interventions?page=1");
        if (Array.isArray(response.data.member)) {
          setInterventions(response.data.member);
        } else {
          setError("Erreur lors du chargement des interventions.");
        }
      } catch (err) {
        setError("Impossible de charger les interventions.");
        console.error("Error fetching interventions:", err);
      }
    };
    fetchInterventions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      date_souhaite: date,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Limite à 5 fichiers maximum
      if (formData.photoFiles.length + files.length > 5) {
        setError("Vous ne pouvez uploader que 5 fichiers maximum");
        return;
      }

      // Vérification de la taille des fichiers (5MB max par fichier)
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
          setError(
            `Le fichier ${files[i].name} dépasse la taille maximale de 5MB`
          );
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        photoFiles: [...prev.photoFiles, ...Array.from(files)],
      }));
    }
  };
  const removeFile = (index: number) => {
    setFormData((prev) => {
      const newFiles = [...prev.photoFiles];
      newFiles.splice(index, 1);
      return { ...prev, photoFiles: newFiles };
    });
  };
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation des champs de l'étape 1 avant de continuer
    if (
      !formData.email ||
      !formData.password ||
      !formData.nom ||
      !formData.prenom ||
      !formData.civilite ||
      !formData.annee_naissance ||
      !formData.pays ||
      !formData.profession ||
      !formData.tel ||
      !formData.ville ||
      !formData.adress ||
      !formData.code_postal
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBackStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation des champs de l'étape 2
    if (
      !formData.poids ||
      !formData.taille ||
      !formData.antecedents ||
      !formData.intervention_1_name
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setIsSubmitting(false);
      return;
    }

    if (
      formData.intervention_2_name &&
      formData.intervention_1_name === formData.intervention_2_name
    ) {
      setError("Les deux interventions doivent être différentes.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Préparation des données pour l'API
      const payload = {
        email: formData.email,
        password: formData.password,
        nom: formData.nom,
        prenom: formData.prenom,
        civilite: formData.civilite,
        annee_naissance: parseInt(formData.annee_naissance),
        pays: formData.pays,
        profession: formData.profession,
        tel: formData.tel,
        poids: parseFloat(formData.poids),
        taille: parseFloat(formData.taille),
        antecedents: formData.antecedents,
        ville: formData.ville,
        adress: formData.adress,
        code_postal: formData.code_postal,
        tabac: formData.tabac,
        alcool: formData.alcool,
        note: formData.note,
        date_souhaite:
          formData.date_souhaite?.toISOString().split("T")[0] || "",
        intervention_1_name: formData.intervention_1_name,
        intervention_2_name: formData.intervention_2_name || null, // Envoie null si vide
        // On n'envoie photoFiles que si il y a des fichiers
        ...(formData.photoFiles.length > 0 && {
          photoFiles: formData.photoFiles,
        }),
      };

      // Création FormData seulement si besoin (fichiers présents)
      // let headers: { 'Content-Type': string } | {} = { 
      //   'Content-Type': 'application/json' 
      // };
    
      type ApiHeaders = 
      | { 'Content-Type': 'application/json' }
      | Record<string, never>; // Objet vide
    
    let headers: ApiHeaders = { 'Content-Type': 'application/json' };
    
      let requestData: any = payload;

      if (formData.photoFiles.length > 0) {
        const formDataToSend = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (key === "photoFiles") {
            (value as File[]).forEach((file) => {
              formDataToSend.append("photoFiles", file);
            });
          } else if (value !== null && value !== undefined) {
            formDataToSend.append(key, value.toString());
          }
        });
        requestData = formDataToSend;
        headers = {}; // Let the browser set Content-Type with boundary for FormData
      }

      const response = await api.post("/register", requestData, {
        headers: headers,
      });

      // Gestion de la réponse
      if (response.data.token) {
        document.cookie = `BEARER=${
          response.data.token
        }; path=/; Secure; SameSite=Strict${
          window.location.protocol === "https:" ? "; Secure" : ""
        }`;
      }

      alert("Inscription réussie !");
      // window.location.href = "/dashboard"; // Redirection si nécessaire
    } catch (err: any) {
      console.error("Registration error:", err);

      // Gestion améliorée des erreurs
      if (err.response) {
        if (err.response.data.violations) {
          setError(
            err.response.data.violations
              .map((v: { message: string }) => v.message)
              .join(", ")
          );
        } else {
          setError(
            err.response.data.message ||
              err.response.data.title ||
              "Erreur lors de l'envoi du formulaire"
          );
        }
      } else {
        setError("Erreur de connexion au serveur");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
 

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Inscription Patient
      </h2>

      {/* Indicateur d'étape */}
      <div className="flex mb-6">
        <div
          className={`flex-1 text-center py-2 border-b-2 ${
            step === 1 ? "border-blue-600 font-medium" : "border-gray-300"
          }`}
        >
          Étape 1: Informations personnelles
        </div>
        <div
          className={`flex-1 text-center py-2 border-b-2 ${
            step === 2 ? "border-blue-600 font-medium" : "border-gray-300"
          }`}
        >
          Étape 2: Informations médicales
        </div>
      </div>

      <form
        onSubmit={step === 1 ? handleNextStep : handleSubmit}
        className="space-y-4"
      >
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe *"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="nom"
                  placeholder="Nom *"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="prenom"
                  placeholder="Prénom *"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <select
                  name="civilite"
                  value={formData.civilite}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Civilité *</option>
                  <option value="Mr">Monsieur</option>
                  <option value="Mme">Madame</option>
                  <option value="Mlle">Mademoiselle</option>
                </select>
              </div>
              <div className="space-y-1">
                <input
                  name="annee_naissance"
                  type="number"
                  placeholder="Année de naissance *"
                  value={formData.annee_naissance}
                  onChange={handleChange}
                  required
                  min={1900}
                  max={new Date().getFullYear()}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="pays"
                  placeholder="Pays *"
                  value={formData.pays}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="profession"
                  placeholder="Profession *"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="tel"
                  type="tel"
                  placeholder="Téléphone *"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="ville"
                  placeholder="Ville *"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <input
                  name="adress"
                  placeholder="Adresse *"
                  value={formData.adress}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="code_postal"
                  placeholder="Code postal *"
                  value={formData.code_postal}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
              >
                Étape suivante
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  name="poids"
                  type="number"
                  step="0.1"
                  min="30"
                  placeholder="Poids (kg) *"
                  value={formData.poids}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="taille"
                  type="number"
                  step="0.1"
                  min="100"
                  placeholder="Taille (cm) *"
                  value={formData.taille}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <textarea
                  name="antecedents"
                  placeholder="Nombre de grossesses : --- Type D’accouchement : --- Date dernier accouchement : --- Date dernier allaitement : --- Traitement en cours : --- Allergies (type + traitement)"
                  value={formData.antecedents}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    name="tabac"
                    checked={formData.tabac}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Tabac
                </label>
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    name="alcool"
                    checked={formData.alcool}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Alcool
                </label>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="block mb-1">
                  Photos ( 4 photos obligatoires (une photo de chaque côté) * )
                </label>
                <input
                  type="file"
                  name="photoFiles"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="w-full p-2 border rounded"
                />

                {/* Aperçu des fichiers sélectionnés */}
                {formData.photoFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">
                      Fichiers sélectionnés:
                    </p>
                    <ul className="space-y-1">
                      {formData.photoFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-1 col-span-2">
                <textarea
                  name="note"
                  placeholder="Note (optionnel)"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-1">
                <select
                  name="intervention_1_name"
                  value={formData.intervention_1_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Intervention 1 *</option>
                  {interventions.map((i) => (
                    <option key={i["@id"]} value={i.name}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <select
                  name="intervention_2_name"
                  value={formData.intervention_2_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Intervention 2 (optionnel)</option>
                  {interventions
                    .filter((i) => i.name !== formData.intervention_1_name)
                    .map((i) => (
                      <option key={i["@id"]} value={i.name}>
                        {i.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <DatePickerField
                  name="date_souhaite"
                  id="date_souhaite"
                  label="Date souhaitée (optionnel)"
                  selected={formData.date_souhaite}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleBackStep}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Envoi en cours..." : "S'inscrire"}
              </button>
            </div>
          </>
        )}
        {error && (
          <div className="p-4 text-red-600 bg-red-50 rounded-md mt-4 text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
