import { useEffect, useState } from 'react';
import api from '../utils/api';

type UserProfile = {
  id: number;
  email: string;
  prenom: string;
  nom: string;
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/me'); // Appel à la route protégée "/me"
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>ID: {profile.id}</p>
      <p>Email: {profile.email}</p>
      <p>Name: {profile.prenom} {profile.nom}</p>
    </div>
  );
};

export default ProfilePage;
