import React, { useState, useEffect, useRef } from "react";
import AppLayout from "../../layouts/AppLayout";
import api from "../../services/api";
import { Button } from "../../components/ui/Button/Button";
import { Bot, Send, Trash2 } from "lucide-react";
import "./AiAgent.css";

export default function AiAgent() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem("ai_chat_history");
    if (savedChat) {
      return JSON.parse(savedChat);
    }
    return [
      {
        role: "ai",
        text: "Olá! Sou seu assistente pessoal. Diga-me qual é o seu objetivo para hoje!",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const clearHistory = () => {
    if (window.confirm("Tem certeza que deseja apagar todo o histórico?")) {
      const resetState = [
        {
          role: "ai",
          text: "Histórico limpo! Como posso ajudar agora?",
        },
      ];
      setMessages(resetState);
      localStorage.setItem("ai_chat_history", JSON.stringify(resetState));
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt;
    setPrompt("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const response = await api.post("/ai/generate", { prompt: userText });
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: response.data.result },
      ]);
    } catch (error) {
      console.error("Erro na IA:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Desculpe, tive um problema de conexão. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="ai-container">
        <div className="ai-header">
          <h2 className="ai-title">
            <Bot size={24} color="#2563eb" />
            Assistente IA
          </h2>

          <button
            onClick={clearHistory}
            className="clear-history-btn"
            title="Limpar Histórico"
          >
            <Trash2 size={18} /> Limpar
          </button>
        </div>

        <div className="chat-window" ref={scrollRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === "ai" && <Bot size={16} className="bot-icon" />}
              <div className="message-content">
                {msg.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message ai typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="input-area">
          <input
            type="text"
            className="ai-input"
            placeholder="Pergunte algo..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <div className="send-btn-wrapper">
            <Button type="submit" disabled={loading} className="send-btn">
              <Send size={20} />
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
