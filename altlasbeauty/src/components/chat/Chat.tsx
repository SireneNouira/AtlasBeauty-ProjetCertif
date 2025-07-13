// components/Chat.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { UserRole } from "@/types/user";
import { UserCircle } from "lucide-react";
interface ChatProps {
  currentUserId: number;
  currentUserType: UserRole;
  receiverId: number;
  receiverType: UserRole;
}

export const Chat = ({
  currentUserId,
  currentUserType,
  receiverId,
  receiverType,
}: ChatProps) => {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    currentParticipant,
    receiverParticipant,
    loading,
    error,
  } = useChat(currentUserId, currentUserType, receiverId, receiverType);

  function isMessageFromCurrentUser(message, currentUserId, currentUserType) {
    if (currentUserType === "user") {
      // Un assistant écrit : son id correspond à senderUser.id
      return message.senderUser?.id === currentUserId;
    }
    if (currentUserType === "patient") {
      // Un patient écrit : senderPatient est une URI de type "/api/patients/30"
      return message.senderPatient === `/api/patients/${currentUserId}`;
    }
    return false;
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await sendMessage(messageInput);
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

if (loading && messages.length === 0) {
    return <div className="p-8 text-center text-slate-400 animate-pulse">Chargement des messages...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="relative flex flex-col h-[80vh] max-w-2xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-white via-blue-50 to-emerald-50 border border-slate-200">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-100 via-white to-emerald-100 p-6 border-b border-slate-100">
        <h2 className="text-xl md:text-2xl font-bold text-blue-900 flex items-center gap-2">
          <UserCircle className="w-7 h-7 text-blue-400" />
          {currentUserType === "patient"
            ? "Conversation avec votre assistant"
            : `Conversation avec ${receiverParticipant?.name || "le patient"}`}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 bg-gradient-to-br from-white to-blue-50/40">
        {messages.map((message) => {
          const mine = isMessageFromCurrentUser(message, currentUserId, currentUserType);
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"} items-end`}
            >
              {/* Avatar */}
              {!mine && (
                <div className="mr-2 flex-shrink-0">
                  <UserCircle className="w-8 h-8 text-emerald-400/70" />
                </div>
              )}
              {/* Bubble */}
              <div
                className={`
                  max-w-[78%] md:max-w-lg px-4 py-3 rounded-2xl shadow
                  ${mine
                    ? "bg-gradient-to-tr from-blue-400 to-blue-600 text-white rounded-br-md"
                    : "bg-white/70 text-blue-900 border border-blue-100 rounded-bl-md"}
                  transition
                `}
              >
                <span className="block leading-snug break-words whitespace-pre-line">{message.content}</span>
                <span className={`block text-xs mt-1 font-medium ${mine ? "text-blue-100/90" : "text-blue-500/60"}`}>
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {/* Avatar à droite pour l’envoyeur ? (optionnel, à activer si tu veux) */}
              {mine && (
                <div className="ml-2 flex-shrink-0">
                  <UserCircle className="w-8 h-8 text-blue-400/60" />
                </div>
              )} 
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-white/60 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Écrivez un message…"
            className="flex-1 rounded-full border border-blue-200 bg-white/90 px-5 py-3 text-blue-900 placeholder:text-blue-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-base shadow"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 px-6 py-3 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-emerald-500 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Envoyer
          </button>
        </div>
      </form>
      {/* Liseré de fond décoratif */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-300 via-emerald-300 to-blue-300 opacity-20 pointer-events-none" />
    </div>
  );
};
