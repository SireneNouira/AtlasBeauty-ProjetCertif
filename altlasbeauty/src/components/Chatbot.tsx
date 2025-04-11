"use client";
import { useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      setIsBotTyping(true);
      const res = await axios.post("/api/chat", {
        message: input,
      });
      const botMessage: Message = { role: "bot", content: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Erreur de réponse du bot." },
      ]);
    } finally {
      setLoading(false);
      setIsBotTyping(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto rounded-xl shadow border bg-white">
      <h2 className="text-xl font-semibold mb-4">🤖 Chatbot IA</h2>
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {isBotTyping && (
          <div className="text-sm italic text-gray-500">
            Le bot est en train d’écrire...
          </div>
        )}
      </div>
      <div className="flex">
        <input
          className="flex-grow border p-2 rounded-l"
          placeholder="Pose ta question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r"
          onClick={sendMessage}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
