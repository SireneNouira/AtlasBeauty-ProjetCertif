// types/user.ts
export interface User {
    id: number;
    email: string;
    roles: string[];
  }
  
  export interface Patient {
    id: number;
    email: string;
    prenom: string;
    nom: string;
  }
  
  export type UserRole = 'user' | 'patient';