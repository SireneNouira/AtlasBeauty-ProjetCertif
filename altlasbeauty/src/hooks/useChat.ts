// hooks/useChat.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import api from '@/utils/api';
import { Message, ChatParticipant } from '@/types/message';
import { UserRole } from '@/types/user';

// Normalise tous les messages entrants pour que la détection du sender fonctionne TOUJOURS
function normalizeMessage(msg: any): Message {
  // senderUser string --> { id }
  if (typeof msg.senderUser === "string") {
    const match = msg.senderUser.match(/\/api\/users\/(\d+)/);
    msg.senderUser = match ? { id: Number(match[1]) } : undefined;
  }
  // receiverUser string --> { id }
  if (typeof msg.receiverUser === "string") {
    const match = msg.receiverUser.match(/\/api\/users\/(\d+)/);
    msg.receiverUser = match ? { id: Number(match[1]) } : undefined;
  }
  // Tu peux ajouter d'autres adaptations ici si tu ajoutes des types
  return msg;
}

export const useChat = (
  currentUserId: number,
  currentUserType: UserRole,
  receiverId: number,
  receiverType: UserRole
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

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

  // Récupération des messages (fetch initial)
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const isAssistant = currentUserType === 'user';
      const assistantId = isAssistant ? currentUserId : receiverId;
      const patientId = isAssistant ? receiverId : currentUserId;

      const [res1, res2] = await Promise.all([
        api.get('/messages', {
          params: {
            'senderUser.id': assistantId,
            'receiverPatient.id': patientId,
            'order[createdAt]': 'asc'
          }
        }),
        api.get('/messages', {
          params: {
            'senderPatient.id': patientId,
            'receiverUser.id': assistantId,
            'order[createdAt]': 'asc'
          }
        })
      ]);

      const allMessages = [
        ...(res1.data['hydra:member'] || res1.data.member || []),
        ...(res2.data['hydra:member'] || res2.data.member || [])
      ]
        .map(normalizeMessage)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setMessages(allMessages);
    } catch (err) {
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentUserType, receiverId, receiverType]);

  // Connexion Mercure
  const initMercure = useCallback(async () => {
    try {
      const tokenResponse = await api.get<{ token: string }>('/mercure-token');
      const token = tokenResponse.data.token;

      const topics = [
        `http://example.com/chat/${currentUserType}-${currentUserId}`,
        `http://example.com/chat/${receiverType}-${receiverId}`
      ].map(encodeURIComponent).join('&topic=');

      const url = `http://localhost:3001/.well-known/mercure?topic=${topics}`;

      const es = new EventSourcePolyfill(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      es.onmessage = (e) => {
        try {
          const incoming: Message = normalizeMessage(JSON.parse(e.data));
          setMessages(prev => {
            const filtered = prev.filter(m => {
              // Retire l’optimiste équivalent ou tout doublon d’id
              if (
                typeof m.id === "string" && m.id.startsWith("temp-") &&
                m.content === incoming.content &&
                Math.abs(new Date(m.createdAt).getTime() - new Date(incoming.createdAt).getTime()) < 4000
              ) return false;
              if (m.id === incoming.id) return false;
              return true;
            });
            return [...filtered, incoming];
          });
        } catch (err) {}
      };

      es.onerror = (e) => {
        setError('Problème de connexion en temps réel');
      };

      eventSourceRef.current = es;
    } catch (err) {
      setError('Erreur de connexion Mercure');
    }
  }, [currentUserId, currentUserType, receiverId, receiverType]);

  // Envoi d'un message avec affichage optimiste
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const optimisticMessage: Message = {
      id: 'temp-' + Date.now(),
      content,
      createdAt: new Date().toISOString(),
      ...(currentUserType === 'user'
        ? { senderUser: { id: currentUserId } }
        : { senderPatient: `/api/patients/${currentUserId}` }
      ),
      ...(receiverType === 'user'
        ? { receiverUser: { id: receiverId } }
        : { receiverPatient: `/api/patients/${receiverId}` }
      )
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const messageData = {
        content,
        [`sender${currentUserType === 'user' ? 'User' : 'Patient'}`]: `/api/${currentUserType === 'user' ? 'users' : 'patients'}/${currentUserId}`,
        [`receiver${receiverType === 'user' ? 'User' : 'Patient'}`]: `/api/${receiverType === 'user' ? 'users' : 'patients'}/${receiverId}`
      };

      await api.post('/messages', messageData);
      // On attend Mercure pour la confirmation
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
    }
  }, [currentUserId, currentUserType, receiverId, receiverType]);

  // Mount / Unmount
  useEffect(() => {
    fetchMessages();
    initMercure();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
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
