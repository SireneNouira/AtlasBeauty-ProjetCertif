"use client";

import { useEffect, useState, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import api from "@/utils/api";
import { Message, UserRole } from "@/types/message";

interface ChatProps {
  receiverId: number;
  receiverType: UserRole;
  currentUserType: UserRole;
  currentUserId: number;
}

const Chat = ({ receiverId, receiverType, currentUserType, currentUserId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupérer les messages existants
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get<{hydra: {member: Message[]}}>("/api/messages", {
          params: { receiverId, receiverType },
        });
        setMessages(response.data.hydra.member);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [receiverId, receiverType]);

  // Configuration Mercure
  useEffect(() => {
    const mercureToken = document.cookie
      .split("; ")
      .find(row => row.startsWith("mercureAuthorization="))
      ?.split("=")[1];

    if (!mercureToken) {
      setError("Token Mercure manquant");
      return;
    }

    const eventSourceInit: EventSourceInit = {
      withCredentials: true,
      // @ts-ignore - La propriété headers est bien prise en compte via notre extension de type
      headers: { Authorization: `Bearer ${mercureToken}` }
    };

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_MERCURE_URL}/.well-known/mercure?topic=http://example.com/messages/${currentUserType}/${currentUserId}`,
      eventSourceInit
    );

    eventSource.onmessage = (e: MessageEvent) => {
      try {
        const message: Message = JSON.parse(e.data);
        setMessages(prev => [...prev, message]);
      } catch (parseError) {
        console.error("Erreur de parsing du message:", parseError);
      }
    };

    eventSource.onerror = (e: Event) => {
      console.error("Erreur EventSource:", e);
      setError("Problème de connexion en temps réel");
    };

    return () => eventSource.close();
  }, [currentUserType, currentUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        content: newMessage,
        [`sender${capitalizeFirstLetter(currentUserType)}`]: currentUserId,
        [`receiver${capitalizeFirstLetter(receiverType)}`]: receiverId,
      };

      await api.post("/api/messages", messageData);
      setNewMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    }
  };

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (loading) return <div className="p-4 text-center">Chargement...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-full">
      {/* ... (le reste du JSX reste identique mais avec le typage TS) */}
    </div>
  );
}

export default Chat;