// app/your-page/page.tsx
import AuthGuard from '@/components/AuthGuard';
import MeInfo from '@/components/espacePerso/MeInfo';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div className="container">
        <MeInfo />
      </div>
    </AuthGuard>
  )
}