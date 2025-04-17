import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import api from "@/utils/api";
import Chat from "@/components/chat/Chat";

type Params = {
  params: {
    type: 'user' | 'patient';
    id: string;
  };
};

export default async function ChatPage({ params }: Params) {
  const { type, id } = params;
  const cookieStore = cookies();
  const token = (await cookieStore).get('mercureAuthorization')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const meResponse = await api.get<{ member: [number, string, string, string, string] }>('/me');
    const [userId, , , , userType] = meResponse.data.member;

    if (userType !== 'user' && userType !== 'patient') {
      throw new Error('Type utilisateur invalide');
    }

    return (
      <div className="h-screen flex flex-col">
        <Chat 
          receiverId={Number(id)} 
          receiverType={type}
          currentUserType={userType}
          currentUserId={userId}
        />
      </div>
    );
  } catch (error) {
    console.error('Erreur chargement chat:', error);
    notFound();
  }
}