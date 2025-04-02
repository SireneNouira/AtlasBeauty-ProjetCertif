import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Crée une instance Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Assure-toi que les cookies sont envoyés avec les requêtes
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
