"use client";
import { useState } from "react";
import { Message } from "./types";
import callGrokAPI from "./function";

export default function Home() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    setLoading(true);
    const userMeggage: Message = {
      text: inputMessage,
      role: "user",
    };
    setMessages([...messages, userMeggage]);
    const input = inputMessage;
    setInputMessage("");
    const newMessage = await callGrokAPI(messages, input);
    if (!newMessage) return;
    console.log(newMessage);
    setLoading(false);
    setMessages([...messages, userMeggage, newMessage as Message]);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-zinc-50">
      {/* Header */}
      <div className="bg-zinc-900 text-zinc-100 p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">AI Assistant</h1>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "system" && (
              <div className="w-6 h-6 bg-zinc-200 shrink-0" />
            )}
            <div
              className={`max-w-[70%] p-3 rounded-xl ${
                message.role === "user"
                  ? "bg-zinc-900 text-zinc-100"
                  : "bg-zinc-200 text-zinc-800"
              }`}
            >
              {message.text}
            </div>
            {message.role === "user" && (
              <div className="w-6 h-6 bg-zinc-800 shrink-0" />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 bg-zinc-200 animate-spin"></div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-zinc-200 flex items-center space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Message"
          className="flex-grow p-2 bg-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <button
          onClick={handleSendMessage}
          className="bg-zinc-900 text-zinc-100 p-2 rounded-full hover:bg-zinc-700 transition-colors"
        >
          <div className="w-5 h-5 bg-zinc-400" />
        </button>
      </div>
    </div>
  );
}
