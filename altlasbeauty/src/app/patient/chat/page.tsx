// // app/patient/chat/page.tsx
// 'use client';
// import { Chat } from '@/components/chat/Chat';
// import AuthGuard from '@/components/AuthGuard';
// import { useEffect, useState } from "react";
// import api from "@/utils/api";

// const ASSISTANT_ID = 3;

// // Type pour les deux formats de réponse possibles
// type RawMeResponse = {
//   "@context"?: string;
//   "@id"?: string;
//   "@type"?: string;
//   totalItems?: number;
//   member: [number, string, string, string, string]; // Format cohérent
// };

// export default function PatientChatPage() {
//   const [me, setMe] = useState<RawMeResponse["member"] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const response = await api.get<RawMeResponse>("/me");
//         console.log("Réponse complète:", response.data); // Debug

//         // Gestion des deux formats de réponse
//         const member = response.data.member || (response.data as any)["hydra:member"];
//         if (!member) throw new Error("Format de réponse inattendu");

//         setMe(member);
//       } catch (err: any) {
//         console.error("Erreur:", err.response?.data || err.message);
//         setError("Erreur de chargement des données");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMe();
//   }, []);

//   if (loading) return <p>Chargement...</p>;
//   if (error) return <p className="text-red-500">Erreur : {error}</p>;
//   if (!me) return <p>Aucune donnée utilisateur disponible.</p>;

//   const [id, email, firstName, lastName, role] = me;

//   return (
//     <AuthGuard>
//       <Chat
//         currentUserId={id}
//         currentUserType="patient"
//         receiverId={ASSISTANT_ID}
//         receiverType="user"
//       />
//     </AuthGuard>
//   );
// }

// app/patient/chat/page.tsx
'use client';
import { Chat } from '@/components/chat/Chat';
import AuthGuard from '@/components/AuthGuard';
import { useEffect, useState } from "react";
import api from "@/utils/api";

const ASSISTANT_ID = 3;

type ChatUserResponse = {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  role: 'patient' | 'user';
  avatar?: string;
};

export default function PatientChatPage() {
  const [userData, setUserData] = useState<ChatUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get<ChatUserResponse>('/me/chat');
        setUserData(response.data);
      } catch (err: any) {
        console.error("Erreur:", err);
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
        currentUserType="patient"
        receiverId={ASSISTANT_ID}
        receiverType="user"
      />
    </AuthGuard>
  );
}