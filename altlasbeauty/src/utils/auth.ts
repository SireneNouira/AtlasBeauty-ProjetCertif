// utils/auth.ts
//helper pour l'authentification
import api from '@/utils/api';

export interface MeData {
  id: number;
  email: string;
  prenom: string | null;
  nom: string | null;
  userType: 'Patient' | 'User';
}

export const getMe = async (): Promise<MeData | null> => {
  try {
    const response = await api.get<MeData>('/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
};