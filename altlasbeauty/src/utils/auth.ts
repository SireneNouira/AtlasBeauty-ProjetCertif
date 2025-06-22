
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
    const response = await api.get<any>('/me');
    
    // Adaptez la réponse de l'API à votre interface
    if (Array.isArray(response.data?.member)) {
      const [id, email, prenom, nom, userType] = response.data.member;
      return {
        id,
        email,
        prenom,
        nom,
        userType
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
};