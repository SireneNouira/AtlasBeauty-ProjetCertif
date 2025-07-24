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

  const handleDelete = async (photoId: number) => {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/photos/${photoId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        refresh();
      } else {
        alert("Erreur lors de la suppression !");
      }
    } catch {
      alert("Erreur réseau !");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input || !input.files?.length) return alert("Sélectionne une photo");
    const file = input.files[0];

    const formData = new FormData();
    formData.append("photoFile", file);

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
        alert("Erreur upload !");
      }
    } catch {
      alert("Erreur réseau !");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="text-red-600">Erreur : {error}</div>;

  return (
    <section>
      {/* Formulaire d'ajout */}
      <form
        onSubmit={handleUpload}
        className="flex flex-wrap items-center gap-4 mb-6 bg-sky-50 rounded-xl p-4 border border-sky-100 shadow-sm"
        aria-labelledby="photos-upload-title"
      >
        <label htmlFor="photo-upload" className="font-medium text-sky-800">
          Ajouter une photo
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          ref={inputRef}
          required
          disabled={maxReached || uploading}
          className="file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-sky-200 file:text-sky-800 file:font-medium file:cursor-pointer file:hover:bg-sky-300 transition file:focus:outline-none file:focus-visible:ring-2 file:focus-visible:ring-sky-600"
        />
        <button
          type="submit"
          disabled={maxReached || uploading}
          className="px-4 py-1.5 rounded-full bg-sky-600 text-white font-semibold shadow-sm transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50"
        >
          {uploading ? "Ajout…" : "Ajouter"}
        </button>
        {maxReached && (
          <span className="text-sm text-gray-500 ml-2">4 photos max</span>
        )}
      </form>

      {/* Grille de photos */}
      {!photos.length ? (
        <div className="text-center text-gray-500">Aucune photo pour le moment.</div>
      ) : (
<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {photos.map((photo) => (
    <li
      key={photo.id}
      className="group bg-white rounded-2xl shadow-lg border border-sky-100 flex flex-col items-center p-7 transition hover:shadow-xl focus-within:ring-2 focus-within:ring-sky-400"
      tabIndex={0}
      aria-label={`Photo ${photo.id}`}
    >
      <img
        src={`${API_BASE_URL}/uploads/${photo.photoPath ?? photo.path}`}
        alt={`Photo ${photo.id}`}
        className="w-52 h-52 object-cover rounded-xl mb-4 border border-gray-200 shadow-inner bg-gray-50"
      />
      <div className="text-xs text-gray-600 mb-2 break-all font-mono text-center">
        {photo.photoPath ?? photo.path}
      </div>
      {photo.updatedAt && (
        <div className="text-xs text-gray-400 mb-2 text-center">
          {format(new Date(photo.updatedAt), "dd/MM/yyyy à HH:mm", {
            locale: fr,
          })}
        </div>
      )}
      <button
        type="button"
        className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 font-medium shadow-sm hover:bg-red-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        onClick={() => handleDelete(photo.id)}
        aria-label="Supprimer la photo"
      >
        Supprimer
      </button>
    </li>
  ))}
</ul>

      )}
    </section>
  );
}
