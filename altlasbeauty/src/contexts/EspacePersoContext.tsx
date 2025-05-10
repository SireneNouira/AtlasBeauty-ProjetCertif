// contexts/EspacePersoContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/utils/api'

export type PatientData = {
  id: number
  prenom: string
  nom: string
  email: string
  status: {
    hasPhotos: boolean
    hasDemandeDevis: boolean
    hasDevis: boolean
    devisSigned: boolean
    demandeDevisStatus?: string
  }
  civilite: string
  annee_naissance?: number
  adress?: string
  code_postal?: string
  ville?: string
  pays: string
  profession: string
  tel: string
  poids?: number
  taille?: number
  tabac?: boolean
  alcool?: boolean
  antecedents?: string
  photos: Array<{
    id: number
    path: string
    uploadedAt?: string
  }>
  demandeDevis?: {
    id: number
    note?: string
    date_souhaite?: string
    status: string
    date_creation?: string
    intervention_1?: string
    intervention_2?: string
  }
  devis?: {
    id: number
    fichier: string
    date_operation?: string
    is_signed: boolean
    date_sejour?: string
  }
}

const EspacePersoContext = createContext<{
  patientData: PatientData | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}>({
  patientData: null,
  loading: true,
  error: null,
  refresh: async () => {}
})

export function EspacePersoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    patientData: PatientData | null
    loading: boolean
    error: string | null
  }>({
    patientData: null,
    loading: true,
    error: null
  })

  const fetchPatientData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const response = await api.get<PatientData>('/me')
      
      setState({
        patientData: response.data,
        loading: false,
        error: null
      })
    } catch (err) {
      setState({
        patientData: null,
        loading: false,
        error: (err instanceof Error ? err.message : 'Erreur inconnue') || 'Erreur lors du chargement des données patient'
      })
    }
  }

  useEffect(() => {
    fetchPatientData()
  }, [])

  return (
    <EspacePersoContext.Provider value={{
      patientData: state.patientData,
      loading: state.loading,
      error: state.error,
      refresh: fetchPatientData
    }}>
      {children}
    </EspacePersoContext.Provider>
  )
}

export const useEspacePerso = () => useContext(EspacePersoContext)