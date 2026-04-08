# 🎓 CampusQuery — AI Powered RAG-based Multilingual Chatbot 🤖

CampusQuery is an intelligent campus assistant chatbot that uses **Retrieval-Augmented Generation (RAG)**, **Multilingual Intent Classification**, and **Natural Language Processing** to help students and campus visitors find information instantly.

It supports queries about:

- 🎓 Admissions & Courses  
- 📅 Timetable & Examination Details  
- 🏫 Facilities, Clubs & Events  
- 📍 General Campus Queries  

The chatbot works in **multiple languages**, making it accessible for diverse students and visitors.

---

## 🚀 Features

- 🔍 **RAG-based Knowledge Retrieval**
- 🧠 **Intent Recognition (ML/NLP Based)**
- 🌐 **Multilingual Query Support**
- 💬 **Real-Time Chat Response**
- ⚙️ **Embeddings + Vector Search**
- 🧱 Modular architecture (Controllers, Routes, Models, Client UI)

---

## 📁 Project Structure
CampusQuery/
│
├── client/ # Frontend (UI)
├── controllers/ # Controller logic for chat, embeddings, intents, etc.
├── models/ # Database models (if using DB)
├── routes/ # Express Routes
│
├── chat.js # Chatbot logic layer
├── embedder.js # Embedding + Vector Store Component
├── index.js # Backend server entry point
│
├── .env # Environment variables (NOT committed)
├── .gitignore
├── package.json
└── README.md


---

## 🔧 Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/iamaparnaojha/CampusQuery.git
cd CampusQuery
2️⃣ Install Dependencies
Backend:
npm install

Frontend (inside client/):
cd client
npm install

3️⃣ Create .env file (in root folder)

Copy and fill in required keys:

PORT=5000
MONGODB_URI=your_mongo_url_here

# AI Provider
OPENAI_API_KEY=your_api_key_here

# App Config
CLIENT_URL=http://localhost:5173
SUPPORTED_LANGUAGES=en,hi
DEFAULT_LANGUAGE=en


⚠️ .env must stay at the root, not inside /client.

▶️ Running the Project

Use two terminals 👇

Terminal 1 — Backend
nodemon run server

Terminal 2 — Frontend
cd client
npm run dev


App opens at:

👉 Frontend: http://localhost:5173
👉 Backend API: http://localhost:5000

🤝 Contribution

Pull requests are welcome!
Please follow conventional commits and open an issue first before major changes.

📜 License

Licensed under the MIT License.
