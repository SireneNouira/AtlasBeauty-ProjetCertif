"use client";

import { useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";

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
          router.push("/");
        } else if (response.data.userType === "User") {
          router.push("/");
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
    <div className="max-w-md mx-auto p-6 mt-8 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">
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
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>

        {error && (
          <div className="p-3 text-red-600 bg-red-50 rounded-md text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}