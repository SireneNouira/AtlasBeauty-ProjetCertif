// // components/espacePerso/MeInfo.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import api from '@/utils/api'
// import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa'


// type RawMeResponse = {
//   member: [number, string, string, string, string]
// }
// interface MeInfoProps {
//   onConsult: () => void
// }
// export default function MeInfo({ onConsult }: MeInfoProps) {
//   const [me, setMe] = useState<RawMeResponse['member'] | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     api
//       .get<RawMeResponse>('/me')
//       .then(res => setMe(res.data.member))
//       .catch(err => setError(err.message || 'Une erreur est survenue'))
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) return <p>Chargement…</p>
//   if (error) return <p className="text-red-500">Erreur : {error}</p>
//   if (!me) return <p>Aucune donnée utilisateur disponible.</p>

//   const [, , firstName, lastName] = me
//   const today = new Date().toLocaleDateString('fr-FR', {
//     weekday: 'long',
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   })

//   return (
//     <div className="space-y-8">
//       {/* ─── BLOC BLEU-CIEL AVEC CONTENU BLANC ─── */}
//       <div className="relative bg-white rounded-2xl shadow-lg p-8">
//         <h2 className="text-blue-600 text-xl font-semibold mb-4">
//           Bonjour {firstName} {lastName} et bienvenue dans votre Espace Perso.
//         </h2>

//         <button
//           onClick={onConsult}
//           className="absolute top-8 right-8 flex items-center bg-white bg-opacity-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-opacity-75 transition"
//         >
//           ▶ Consulter mon dossier
//         </button>

//         <p className="text-gray-700">
//           Aujourd'hui, {today}, votre demande de <strong>Lifting temporal</strong> est à l'état suivant :
//         </p>
//         <ol className="mt-4 list-decimal list-inside text-gray-400 space-y-1">
//           <li>En attente de photos</li>
//           <li>En attente du diagnostic du chirurgien et du devis</li>
//           <li>Diagnostic et devis établis, en attente d'acceptation de votre part</li>
//           <li>Devis accepté, en attente de confirmation de votre date d'intervention</li>
//           <li>Intervention programmée, détails du voyage reçus</li>
//           <li>Intervention réalisée</li>
//         </ol>
//       </div>

//       {/* ─── FOOTER / ADRESSE ET RÉSEAUX ─── */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center text-gray-300 text-sm">
//         <div className="space-y-1">
//           <p>Adresse : 14, rue Imam Abou Hanifa – 2070 La Marsa – Tunisie</p>
//           <p>Tél. : 00 216 71 742 160 / 00 216 27 432 000</p>
//         </div>
//         <div className="flex space-x-4 mt-4 sm:mt-0">
//           <Link href="https://wa.me/21671742160">
//             <FaWhatsapp className="w-5 h-5 hover:text-gray-500 transition" />
//           </Link>
//           <Link href="https://instagram.com/atlas.beauty">
//             <FaInstagram className="w-5 h-5 hover:text-gray-500 transition" />
//           </Link>
//           <Link href="https://facebook.com/atlasbeauty">
//             <FaFacebookF className="w-5 h-5 hover:text-gray-500 transition" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }
// components/espacePerso/MeInfo.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import api from '@/utils/api'

// type MeResponse = {
//   id: number
//   email: string
//   prenom: string
//   nom: string
//   civilite: string
//   annee_naissance?: number
//   adress?: string
//   code_postal?: string
//   ville?: string
//   pays: string
//   profession: string
//   tel: string
//   poids?: number
//   taille?: number
//   tabac?: boolean
//   alcool?: boolean
//   antecedents?: string
//   photos: Array<{
//     id: number
//     path: string
//     uploadedAt?: string
//   }>
//   demandeDevis?: {
//     id: number
//     note?: string
//     date_souhaite?: string
//     status: string
//     date_creation?: string
//     intervention_1?: string
//     intervention_2?: string
//   }
//   devis?: {
//     id: number
//     fichier: string
//     date_operation?: string
//     is_signed: boolean
//     date_sejour?: string
//   }
//   status: {
//     hasPhotos: boolean
//     hasDemandeDevis: boolean
//     hasDevis: boolean
//     devisSigned: boolean
//     demandeDevisStatus?: string
//   }
// }

// export default function MeInfo() {
//   const [me, setMe] = useState<MeResponse | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     api.get<MeResponse>('/me')
//       .then(res => setMe(res.data))
//       .catch(err => setError(err.message || 'Une erreur est survenue'))
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) return <p>Chargement…</p>
//   if (error) return <p className="text-red-500">Erreur : {error}</p>
//   if (!me) return <p>Aucune donnée utilisateur disponible.</p>

//   const getCurrentStep = () => {
//     if (me.status.devisSigned) return 5
//     if (me.status.hasDevis) return 4
//     if (me.status.demandeDevisStatus === 'diagnostic_fait') return 3
//     if (me.status.hasPhotos) return 2
//     return 1
//   }

//   const currentStep = getCurrentStep()

//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold">
//         Bonjour {me.prenom} {me.nom}
//       </h1>
      
//       {/* Affichage des informations personnelles */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <h2 className="font-semibold">Informations personnelles</h2>
//           <p>Email: {me.email}</p>
//           <p>Téléphone: {me.tel}</p>
//           <p>Adresse: {me.adress}, {me.code_postal} {me.ville}, {me.pays}</p>
//         </div>
        
