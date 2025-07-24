import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-stone-800 text-white py-10 px-4 sm:px-6 md:px-20"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <img src="/atlas/nom.png" alt="AtlasBeauty" className="mb-4 w-32 sm:w-40" />
          <p className="text-sm text-gray-300">
            AtlasBeauty est une agence de tourisme médical Franco-Tunisienne
            spécialisée en chirurgie réparatrice et esthétique, en coopération
            avec les meilleurs chirurgiens de Tunisie.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Contact</h3>
          <p className="text-sm">
            📞 WhatsApp : <br />
            <span className="text-base font-medium">+216 00 00 00 00</span>
          </p>
          <p className="text-sm mt-2">✉️ contact@atlas-beauty.fr</p>
        </div>

        {/* Liens utiles */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Liens utiles</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="hover:underline">Qui sommes-nous ?</a></li>
            <li><a href="#" className="hover:underline">Tarifs Chirurgie Esthétique</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:underline">Mentions légales</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Restez informé</h3>
          <p className="text-sm text-gray-300 mb-3">
            Soyez informé(e) en avant-première de nos offres spéciales séjour + intervention et de nos nouveautés.
          </p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Votre email"
              className="px-3 py-2 rounded bg-white text-black text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-pink-200 hover:bg-pink-400 text-black py-2 rounded text-sm font-medium"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="mt-10 flex justify-center space-x-6">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-500 hover:text-pink-600" size={24} />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF className="text-blue-500 hover:text-blue-600" size={24} />
        </a>
        <a href="https://wa.me/21600000000" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="text-green-500 hover:text-green-600" size={24} />
        </a>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-gray-400">
        <p>© 2025 AtlasBeauty. Tous droits réservés.</p>
        <p className="mt-1">Site réalisé avec ❤️ pour votre bien-être.</p>
      </div>
    </motion.footer>
  );
}

export default Footer;
