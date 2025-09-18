import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, MoreVertical, Edit, Share } from "lucide-react";

const ChatUI = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(Date.now());
  const apiUrl = import.meta.env.VITE_FRONTEND_URL;

  window.addEventListener("beforeunload", async() => {
    await fetch(`${apiUrl}/api/redis/${sessionId.current}`,{
      method:"DELETE"
    });
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClear = async () => {
    try {
      // Delete current session
      await fetch(`${apiUrl}}/api/redis/${sessionId.current}`, {
        method: "DELETE"
      });
      
      // Clear messages
      setMessages([]);
      
      // Create new session ID
      sessionId.current = Date.now();
      
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  };

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
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Call backend
      setMessage("");
      const res = await fetch("https://rag-powered-chatbot-backend-qiv0.onrender.com/api/chat", {
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
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <h2>Voosh News Assistant</h2>
        </div>
        <div className="header-center">
          
        </div>
        <button className="share-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className="message-wrapper">
            {msg.sender === "me" && (
              <div className="user-message-container">
                <div className="user-message">
                  {msg.text}
                </div>
              </div>
            )}
            
            {msg.sender === "other" && (
              <div className="bot-message-container">
                <div className="bot-avatar">
                  B
                </div>
                <div className="bot-message-content">
                  <div className={`bot-message-text ${msg.isLoading ? 'loading' : ''}`}>
                    {msg.text}
                  </div>
                  {msg.timestamp && !msg.isLoading && (
                    <div className="message-status">
                      {msg.timestamp}
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
      <div className="input-area">
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="message-input"
            />
            <div className="input-buttons">
              
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="send-btn"
              >
                <Send size={18} style={{position:"relative",top:"1.5px"}} />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ChatUI;