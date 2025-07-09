// components/espacePerso/Sidebar.tsx
'use client'
import Link from "next/link"

import { FaFolderOpen, FaRegImage, FaBell, FaPlus, FaSignOutAlt, FaComments } from 'react-icons/fa'

type SidebarProps = {
  currentView: string
  onNavigate: (view: string) => void
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const isActive = (view: string) => currentView === view

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6">
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => onNavigate('info')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
            isActive('info') 
              ? 'bg-sky-300 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaFolderOpen className="w-5 h-5 mr-3" />
          Acceuil
        </button>

        <button
          onClick={() => onNavigate('personal-data')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
            isActive('personal-data')
              ? 'bg-sky-300 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaRegImage className="w-5 h-5 mr-3" />
          Données personnelles
        </button>

        <button
          onClick={() => onNavigate('devis')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
            isActive('medical-history')
              ? 'bg-sky-300 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaBell className="w-5 h-5 mr-3" />
         Devis
        </button>

        <button
          onClick={() => onNavigate('edit-devis')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
            isActive('new-request')
              ? 'bg-sky-300 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaPlus className="w-5 h-5 mr-3" />
          Voir demande de devis
        </button>

        <Link href="/patient/chat"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >        Message
                  </Link>
      </nav>

      <a
        href="/api/logout"
        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition mt-auto"
      >
        <FaSignOutAlt className="w-5 h-5 mr-3" />
        Déconnexion
      </a>
    </aside>
  )
}