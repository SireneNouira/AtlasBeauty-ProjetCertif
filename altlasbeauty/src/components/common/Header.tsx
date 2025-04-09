import React from "react";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
function Header({ isTransparent = false }) {
  return (
    <header
    className={`fixed top-0 left-0 w-full flex justify-between items-center px-32 py-4 bg-pink-100 h-25 transition-all duration-300 ${
      isTransparent ? "" : "shadow-md z-50"
    }`}
    >
      <Image src="/atlas/logo.png" alt="AtlasBeauty" width={120} height={20} />
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram
              // className="text-pink-500 hover:text-pink-700"
              size={20}
            />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF
              // className="text-blue-600 hover:text-blue-800"
              size={20}
            />
          </a>
          <a
            href="https://wa.me/21652869696"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={20} />
          </a>
          <p className="gap-0 leading-none">
            WhatsApp <br />
            <span className="text-lg font-medium">+216 52 86 96 96</span>
          </p>
        </div>
        <button className="flex items-center gap-2 text-lg font-medium hover:text-blue-700 bg-blue-500 hover:bg-blue-400 text-white py-1 px-3  rounded-lg">
          Interventions <FiChevronDown size={20} />
        </button>

        <button className=" hover:text-blue-500  text-lg font-medium  rounded-lg">
          Devis Gratuit
        </button>
        <button className="text-lg hover:text-blue-500 "> Tarifs </button>
        <button className="text-lg hover:text-blue-500 ">Espace Perso</button>
      </div>
    </header>
  );
}

export default Header;
