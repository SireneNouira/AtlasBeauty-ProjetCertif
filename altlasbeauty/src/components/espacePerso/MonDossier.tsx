import React, { useState } from 'react'
import Link from 'next/link'

// Composant "Mon Dossier" pour l'espace perso
export default function MonDossier() {
  // Exemple d'état pour les messages (vide ici)
  const [messages] = useState<string[]>([])

  return (
    <div className="space-y-8">
      {/* Bloc général blanc arrondi */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Titre centré */}
        <h1 className="text-center text-blue-600 text-xl font-semibold mb-4">
          Mon dossier
        </h1>

        {/* Navigation par onglets */}
        <ul className="flex justify-center space-x-2 border-t border-b border-gray-200 py-2 text-gray-500 text-sm">
          {[
            'Ma demande',
            'Mes photos',
            'Mon voyage',
            'Mon diagnostic',
            'Mon devis',
            'Conseils et bilan',
            'Post-opératoire',
            'Mes messages',
          ].map((tab) => (
            <li
              key={tab}
              className={
                tab === 'Mes messages'
                  ? 'px-4 py-1 bg-sky-300 text-blue-600 rounded-lg'
                  : 'px-4 py-1 hover:text-blue-600 cursor-pointer'
              }
            >
              {tab}
            </li>
          ))}
        </ul>

        {/* Contenu de l'onglet "Mes messages" */}
        <div className="min-h-[150px] flex flex-col items-start justify-center text-gray-400">
          {messages.length === 0 ? (
            <p>Aucun message</p>
          ) : (
            messages.map((msg, idx) => (
              <p key={idx} className="mb-2 text-gray-700">{msg}</p>
            ))
          )}

          {/* Bouton Nouveau Message */}
          <Link href="/patient/chat">
            <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Nouveau Message
            </button>
          </Link>
        </div>
      </div>

      {/* Footer adresse et réseaux */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center text-gray-300 text-sm">
        <div className="space-y-1 text-center sm:text-left">
          <p>Adresse : 14, rue Imam Abou Hanifa – 2070 La Marsa – Tunisie</p>
          <p>Tél. : 00 216 00 000 000 / 00 216 00 000 000</p>
        </div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <Link href="https://wa.me/21600000000">
            <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 hover:opacity-75" />
          </Link>
          <Link href="https://instagram.com/atlas.beauty">
            <img src="/icons/instagram.svg" alt="Instagram" className="w-5 h-5 hover:opacity-75" />
          </Link>
          <Link href="https://facebook.com/atlasbeauty">
            <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5 hover:opacity-75" />
          </Link>
        </div>
      </div>
    </div>
  )
}
