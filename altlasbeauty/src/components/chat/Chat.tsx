// components/Chat.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { UserRole } from "@/types/user";

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
    return <div className="p-4 text-center">Chargement des messages...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto border rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="text-lg font-semibold">
          {currentUserType === "patient"
            ? "Conversation avec votre assistant"
            : `Conversation avec ${receiverParticipant.name}`}
        </h2>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser =
            (message.senderUser?.id === currentUserId &&
              currentUserType === "user") ||
            (message.senderPatient?.id === currentUserId &&
              currentUserType === "patient");

          return (
            <div
              key={message.id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isCurrentUser ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Écrivez un message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};
