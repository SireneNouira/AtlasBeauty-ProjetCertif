// hooks/useChat.ts
'use client'

import { useState, useEffect, useCallback } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import api from '@/utils/api';
import { Message, ChatParticipant } from '@/types/message';
import { UserRole } from '@/types/user';

export const useChat = (
  currentUserId: number,
  currentUserType: UserRole,
  receiverId: number,
  receiverType: UserRole
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSourcePolyfill | null>(null);

  // Format participants
  const currentParticipant: ChatParticipant = {
    id: currentUserId,
    type: currentUserType,
    name: currentUserType === 'patient' ? 'Patient' : 'Assistant'
  };

  const receiverParticipant: ChatParticipant = {
    id: receiverId,
    type: receiverType,
    name: receiverType === 'patient' ? 'Patient' : 'Assistant'
  };

// Modifiez la partie fetchMessages comme ceci :
const fetchMessages = useCallback(async () => {
  try {
    setLoading(true);
    const response = await api.get('/messages', {
      params: {
        [`sender${currentUserType === 'user' ? 'User' : 'Patient'}.id`]: currentUserId,
        [`receiver${receiverType === 'user' ? 'User' : 'Patient'}.id`]: receiverId
      }
    });

    // Utilisez directement response.data.member au lieu de response.data.hydra.member
    setMessages(response.data.member || []); // Fallback sur un tableau vide si member est undefined
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erreur détaillée:', (err as any).response?.data || err.message);
    } else {
      console.error('Erreur détaillée:', err);
    }
    setError('Erreur lors du chargement des messages');
  } finally {
    setLoading(false);
  }
}, [currentUserId, currentUserType, receiverId, receiverType]);


  // Initialize Mercure connection
  const initMercure = useCallback(async () => {
    try {
      // Get Mercure token from your API
      const tokenResponse = await api.get<{token: string}>('/mercure-token');
      const token = tokenResponse.data.token;

      const topics = [
        `http://example.com/chat/${currentUserType}-${currentUserId}`,
        `http://example.com/chat/${receiverType}-${receiverId}`
      ].map(encodeURIComponent).join('&topic=');

      const url = `http://localhost:3001/.well-known/mercure?topic=${topics}`;
      
      const es = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      // es.onmessage = (e) => {
      //   try {
      //     const message: Message = JSON.parse(e.data);
      //     setMessages(prev => [...prev, message]);
      //   } catch (parseErr) {
      //     console.error('Error parsing message:', parseErr);
      //   }
      // };

      es.onmessage = (e) => {
        try {
          const incoming: Message = JSON.parse(e.data);
      
          setMessages(prev => {
            // Si on a déjà ce message (même id), on ne le ré-ajoute pas
            if (prev.some(m => m.id === incoming.id)) {
              return prev;
            }
            return [...prev, incoming];
          });
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      
      es.onerror = (e) => {
        console.error('Mercure error:', e);
        setError('Problème de connexion en temps réel');
      };

      setEventSource(es);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion Mercure');
    }
  }, [currentUserId, currentUserType, receiverId, receiverType]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      const messageData = {
        content,
        [`sender${currentUserType === 'user' ? 'User' : 'Patient'}`]: `/api/${currentUserType === 'user' ? 'users' : 'patients'}/${currentUserId}`,
        [`receiver${receiverType === 'user' ? 'User' : 'Patient'}`]: `/api/${receiverType === 'user' ? 'users' : 'patients'}/${receiverId}`
      };

      await api.post('/messages', messageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du message');
      throw err;
    }
  }, [currentUserId, currentUserType, receiverId, receiverType]);

  // Effects
  useEffect(() => {
    fetchMessages();
    initMercure();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [fetchMessages, initMercure]);

  return {
    messages,
    sendMessage,
    currentParticipant,
    receiverParticipant,
    loading,
    error,
    fetchMessages
  };
};