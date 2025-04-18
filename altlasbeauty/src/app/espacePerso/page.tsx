// app/espacePerso/page.tsx
import AuthGuard from '@/components/AuthGuard';
import MeInfo from '@/components/espacePerso/MeInfo';
import Link from "next/link";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div className="container flex flex-col  items-center p-32">
        <MeInfo />
     
      <Link 
          href="/patient/chat"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Envoyer un message à l'assistant
        </Link>
         </div>
    </AuthGuard>
  )
}