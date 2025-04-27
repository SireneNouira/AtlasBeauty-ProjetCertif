"use client";

import { useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/login_check", {
        email,
        password,
      });

      // Le cookie est automatiquement stocké par le navigateur
      // Vous pouvez vérifier si la réponse contient des infos supplémentaires
      if (response.data.message === "Connexion réussie") {
        // Rediriger en fonction du type d'utilisateur
        if (response.data.userType === "Patient") {
        router.refresh(); 
         router.push("/espacePerso");
          

        } else if (response.data.userType === "User") {
          router.push("/espaceAssistant");
        } else {
          router.push("/");
        }
      } else {
        setError("Authentification réussie mais redirection échouée");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Erreur lors de l'authentification");
        }
      } else {
        setError("Erreur de connexion au serveur");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-pink-50 py-4 px-48 rounded-2xl">
      <div className="bg-white  min-w-lg px-10 py-5 rounded-2xl shadow-lg">
        {/* Header with logo and titles */}
        <div className="flex flex-col items-center mb-3">
          <Image
            src="/atlas/logo.png"
            alt="Atlas Beauty"
            width={90}
            height={80}
            className="brightness-[.85] contrast-110 saturate-125"
          />
          <p className="mt-1 text-sm text-gray-400 italic">
            Chirurgie esthétique en Tunisie
          </p>
          <p className="mt-2 text-blue-600 text-sm">
            Veuillez entrer votre E-mail et votre mot de passe.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-10">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Votre e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Mots de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 uppercase bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion en cours..." : "CONNEXION"}
          </button>

          {error && (
            <div className="mt-4 p-3 text-red-600 bg-red-50 rounded-md text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
