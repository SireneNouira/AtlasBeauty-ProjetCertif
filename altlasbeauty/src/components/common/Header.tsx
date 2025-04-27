'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getMe } from "@/utils/auth";

type HeaderProps = {
  isTransparent?: boolean;
  onTogglePresentation?: () => void;
};

function Header({ isTransparent = false, onTogglePresentation }: HeaderProps) {
  const { isAuthenticated, loading } = useAuth();
  const [userType, setUserType] = useState<"Patient" | "User" | null>(null);
  const [loadingUserType, setLoadingUserType] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserType = async () => {
        try {
          const userData = await getMe();
          console.log("User data:", userData); // Ajoutez ce log pour vérifier
          if (userData) {
            setUserType(userData.userType);
          }
        } catch (error) {
          console.error("Failed to fetch user type:", error);
        } finally {
          setLoadingUserType(false);
        }
      };
      fetchUserType();
    } else {
      setUserType(null);
      setLoadingUserType(false);
    }
  }, [isAuthenticated]);

  const getProfileLink = () => {
    if (!isAuthenticated) return "/auth";
    if (userType === "User") return "/espaceAssistant";
    return "/espacePerso";
  };

  const getProfileText = () => {
    if (loadingUserType && isAuthenticated) return "Chargement...";
    if (userType === "User") return "Espace Assistant";
    return "Espace Perso";
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-32 py-4 bg-pink-100 h-25 transition-all duration-300 ${
        isTransparent ? "" : "shadow-md z-50"
      }`}
    >
      <Link href="/" className="flex items-center gap-2">
      <Image
        src="/atlas/logo.png"
        alt="AtlasBeauty"
        width={120}
        height={20}
        className=" brightness-[.85] contrast-110 saturate-125"
      />
      </Link>

      <div className="flex items-center gap-4">
        {/* Réseaux sociaux */}
        <div className="flex items-center gap-4 bg-white/60 px-4 py-2 rounded-xl shadow-sm mr-3">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800 transition"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://wa.me/21652869696"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-700 transition"
          >
            <FaWhatsapp size={20} />
          </a>
          <div className="ml-2 text-sm leading-tight">
            <p className="text-gray-700">WhatsApp</p>
            <p className="text-md font-semibold text-gray-900">
              +216 52 86 96 96
            </p>
          </div>
        </div>

        <button
          onClick={onTogglePresentation}
          className="flex items-center gap-2 text-md font-semibold text-white bg-blue-500 hover:bg-blue-400 transition px-4 py-2 rounded-xl shadow"
        >
          Interventions <FiChevronDown size={18} />
        </button>

        <Link
          href="/auth?action=register"
          className="text-md font-semibold text-blue-700 hover:text-blue-900 transition px-3 py-2 rounded-xl hover:bg-white/50"
        >
          Devis Gratuit
        </Link>

        <button className="text-md font-semibold text-blue-700 hover:text-blue-900 transition px-3 py-2 rounded-xl hover:bg-white/50">
          Tarifs
        </button>

        <Link
          href={getProfileLink()}
          className="text-md font-semibold text-blue-700 hover:text-blue-900 transition px-3 py-2 rounded-xl hover:bg-white/50"
        >
          {getProfileText()}
        </Link>
      </div>
    </header>
  );
}

export default Header;
