'use client'
import Link from "next/link"
import { FaFolderOpen, FaRegIdCard, FaFileMedical, FaFileSignature, FaRegImage, FaStethoscope, FaHeartbeat, FaSignOutAlt, FaComments } from 'react-icons/fa'

type SidebarProps = {
  currentView: string
  onNavigate: (view: string) => void
  hasNewMessage?: boolean
}

export default function Sidebar({ currentView, onNavigate, hasNewMessage = false }: SidebarProps) {
  // Palette medicale accessible : bleu pastel (actif), bleu-vert, blanc, gris doux
  const isActive = (view: string) => currentView === view

  // Pour navigation clavier : style focus renforcé
  const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-sky-50 to-white border-r border-sky-100 flex flex-col p-4"  aria-label="Menu latéral espace personnel">
      <nav className="flex-1 space-y-1" aria-label="Menu de navigation">
        <button
          onClick={() => onNavigate('info')}
          className={`flex items-center w-full px-4 py-2 rounded-xl font-medium transition ${focusRing} ${
            isActive('info')
              ? 'bg-sky-100 text-sky-700 shadow-inner'
              : 'text-gray-700 hover:bg-sky-50'
          }`}
          aria-current={isActive('info') ? "page" : undefined}
        >
          <FaFolderOpen className="w-5 h-5 mr-3" aria-hidden />
          Accueil
        </button>

        <button
          onClick={() => onNavigate('personal-data')}
          className={`flex items-center w-full px-4 py-2 rounded-xl font-medium transition ${focusRing} ${
            isActive('personal-data')
              ? 'bg-sky-100 text-sky-700 shadow-inner'
              : 'text-gray-700 hover:bg-sky-50'
          }`}
          aria-current={isActive('personal-data') ? "page" : undefined}
        >
          <FaRegIdCard className="w-5 h-5 mr-3" aria-hidden />
          Données personnelles
        </button>

        <button
          onClick={() => onNavigate('devis')}
          className={`flex items-center w-full px-4 py-2 rounded-xl font-medium transition ${focusRing} ${
            isActive('devis')
              ? 'bg-sky-100 text-sky-700 shadow-inner'
              : 'text-gray-700 hover:bg-sky-50'
          }`}
          aria-current={isActive('devis') ? "page" : undefined}
        >
          <FaFileMedical className="w-5 h-5 mr-3" aria-hidden />
          Mes devis
        </button>

        <button
          onClick={() => onNavigate('edit-devis')}
          className={`flex items-center w-full px-4 py-2 rounded-xl font-medium transition ${focusRing} ${
            isActive('edit-devis')
              ? 'bg-sky-100 text-sky-700 shadow-inner'
              : 'text-gray-700 hover:bg-sky-50'
          }`}
          aria-current={isActive('edit-devis') ? "page" : undefined}
        >
          <FaFileSignature className="w-5 h-5 mr-3" aria-hidden />
          Voir ma demande
        </button>

        <button
          onClick={() => onNavigate('photos')}
          className={`flex items-center w-full px-4 py-2 rounded-xl font-medium transition ${focusRing} ${
            isActive('photos')
              ? 'bg-sky-100 text-sky-700 shadow-inner'
              : 'text-gray-700 hover:bg-sky-50'
          }`}
          aria-current={isActive('photos') ? "page" : undefined}
        >
          <FaRegImage className="w-5 h-5 mr-3" aria-hidden />
          Mes photos
        </button>

        <button
          onClick={() => onNavigate('bilan')}
          className={`flex items-center w-full px-4 py-2 rounded-xl font-medium transition ${focusRing} ${
            isActive('bilan')
              ? 'bg-sky-100 text-sky-700 shadow-inner'
              : 'text-gray-700 hover:bg-sky-50'
          }`}
          aria-current={isActive('bilan') ? "page" : undefined}
        >
          <FaStethoscope className="w-5 h-5 mr-3" aria-hidden />
          Conseils & bilan
        </button>

        <button
          onClick={() => onNavigate('post-op')}
          className={`flex items-center w-full px-4 py-2 rounded-xl font-medium transition ${focusRing} ${
            isActive('post-op')
              ? 'bg-sky-100 text-sky-700 shadow-inner'
              : 'text-gray-700 hover:bg-sky-50'
          }`}
          aria-current={isActive('post-op') ? "page" : undefined}
        >
          <FaHeartbeat className="w-5 h-5 mr-3" aria-hidden />
          Post-opératoire
        </button>

        <Link href="/patient/chat" tabIndex={0}
          className={`flex items-center px-4 py-2 rounded-xl font-medium transition ${focusRing} text-gray-700 hover:bg-sky-50 relative`}
          aria-label="Accéder à la messagerie"
        >
          <FaComments className="w-5 h-5 mr-3" aria-hidden />
          Messagerie
          {hasNewMessage && (
            <span className="ml-2 w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse absolute right-4" aria-label="Nouveau message" />
          )}
        </Link>
      </nav>

      <a
        href="/api/logout"
        className={`flex items-center px-4 py-2 rounded-xl font-medium transition text-gray-700 hover:bg-rose-50 mt-6 ${focusRing}`}
      >
        <FaSignOutAlt className="w-5 h-5 mr-3" aria-hidden />
        Déconnexion
      </a>
    </aside>
  )
}
