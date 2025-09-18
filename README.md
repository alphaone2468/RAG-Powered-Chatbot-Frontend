
# 📰 RAG-Powered News Chatbot – Frontend

This is the frontend of a Retrieval-Augmented Generation (RAG) powered chatbot that answers queries over a news corpus.
The frontend is built with **React** and styled using **SCSS**. It connects to the backend API to handle chat sessions, display responses, and manage chat history.

---

## 🚀 Features

* **Chat Interface**

  * Displays conversation history (user + bot messages).
  * Input box for sending queries.
  * "Typing..." indicator while waiting for the backend.
  * Reset button to clear the current session.

* **Session Management**

  * Each new user gets a unique session ID.
  * Fetches past messages from backend using sessionId.
  * Deletes session on tab close or manual reset.

* **User Experience**

  * Responsive and clean UI.
  * Optional streaming/typed-out bot replies.
  * SCSS for modular styling.

---

## 🛠 Tech Stack

* **Frontend Framework**: React (with hooks & functional components)
* **Styling**: SCSS
* **API Calls**: Axios / Fetch
* **Backend**: Express + Redis + Pinecone + Jina + Gemini

---

---
##  Live Demo

You can access the deployed application here:  

👉 [**Live Demo**](https://rag-based-news-chat-bot.netlify.app/)

---

## 📂 Project Structure

```
frontend/
├── public/
│   └── index.html             # Root HTML
│
├── src/
│   ├── components/
│   │   ├── ChatUI.jsx     # Displays chat messages
│   │   
│   ├── App.jsx                # Main app component
│   ├── App.css                # Main css file 
│   └── index.js               # Entry point
│
├── package.json               # Dependencies and scripts
├── .env.example               # Backend URL config
└── README.md                  # Project documentation
```

---

## ⚙️ Setup & Installation

1. **Clone repository**

   ```bash
   git clone <your-frontend-repo-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** (`.env`)

   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. **Start development server**

   ```bash
   npm start
   ```

---

## 🔗 API Integration

The frontend communicates with backend APIs:

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| POST   | `/api/chat`               | Send a user query and get response |
| DELETE | `/api/redis/:sessionId` | Clear chat history for a session   |

---

## 🧠 How It Works

1. **User sends query →** Frontend captures the text input.
2. **API call →** Sends query + sessionId to backend `/chat`.
3. **Backend response →** Displays Gemini’s response in chat window.
4. **History management →** Fetches and displays previous session messages.
5. **Session reset →** User clicks reset button or closes tab → history cleared via API.

