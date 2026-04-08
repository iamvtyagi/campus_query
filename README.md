# CampusQuery: An Enterprise-Grade AI Campus Assistant

CampusQuery is a sophisticated, AI-driven digital assistant designed to streamline the information retrieval process within a university ecosystem. Leveraging advanced **Retrieval-Augmented Generation (RAG)** architecture and **Natural Language Processing (NLP)**, the system provides accurate, contextually relevant, and multilingual support for students, faculty, and campus visitors.

---

## 🚀 Key Features

*   **RAG-Enhanced Knowledge Retrieval**: Integrates vector-based search to ensure responses are grounded in verified campus documentation.
*   **Multilingual Processing**: Seamlessly handles queries in multiple languages (English and Hindi supported out-of-the-box), enhancing institutional accessibility.
*   **Intent Classification**: Sophisticated NLP algorithms categorize user queries to provide specialized responses across domains (Admissions, Timetables, Events, etc.).
*   **Real-Time Asynchronous Communication**: High-performance backend providing low-latency responses through modern messaging patterns.
*   **Omnichannel Support**: Integrated support for web-based chat and Telegram bot interfaces.

---

## 🏗 System Architecture

The project follows a modular, decoupled architecture optimized for scalability and maintainability:

### 1. Retrieval-Augmented Generation (RAG) Pipeline
*   **Ingestion**: Documents (PDFs, Text) are processed and split into semantic chunks.
*   **Vector Encoding**: Chunks are converted into high-dimensional embeddings using Google/OpenAI models.
*   **Storage**: Embeddings are indexed in a Pinecone vector database.
*   **Retrieval**: User queries trigger a semantic search to fetch the most relevant knowledge context.
*   **Generation**: The LLM (Gemini/GPT) synthesizes a final response using the retrieved context.

---

## 🛠 Technology Stack

### Backend
*   **Runtime**: Node.js (ES Modules)
*   **Framework**: Express.js
*   **AI Orchestration**: LangChain, Google Generative AI (@google/genai)
*   **Database**: MongoDB (Metadata), Pinecone (Vector Store)
*   **Messaging**: Node Telegram Bot API

### Frontend
*   **Framework**: React.js (Vite)
*   **Styling**: Tailwind CSS, Vanilla CSS
*   **Routing**: React Router DOM
*   **State Management**: React Hooks

---

## 📂 Project Structure

```text
CampusQuery/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── pages/          # Chatbot and Dashboard UI Components
│   │   └── App.jsx         # Application Routing
├── controllers/            # AI and Business Logic Handlers
├── models/                 # Mongoose Database Schemas
├── routes/                 # Express API Endpoint Definitions
├── chat.js                 # Core Orchestration Layer
├── embedder.js             # Vectorization and Embedding Logic
├── index.js                # Server Entry Point
└── package.json            # Dependency Manifest
```

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Instance
*   Pinecone Account
*   Google Gemini or OpenAI API Key

### 1. Clone the Repository
```bash
git clone https://github.com/iamaparnaojha/CampusQuery.git
cd CampusQuery
```

### 2. Backend Installation
```bash
npm install
```

### 3. Frontend Installation
```bash
cd client
npm install
cd ..
```

---

## 🔑 Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
# Server Configuration
PORT=5000
MONGODB_URI=your_mongodb_connection_string

# AI Provider Keys
GOOGLE_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Vector DB Configuration
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_env

# Application Configuration
CLIENT_URL=http://localhost:5173
SUPPORTED_LANGUAGES=en,hi
DEFAULT_LANGUAGE=en

# Telegram Integration (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
```

---

## 🚀 Execution

### Development Mode
To run the system in development mode with hot-reloading:

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/chat` | Processes user questions and returns AI-generated responses. |
| `POST` | `/api/files/upload` | Uploads and processes documents for the RAG knowledge base. |

---

## 🤝 Contribution Guidelines

We welcome contributions to CampusQuery. To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
