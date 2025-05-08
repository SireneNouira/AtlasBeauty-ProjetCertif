// components/espacePerso/Sidebar.tsx
'use client'

import Link from 'next/link'
import {
  FaFolderOpen,
  FaRegImage,
  FaBell,
  FaPlus,
  FaSignOutAlt,
  
} from 'react-icons/fa'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6">
      <nav className="flex-1 space-y-2">
        <Link
          href="/espacePerso"
          className="flex items-center px-4 py-2 bg-sky-300 text-blue-600 rounded-lg"
        >
          <FaFolderOpen className="w-5 h-5 mr-3" />
          Mes demandes
        </Link>

        <Link
          href="/espacePerso/personal-data"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <FaRegImage className="w-5 h-5 mr-3" />
          Données personnelles
        </Link>

        <Link
          href="/espacePerso/medical-history"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <FaBell className="w-5 h-5 mr-3" />
          Antécédents médicaux
        </Link>

        <Link
          href="/espacePerso/new-request"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <FaPlus className="w-5 h-5 mr-3" />
          Nouvelle demande
        </Link>

        <Link href="/patient/chat"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >        Message
                  </Link>
      </nav>

      <Link
        href="/api/logout"
        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition mt-auto"
      >
        <FaSignOutAlt className="w-5 h-5 mr-3" />
        Déconnexion
      </Link>
    </aside>
  )
}
