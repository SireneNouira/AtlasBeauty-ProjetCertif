"use client";

import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function SocialSidebar() {
  return (
    <div className="backdrop-blur-md bg-white/30 p-4 rounded-2xl shadow-lg flex flex-col items-center gap-4 w-60">
      <h2 className="text-base font-semibold">Suivez-nous</h2>
      <ul className="flex flex-col gap-2 text-black text-sm">
        <li className="flex items-center gap-2">
          <Link href="#" className="underline hover:text-blue-500">Atlas Beauty</Link>
          <FaFacebookF className="text-blue-600 text-lg" />
        </li>
        <li className="flex items-center gap-2">
          <Link href="#" className="underline hover:text-pink-500">Atlas Beauty</Link>
          <FaInstagram className="text-pink-500 text-lg" />
        </li>
        <li className="flex items-center gap-2">
          <Link href="#" className="underline hover:text-green-500">Atlas Beauty</Link>
          <FaWhatsapp className="text-green-500 text-lg" />
        </li>
      </ul>

      <div className="flex flex-col gap-2 w-full mt-2">
        <Link href="#" className="bg-blue-500 text-white text-sm py-2 rounded-xl text-center hover:bg-blue-600">Devis Gratuit</Link>
        <Link href="#" className="bg-blue-500 text-white text-sm py-2 rounded-xl text-center hover:bg-blue-600">Tarifs</Link>
        <Link href="#" className="bg-blue-500 text-white text-sm py-2 rounded-xl text-center hover:bg-blue-600">Espace perso</Link>
        <Link href="#" className="bg-blue-500 text-white text-sm py-2 rounded-xl text-center hover:bg-blue-600">Témoignages</Link>
        <Link href="#" className="bg-blue-500 text-white text-sm py-2 rounded-xl text-center hover:bg-blue-600">Blog</Link>
      </div>
    </div>
  );
}