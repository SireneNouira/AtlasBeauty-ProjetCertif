// hooks/useAuth.ts
"use client"
import { useState, useEffect } from 'react'

export function useAuth() {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null
    loading: boolean
    error: string | null
  }>({
    isAuthenticated: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
          cache: 'no-store'
        })
        
        if (!response.ok) throw new Error('Failed to verify authentication')
        
        const data = await response.json()
        setAuthState({
          isAuthenticated: data.authenticated,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Auth check error:', error)
        setAuthState({
          isAuthenticated: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    checkAuth()
    
    // Nettoyage optionnel
    return () => {
      // Annuler la requête si nécessaire
    }
  }, [])

  return authState
}