'use client'

import LoginForm from '@/components/forms/LoginForm'
import RegisterForm from '@/components/forms/RegisterForm'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Déterminer quel formulaire afficher en fonction du paramètre d'URL
  useEffect(() => {
    if (!searchParams) return // Gestion du cas où searchParams serait null
    
    const action = searchParams.get('action')
    setShowRegister(action === 'register')
  }, [searchParams])

  // Si searchParams est null (très rare), afficher un message de chargement
  if (!searchParams) {
    return <div className="flex justify-center items-center h-screen">
      <p>Chargement...</p>
    </div>
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex border-b mb-6">
        <button
          onClick={() => {
            router.push('/auth')
            setShowRegister(false)
          }}
          className={`py-2 px-4 font-medium ${!showRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Connexion
        </button>
        <button
          onClick={() => {
            router.push('/auth?action=register')
            setShowRegister(true)
          }}
          className={`py-2 px-4 font-medium ${showRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Inscription
        </button>
      </div>
      
      {showRegister ? <RegisterForm /> : <LoginForm />}
      
      <div className="mt-4 text-center">
        {showRegister ? (
          <p>
            Déjà un compte?{' '}
            <button 
              onClick={() => {
                router.push('/auth')
                setShowRegister(false)
              }} 
              className="text-blue-600 hover:underline"
            >
              Se connecter
            </button>
          </p>
        ) : (
          <p>
            Pas encore de compte?{' '}
            <button 
              onClick={() => {
                router.push('/auth?action=register')
                setShowRegister(true)
              }} 
              className="text-blue-600 hover:underline"
            >
              S'inscrire
            </button>
          </p>
        )}
      </div>
    </div>
  )
}