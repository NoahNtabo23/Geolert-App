"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import SiriAnimation from "./siri-animation"
import { XIcon, SendIcon } from "lucide-react"

interface ChatMessage {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: string
}

interface ChatBotProps {
  onClose: () => void
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm GeoHelp. Ask me about reporting incidents, the live map, or safety tips.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Gemini AIbot response
      try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input }),
  });

  // Create a new bot message placeholder
  const botId = (Date.now() + 1).toString();
  setMessages((prev) => [
    ...prev,
    {
      id: botId,
      text: "",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // Stream Gemini's response
  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let partialText = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      partialText += decoder.decode(value, { stream: true });

      // Update message as text streams in
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, text: partialText } : m
        )
      );
    }
  }
} catch (error) {
  console.error("Chat error:", error);
  setMessages((prev) => [
    ...prev,
    {
      id: (Date.now() + 1).toString(),
      text: "Something went wrong. Please try again later.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
} finally {
  setIsLoading(false);
}

  }

  return (
    <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] glass-effect-strong rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in z-40 flex flex-col max-h-[600px]">
      
      {/* --- HEADER --- */}
      <div className="relative w-full h-36 overflow-hidden border-b border-white/10">
        {/* Animation is the background */}
        <div className="absolute inset-0 -m-16 scale-110">
           <SiriAnimation />
        </div>
        
        {/* Close Button (over the animation) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/70 hover:text-foreground hover:bg-white/20 p-2 rounded-full transition-all duration-300 z-50"
          aria-label="Close chat assistant"
          title="Close chat"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Title (over the animation) */}
        <h3 className="absolute bottom-5 left-6 text-2xl font-bold text-foreground">
          GeoHelp
        </h3>
      </div>
      


      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-slide-in-up`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl transition-all duration-300 ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none shadow-lg"
                  : "glass-effect text-foreground rounded-bl-none border border-white/10"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs opacity-70 mt-1.5 ${message.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-slide-in-up">
            <div className="glass-effect text-foreground px-4 py-3 rounded-2xl rounded-bl-none border border-white/10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div
                  className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask GeoHelp..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 flex items-center justify-center bg-linear-to-r from-primary to-accent text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 active:scale-95"
            aria-label="Send message"
            title="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}