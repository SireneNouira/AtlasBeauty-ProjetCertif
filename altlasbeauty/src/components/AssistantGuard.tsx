// components/AssistantGuard.tsx
'use client'
import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'

type Props = {
  children: ReactNode
}

export default function AssistantGuard({ children }: Props) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/me-user', { withCredentials: true })
        if (
          !res.data ||
          !Array.isArray(res.data.roles?.member) ||
          !res.data.roles.member.includes('ROLE_ASSISTANT')
        ) {
          router.replace('/unauthorized')
          return
        }
        setAuthorized(true)
      } catch {
        router.replace('/auth')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (loading) return <div>Chargement…</div>
  if (!authorized) return null

  return <>{children}</>
}
