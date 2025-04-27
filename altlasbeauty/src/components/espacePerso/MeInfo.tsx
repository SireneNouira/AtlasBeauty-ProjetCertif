// components/espacePerso/MeInfo.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/utils/api'
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa'


type RawMeResponse = {
  member: [number, string, string, string, string]
}
interface MeInfoProps {
  onConsult: () => void
}
export default function MeInfo({ onConsult }: MeInfoProps) {
  const [me, setMe] = useState<RawMeResponse['member'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<RawMeResponse>('/me')
      .then(res => setMe(res.data.member))
      .catch(err => setError(err.message || 'Une erreur est survenue'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Chargement…</p>
  if (error) return <p className="text-red-500">Erreur : {error}</p>
  if (!me) return <p>Aucune donnée utilisateur disponible.</p>

  const [, , firstName, lastName] = me
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* ─── BLOC BLEU-CIEL AVEC CONTENU BLANC ─── */}
      <div className="relative bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-blue-600 text-xl font-semibold mb-4">
          Bonjour {firstName} {lastName} et bienvenue dans votre Espace Perso.
        </h2>

        <button
          onClick={onConsult}
          className="absolute top-8 right-8 flex items-center bg-white bg-opacity-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-opacity-75 transition"
        >
          ▶ Consulter mon dossier
        </button>

        <p className="text-gray-700">
          Aujourd'hui, {today}, votre demande de <strong>Lifting temporal</strong> est à l'état suivant :
        </p>
        <ol className="mt-4 list-decimal list-inside text-gray-400 space-y-1">
          <li>En attente de photos</li>
          <li>En attente du diagnostic du chirurgien et du devis</li>
          <li>Diagnostic et devis établis, en attente d'acceptation de votre part</li>
          <li>Devis accepté, en attente de confirmation de votre date d'intervention</li>
          <li>Intervention programmée, détails du voyage reçus</li>
          <li>Intervention réalisée</li>
        </ol>
      </div>

      {/* ─── FOOTER / ADRESSE ET RÉSEAUX ─── */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center text-gray-300 text-sm">
        <div className="space-y-1">
          <p>Adresse : 14, rue Imam Abou Hanifa – 2070 La Marsa – Tunisie</p>
          <p>Tél. : 00 216 71 742 160 / 00 216 27 432 000</p>
        </div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <Link href="https://wa.me/21671742160">
            <FaWhatsapp className="w-5 h-5 hover:text-gray-500 transition" />
          </Link>
          <Link href="https://instagram.com/atlas.beauty">
            <FaInstagram className="w-5 h-5 hover:text-gray-500 transition" />
          </Link>
          <Link href="https://facebook.com/atlasbeauty">
            <FaFacebookF className="w-5 h-5 hover:text-gray-500 transition" />
          </Link>
        </div>
      </div>
    </div>
  )
}