//         <div>
//           <h2 className="font-semibold">Informations médicales</h2>
//           <p>Profession: {me.profession}</p>
//           <p>Antécédents: {me.antecedents || 'Aucun'}</p>
//         </div>
//       </div>
      
//       {/* Suivi de la demande */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">État de votre demande</h2>
//         <div className="space-y-2">
//           {renderStep(1, currentStep, "En attente de photos")}
//           {renderStep(2, currentStep, "Photos reçues - En attente du diagnostic")}
//           {renderStep(3, currentStep, "Diagnostic effectué - Devis en préparation")}
//           {renderStep(4, currentStep, "Devis disponible - En attente de signature")}
//           {renderStep(5, currentStep, "Devis signé - Intervention programmée")}
//         </div>
//       </div>
      
//       {/* Photos */}
//       {me.photos.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">Vos photos</h2>
//           <div className="flex flex-wrap gap-4">
//             {me.photos.map(photo => (
//               <img 
//                 key={photo.id} 
//                 src={`/uploads/${photo.path}`} 
//                 alt="Photo médicale" 
//                 className="w-32 h-32 object-cover rounded"
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// function renderStep(step: number, currentStep: number, text: string) {
//   const isCompleted = step < currentStep
//   const isCurrent = step === currentStep
  
//   return (
//     <div className={`p-4 rounded-lg border ${
//       isCompleted ? 'bg-green-50 border-green-200' : 
//       isCurrent ? 'bg-blue-50 border-blue-200' : 
//       'bg-gray-50 border-gray-200'
//     }`}>
//       <div className="flex items-center gap-2">
//         {isCompleted ? (
//           <span className="text-green-500">✓</span>
//         ) : (
//           <span className="text-gray-400">{step}.</span>
//         )}
//         <span className={isCurrent ? 'font-medium text-blue-600' : ''}>
//           {text}
//           {isCurrent && ' (étape actuelle)'}
//         </span>
//       </div>
//     </div>
//   )
// }

// components/espacePerso/MeInfo.tsx
'use client'

import Link from 'next/link'
import { useEspacePerso } from '@/contexts/EspacePersoContext'
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa'

interface MeInfoProps {
  onConsult: () => void
}

export default function MeInfo({ onConsult }: MeInfoProps) {
  const { patientData, loading, error } = useEspacePerso()

  if (loading) return <p>Chargement…</p>
  if (error) return <p className="text-red-500">Erreur : {error}</p>
  if (!patientData) return <p>Aucune donnée utilisateur disponible.</p>

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const getCurrentStep = () => {
    if (patientData.status.devisSigned) return 5
    if (patientData.status.hasDevis) return 4
    if (patientData.status.demandeDevisStatus === 'diagnostic_fait') return 3
    if (patientData.status.hasPhotos) return 2
    return 1
  }

  const currentStep = getCurrentStep()

  return (
    <div className="space-y-8">
      {/* ─── BLOC BLEU-CIEL AVEC CONTENU BLANC ─── */}
      <div className="relative bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-blue-600 text-xl font-semibold mb-4">
          Bonjour {patientData.prenom} {patientData.nom} et bienvenue dans votre Espace Perso.
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
        <ol className="mt-4 list-decimal list-inside space-y-1">
          <li className={currentStep > 1 ? 'text-green-500' : currentStep === 1 ? 'text-blue-500 font-medium' : 'text-gray-400'}>
            {currentStep > 1 ? '✓ ' : ''}En attente de photos
            {currentStep === 1 && ' (étape actuelle)'}
          </li>
          <li className={currentStep > 2 ? 'text-green-500' : currentStep === 2 ? 'text-blue-500 font-medium' : 'text-gray-400'}>
            {currentStep > 2 ? '✓ ' : ''}En attente du diagnostic du chirurgien et du devis
            {currentStep === 2 && ' (étape actuelle)'}
          </li>
          <li className={currentStep > 3 ? 'text-green-500' : currentStep === 3 ? 'text-blue-500 font-medium' : 'text-gray-400'}>
            {currentStep > 3 ? '✓ ' : ''}Diagnostic et devis établis, en attente d'acceptation de votre part
            {currentStep === 3 && ' (étape actuelle)'}
          </li>
          <li className={currentStep > 4 ? 'text-green-500' : currentStep === 4 ? 'text-blue-500 font-medium' : 'text-gray-400'}>
            {currentStep > 4 ? '✓ ' : ''}Devis accepté, en attente de confirmation de votre date d'intervention
            {currentStep === 4 && ' (étape actuelle)'}
          </li>
          <li className={currentStep > 5 ? 'text-green-500' : currentStep === 5 ? 'text-blue-500 font-medium' : 'text-gray-400'}>
            {currentStep > 5 ? '✓ ' : ''}Intervention programmée, détails du voyage reçus
            {currentStep === 5 && ' (étape actuelle)'}
          </li>
          <li className={currentStep > 6 ? 'text-green-500' : currentStep === 6 ? 'text-blue-500 font-medium' : 'text-gray-400'}>
            {currentStep > 6 ? '✓ ' : ''}Intervention réalisée
            {currentStep === 6 && ' (étape actuelle)'}
          </li>
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