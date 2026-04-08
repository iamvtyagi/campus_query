import { ChatOpenAI } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
dotenv.config();
const History = [];

// Use GPT to rewrite the user's question into a standalone English query
export async function transformQueryGPT(question, history = []) {
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-5-mini", //gpt-4o
    temperature: 0.2,
  });
    const prompt = `You are a query rewriting expert. Given the chat history and the latest user question, rephrase the latest question into a complete, standalone English question that can be understood without any chat history. If the latest question is a follow-up (like 'last date kya hai?'), use the previous conversation to clarify what the user is referring to. Preserve any technical terms or keywords in English. Only output the rewritten question and nothing else.`;
  // Pass history as context if available
  const messages = [
    { role: 'system', content: prompt },
      ...history,
    { role: 'user', content: question }
  ];
  const response = await llm.invoke(messages);
  return response.content;
}

// In-memory chat history per session (for demo; use a better store for production)
const sessionHistories = {};

export async function chattingGPT(question, sessionId = 'default') {
  // Get or initialize history for this session
  if (!sessionHistories[sessionId]) sessionHistories[sessionId] = [];
  const history = sessionHistories[sessionId];

  // Step 1: Rewrite the question to English using GPT, with history
  const rewrittenQuery = await transformQueryGPT(question, history);

  // Step 2: Embed the rewritten query and search Pinecone
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
  });
  const queryVector = await embeddings.embedQuery(rewrittenQuery);
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
  });
  const context = searchResults.matches
    .map(match => match.metadata.text)
    .join("\n\n---\n\n");

  // If no context found, return fallback message
  if (!context || context.trim().length === 0) {
    const fallback = "I couldn’t find the details right now. Please reach out to the campus helpdesk at student_help@jssaten.ac.in for further assistance.";
    history.push({ role: 'user', content: question });
    history.push({ role: 'assistant', content: fallback });
    return fallback;
  }

  // Step 3: Use the original user question and found context for the final answer, with history
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-5-mini", //gpt-4o
    temperature: 0.2,
  });
  const prompt =`You are CampusQuery, the official multilingual chatbot for JSS Academy of Technical Education. Answer student queries in a friendly and helpful manner. If the user greets, greet them and ask how you can help.\n\nIf a student asks about any notification, circular, or notice, only answer if the relevant information is present in the provided context. If the context is not sufficient, reply: \"I couldn’t find the details right now. Please reach out to the campus helpdesk at student_help@jssaten.ac.in or visit register office AB1 ground floor ,room no. 3 for further assistance.\"\n\nAlways keep answers clear, concise, and in the same language as the query whenever possible. Only use the provided context to answer.\n\nContext: ${context}`;
  const messages = [
    { role: 'system', content: prompt },
    ...history,
    { role: 'user', content: question }
  ];
  const response = await llm.invoke(messages);

  // Update history for this session
  history.push({ role: 'user', content: question });
  history.push({ role: 'assistant', content: response.content });

  return response.content;
}



