"use client";

import { useRef, useState } from "react";
import api from "@/utils/api";

type Props = {
  patientId: string | number;
  demandeDevisId?: string | number;
};

export default function UploadDevis({ patientId, demandeDevisId }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nouveaux états pour les champs date_operation, date_sejour et is_signed
  const today = new Date().toISOString().slice(0, 10);
  const [dateOperation, setDateOperation] = useState<string>(today);
  const [dateSejour, setDateSejour] = useState<string>(today);
  const [isSigned, setIsSigned] = useState<boolean>(false);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("devisFile", file);
    formData.append("patient", `/api/patients/${patientId}`);
    if (demandeDevisId) {
      formData.append("demande_devis", `/api/demande_devis/${demandeDevisId}`);
    }
    // Ajout des nouveaux champs
    formData.append("date_operation", `${dateOperation}T00:00:00`);
    formData.append("is_signed", String(isSigned));
    formData.append("date_sejour", `${dateSejour}T00:00:00`);

    try {
      await api.post("/devis", formData);
      // TODO: rafraîchir la liste des devis ou afficher un toast de succès
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Erreur à l’envoi du devis"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:space-x-4 items-start gap-2">
        <label className="flex flex-col text-sm">
          Date op.
          <input
            type="date"
            value={dateOperation}
            onChange={(e) => setDateOperation(e.target.value)}
            className="mt-1 p-1 border rounded"
          />
        </label>
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={isSigned}
            onChange={() => setIsSigned((s) => !s)}
            className="w-4 h-4"
          />
          <span>Signé</span>
        </label>
        <label className="flex flex-col text-sm">
          Date séjour
          <input
            type="date"
            value={dateSejour}
            onChange={(e) => setDateSejour(e.target.value)}
            className="mt-1 p-1 border rounded"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={`bg-red-300 px-4 py-2 rounded-2xl transition ${
          uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-400"
        }`}
      >
        {uploading ? "Envoi en cours…" : "Envoyer un devis"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
