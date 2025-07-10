"use client";

import React, { useRef, useState } from "react";
import { useEspacePerso } from "@/contexts/EspacePersoContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const API_BASE_URL = "http://localhost:8000";

export default function Photos() {
  const { patientData, loading, error, refresh } = useEspacePerso();
  const photos = patientData?.photos?.member ?? [];
  const maxReached = photos.length >= 4;

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Suppression d'une photo
  const handleDelete = async (photoId: number) => {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/photos/${photoId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        refresh();
      } else {
        alert("Erreur lors de la suppression !");
      }
    } catch {
      alert("Erreur réseau !");
    }
  };

  // Upload d'une photo
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input || !input.files?.length) return alert("Sélectionne une photo");
    const file = input.files[0];

    const formData = new FormData();
    formData.append("photoFile", file); // CE NOM EST CRUCIAL !

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/photos`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (res.ok) {
        refresh();
        input.value = "";
      } else {
        alert("Erreur upload !");
      }
    } catch {
      alert("Erreur réseau !");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur : {error}</div>;

  return (
    <div>
      {/* Formulaire d'ajout */}
      <form onSubmit={handleUpload} className="flex gap-2 items-center mb-4">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          required
          disabled={maxReached || uploading}
        />
        <button
          type="submit"
          disabled={maxReached || uploading}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          {uploading ? "Ajout..." : "Ajouter"}
        </button>
        {maxReached && (
          <span className="text-sm text-gray-500 ml-2">4 photos max</span>
        )}
      </form>

      {/* Grille de photos */}
      {!photos.length ? (
        <div>Aucune photo pour le moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="flex flex-col items-center p-4 rounded-xl shadow bg-white"
            >
              <img
                src={`${API_BASE_URL}/uploads/${photo.photoPath ?? photo.path}`}
                alt={`Photo ${photo.id}`}
                className="w-36 h-36 object-cover rounded-xl mb-2 border"
              />
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-mono">
                  {photo.photoPath ?? photo.path}
                </span>
              </div>
              {photo.updatedAt && (
                <div className="text-xs text-gray-500 mb-2">
                  {format(new Date(photo.updatedAt), "dd/MM/yyyy à HH:mm", {
                    locale: fr,
                  })}
                </div>
              )}
              <button
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                onClick={() => handleDelete(photo.id)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
