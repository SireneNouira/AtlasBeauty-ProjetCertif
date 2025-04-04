"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../utils/api";
import { DatePickerField } from "../DatePickerField";

const RegisterForm = () => {
  type FormDataType = {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    civilite: string;
    annee_naissance: string;
    pays: string;
    profession: string;
    tel: string;
    poids: string;
    taille: string;
    medicament: string;
    allergie: string;
    maladie: string;
    antecendent_chirurgicaux: string;
    ville: string;
    adress: string;
    code_postal: string;
    tabac: boolean;
    alcool: boolean;
    photoFile: File | null;
    note: string;
    date_souhaite: Date | null;
    intervention_1_name: string;
    intervention_2_name: string;
    // [key: string]: string | boolean | File | null;
  };

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
    poids: "",
    taille: "",
    medicament: "",
    allergie: "",
    maladie: "",
    antecendent_chirurgicaux: "",
    ville: "",
    adress: "",
    code_postal: "",
    tabac: false,
    alcool: false,
    photoFile: null,
    note: "",
    date_souhaite: null,
    intervention_1_name: "",
    intervention_2_name: "",
  });
  const [interventions, setInterventions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await api.get("/interventions?page=1");

        // Vérifie si la clé 'member' existe dans la réponse et est un tableau
        if (Array.isArray(response.data.member)) {
          setInterventions(response.data.member); // On récupère les interventions
        } else {
          console.error(
            "La réponse de l'API n'est pas un tableau d'interventions."
          );
          setError("Les interventions n'ont pas pu être chargées.");
        }
      } catch (error) {
        console.error(error);
        setError(
          "Une erreur est survenue lors du chargement des interventions."
        );
      }
    };

    fetchInterventions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      date_souhaite: date,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({
      ...prev,
      photoFile: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (formData.intervention_1_name === formData.intervention_2_name) {
      setError("Les deux interventions doivent être différentes.");
      setIsSubmitting(false);
      return;
    }
    const fetchInterventions = async () => {
      try {
        const response = await api.get("/interventions");
        console.log("DATA:", response.data); // Vérifiez la structure réelle

        // Essayez ces différentes possibilités
        const data =
          response.data.member ||
          response.data["hydra:member"] ||
          response.data.items ||
          response.data;

        if (Array.isArray(data)) {
          setInterventions(data);
        } else {
          setError("Format des interventions invalide");
        }
      } catch (err) {
        setError("Échec du chargement des interventions");
        console.error(err);
      }
    };

    try {
      const formDataToSend = new FormData();

      // Ajoutez tous les champs existants...
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photoFile" && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (key === "date_souhaite" && value instanceof Date) {
          // Formatage spécial pour la date
          formDataToSend.append(key, value.toISOString().split("T")[0]);
        } else if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          formDataToSend.append(key, value.toString());
        } else if (value === null) {
          // Pour les champs null comme date_souhaite quand non sélectionnée
          formDataToSend.append(key, "");
        }
      });

      const response = await api.post("/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const token = response.data.token;
      document.cookie = `BEARER=${token}; path=/; HttpOnly; Secure`;
    } catch (err) {
      console.error("Full error:", error);
      setError(
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      );
      console.log("Data being sent:", {
        email: formData.email,
        interventions: formData.intervention_1_name,
        tabac: formData.tabac,
        alcool: formData.alcool,
        photoFile: formData.photoFile?.name || "none",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-20">
      <h2 className="text-2xl font-semibold text-center">
        Inscription Patient
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="border rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border rounded px-3 py-2"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nom */}
        <div className="flex flex-col">
          <label htmlFor="nom" className="text-sm font-medium">
            Nom
          </label>
          <input
            type="text"
            name="nom"
            id="nom"
            className="border rounded px-3 py-2"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Prénom */}
        <div className="flex flex-col">
          <label htmlFor="prenom" className="text-sm font-medium">
            Prénom
          </label>
          <input
            type="text"
            name="prenom"
            id="prenom"
            className="border rounded px-3 py-2"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Civilité */}
        <div className="flex flex-col">
          <label htmlFor="civilite" className="text-sm font-medium">
            Civilité
          </label>
          <select
            name="civilite"
            id="civilite"
            className="border rounded px-3 py-2"
            value={formData.civilite}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner</option>
            <option value="Mr">Monsieur</option>
            <option value="Mme">Madame</option>
            <option value="Mlle">Mademoiselle</option>
          </select>
        </div>

        {/* Année de naissance */}
        <div className="flex flex-col">
          <label htmlFor="annee_naissance" className="text-sm font-medium">
            Année de naissance
          </label>
          <input
            type="number"
            name="annee_naissance"
            id="annee_naissance"
            className="border rounded px-3 py-2"
            value={formData.annee_naissance}
            onChange={handleChange}
            required
          />
        </div>

        {/* Pays */}
        <div className="flex flex-col">
          <label htmlFor="pays" className="text-sm font-medium">
            Pays
          </label>
          <input
            type="text"
            name="pays"
            id="pays"
            className="border rounded px-3 py-2"
            value={formData.pays}
            onChange={handleChange}
            required
          />
        </div>

        {/* Profession */}
        <div className="flex flex-col">
          <label htmlFor="profession" className="text-sm font-medium">
            Profession
          </label>
          <input
            type="text"
            name="profession"
            id="profession"
            className="border rounded px-3 py-2"
            value={formData.profession}
            onChange={handleChange}
            required
          />
        </div>

        {/* Téléphone */}
        <div className="flex flex-col">
          <label htmlFor="tel" className="text-sm font-medium">
            Téléphone
          </label>
          <input
            type="tel"
            name="tel"
            id="tel"
            className="border rounded px-3 py-2"
            value={formData.tel}
            onChange={handleChange}
            required
          />
        </div>

        {/* Poids */}
        <div className="flex flex-col">
          <label htmlFor="poids" className="text-sm font-medium">
            Poids (kg)
          </label>
          <input
            type="number"
            name="poids"
            id="poids"
            className="border rounded px-3 py-2"
            value={formData.poids}
            onChange={handleChange}
            required
          />
        </div>

        {/* Taille */}
        <div className="flex flex-col">
          <label htmlFor="taille" className="text-sm font-medium">
            Taille (cm)
          </label>
          <input
            type="number"
            name="taille"
            id="taille"
            className="border rounded px-3 py-2"
            value={formData.taille}
            onChange={handleChange}
            required
          />
        </div>

        {/* Médicaments */}
        <div className="flex flex-col">
          <label htmlFor="medicament" className="text-sm font-medium">
            Médicaments
          </label>
          <input
            type="text"
            name="medicament"
            id="medicament"
            className="border rounded px-3 py-2"
            value={formData.medicament}
            onChange={handleChange}
            required
          />
        </div>

        {/* Allergies */}
        <div className="flex flex-col">
          <label htmlFor="allergie" className="text-sm font-medium">
            Allergies
          </label>
          <input
            type="text"
            name="allergie"
            id="allergie"
            className="border rounded px-3 py-2"
            value={formData.allergie}
            onChange={handleChange}
            required
          />
        </div>

        {/* Maladies */}
        <div className="flex flex-col">
          <label htmlFor="maladie" className="text-sm font-medium">
            Maladies
          </label>
          <input
            type="text"
            name="maladie"
            id="maladie"
            className="border rounded px-3 py-2"
            value={formData.maladie}
            onChange={handleChange}
            required
          />
        </div>

        {/* Antécédents chirurgicaux */}
        <div className="flex flex-col">
          <label
            htmlFor="antecendent_chirurgicaux"
            className="text-sm font-medium"
          >
            Antécédents chirurgicaux
          </label>
          <input
            type="text"
            name="antecendent_chirurgicaux"
            id="antecendent_chirurgicaux"
            className="border rounded px-3 py-2"
            value={formData.antecendent_chirurgicaux}
            onChange={handleChange}
          />
        </div>

        {/* Ville */}
        <div className="flex flex-col">
          <label htmlFor="ville" className="text-sm font-medium">
            Ville
          </label>
          <input
            type="text"
            name="ville"
            id="ville"
            className="border rounded px-3 py-2"
            value={formData.ville}
            onChange={handleChange}
            required
          />
        </div>

        {/* Adresse */}
        <div className="flex flex-col">
          <label htmlFor="adress" className="text-sm font-medium">
            Adresse
          </label>
          <input
            type="text"
            name="adress"
            id="adress"
            className="border rounded px-3 py-2"
            value={formData.adress}
            onChange={handleChange}
            required
          />
        </div>

        {/* Code postal */}
        <div className="flex flex-col">
          <label htmlFor="code_postal" className="text-sm font-medium">
            Code Postal
          </label>
          <input
            type="text"
            name="code_postal"
            id="code_postal"
            className="border rounded px-3 py-2"
            value={formData.code_postal}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tabac */}
        <div className="flex flex-col">
          <label htmlFor="tabac" className="text-sm font-medium">
            Consommez-vous du tabac ?
          </label>
          <input
            type="checkbox"
            name="tabac"
            id="tabac"
            className="border rounded px-3 py-2"
            checked={formData.tabac}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tabac: e.target.checked }))
            }
          />
        </div>

        {/* Alcool */}
        <div className="flex flex-col">
          <label htmlFor="alcool" className="text-sm font-medium">
            Consommez-vous de l'alcool ?
          </label>
          <input
            type="checkbox"
            name="alcool"
            id="alcool"
            className="border rounded px-3 py-2"
            checked={formData.alcool}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, alcool: e.target.checked }))
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="photo" className="text-sm font-medium">
            Photo
          </label>
          <input
            type="file"
            name="photoFile"
            id="photo"
            className="border rounded px-3 py-2"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="note" className="text-sm font-medium">
            Note
          </label>
          <textarea
            name="note"
            id="note"
            className="border rounded px-3 py-2"
            value={formData.note}
            onChange={handleChange}
          />
        </div>

        {/* Intervention 1 */}
        <div className="flex flex-col">
          <label htmlFor="intervention_1_name" className="text-sm font-medium">
            Intervention 1
          </label>
          <select
            name="intervention_1_name"
            id="intervention_1_name"
            className="border rounded px-3 py-2"
            value={formData.intervention_1_name}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner une intervention</option>
            {interventions.map((intervention) => (
              <option key={intervention["@id"]} value={intervention.name}>
                {intervention.name}
              </option>
            ))}
          </select>
        </div>

        {/* Intervention 2 */}
        <div className="flex flex-col">
          <label htmlFor="intervention_2_name" className="text-sm font-medium">
            Intervention 2
          </label>
          <select
            name="intervention_2_name"
            id="intervention_2_name"
            className="border rounded px-3 py-2"
            value={formData.intervention_2_name}
            onChange={handleChange}
          >
            <option value="">Sélectionner une intervention</option>
            {interventions
              .filter(
                (intervention) =>
                  intervention.name !== formData.intervention_1_name
              ) // Exclure l'intervention déjà choisie
              .map((intervention) => (
                <option key={intervention["@id"]} value={intervention.name}>
                  {intervention.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col">
        <DatePickerField className="text-sm font-medium"
          id="date_souhaite"
          name="date_souhaite"
          label="Date souhaitée pour l'intervention"
          selected={formData.date_souhaite}
          onChange={handleDateChange}
        />
 </div>
        {/* Bouton d'envoi */}
        <button
          type="submit"
          className={`w-full py-2 bg-blue-500 text-white rounded ${
            isSubmitting ? "opacity-50" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi en cours..." : "S'inscrire"}
        </button>

        {/* Affichage des erreurs */}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
