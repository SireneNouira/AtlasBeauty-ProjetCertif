// app/assistant/chat/[patientId]/page.tsx
'use client';
import { Chat } from '@/components/chat/Chat';
import AuthGuard from '@/components/AuthGuard';
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useParams } from "next/navigation";

type ChatUserResponse = {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  role: 'patient' | 'user';
  avatar?: string;
};

export default function AssistantChatPage() {
  const params = useParams();
  const patientId = Number(params.patientId);
  const [userData, setUserData] = useState<ChatUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get<ChatUserResponse>('/me/chat');
        setUserData(response.data);
      } catch (err: any) {
        setError(err.message || "Erreur de chargement des données utilisateur");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">Erreur : {error}</p>;
  if (!userData) return <p>Aucune donnée utilisateur disponible.</p>;

  return (
    <AuthGuard>
      <Chat
        currentUserId={userData.id}
        currentUserType="user"
        receiverId={patientId}
        receiverType="patient"
      />
    </AuthGuard>
  );
}
