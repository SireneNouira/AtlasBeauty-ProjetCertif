// types/message.ts
import { User, Patient, UserRole } from './user';

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderUser?: User;
  senderPatient?: Patient;
  receiverUser?: User;
  receiverPatient?: Patient;
}

export interface ChatParticipant {
  id: number;
  type: UserRole;
  name: string;
}

export interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  currentParticipant?: ChatParticipant;
  receiverParticipant?: ChatParticipant;
  loading: boolean;
  error: string | null;
}