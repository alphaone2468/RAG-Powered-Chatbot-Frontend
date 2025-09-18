import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, MoreVertical, Edit, Share } from "lucide-react";

const ChatUI = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(Date.now());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);

    const loadingId = Date.now() + 1;
    const loadingMessage = {
      id: loadingId,
      text: "Typing...",
      sender: "other",
      avatar: "🤖",
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Call backend
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message,
          sessionId: sessionId.current,
        }),
      });

      const data = await res.json();

      // Replace loading with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                text: data.answer || "No response",
                isLoading: false,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : msg
        )
      );

      setMessage("");
    } catch (error) {
        console.error("Error sending message:", error);
    }

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-sm text-gray-400">
          Today
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
          <Share size={16} />
          Share
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            {msg.sender === "me" && (
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-xs break-words">
                  {msg.text}
                </div>
              </div>
            )}
            
            {msg.sender === "other" && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {msg.avatar}
                </div>
                <div className="flex-1 space-y-2">
                  <div className={`text-gray-300 leading-relaxed ${msg.isLoading ? 'opacity-60 italic' : ''}`}>
                    {msg.text}
                  </div>
                  {msg.timestamp && !msg.isLoading && (
                    <div className="text-xs text-gray-500">
                      Delivered
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="relative bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full bg-transparent px-6 py-4 pr-16 text-white placeholder-gray-400 focus:outline-none resize-none"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-500">
              ⚡ by Botpress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;