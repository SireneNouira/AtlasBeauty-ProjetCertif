export interface Message {
    id: number;
    content: string;
    createdAt: string;
    sender: {
      id: number;
      type: 'user' | 'patient';
    };
    receiver: {
      id: number;
      type: 'user' | 'patient';
    };
  }
  
  export type UserRole = 'user' | 'patient';
  
  export interface ChatParams {
    receiverId: number;
    receiverType: UserRole;
    currentUserType: UserRole;
    currentUserId: number;
  }