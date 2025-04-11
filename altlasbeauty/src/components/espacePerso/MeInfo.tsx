"use client";

import { useEffect, useState } from "react";
import api from  "@/utils/api";

type RawMeResponse = {
  member: [number, string, string, string, string];
};

export default function MeInfo() {
  const [me, setMe] = useState<RawMeResponse["member"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get<RawMeResponse>("/me");
        setMe(response.data.member);
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">Erreur : {error}</p>;
  if (!me) return <p>Aucune donnée utilisateur disponible.</p>;

  const [id, email, firstName, lastName, role] = me;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Bienvenue {firstName} {lastName}</h2>
      <p><strong>Email :</strong> {email}</p>
      <p><strong>ID :</strong> {id}</p>
      <p><strong>Type :</strong> {role}</p>
    </div>
  );
}
