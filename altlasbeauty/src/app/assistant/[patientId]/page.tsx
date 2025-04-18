// app/assistant/chat/[patientId]/page.tsx
import { Chat } from '@/components/chat/Chat';
import { getMe } from '@/utils/auth';
import AuthGuard from '@/components/AuthGuard';

export default async function AssistantChatPage({
  params
}: {
  params: { patientId: string }
}) {
  const me = await getMe();
  
  if (!me) return null;

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <Chat
          currentUserId={me.id}
          currentUserType="user" // L'assistant est un user
          receiverId={parseInt(params.patientId)}
          receiverType="patient" // On parle à un patient
        />
      </div>
    </AuthGuard>
  );
}