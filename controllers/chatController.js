import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({});
const History = [];

export async function transformQuery(question) {
  History.push({
    role: 'user',
    parts: [{ text: question }]
  });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the \"Follow Up user Question\" into a complete, standalone question that can be understood without the chat history.\nOnly output the rewritten question and nothing else.`,
    },
  });
  History.pop();
  return response.text;
}

export async function chatting(question) {
  const queries = await transformQuery(question);
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
  });
  const queryVector = await embeddings.embedQuery(queries);
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
  History.push({
    role: 'user',
    parts: [{ text: queries }]
  });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You are a chatbot for JSS Academy of Technical Education. Answer student queries in a friendly and helpful manner. If the user greets, greet them and ask how you can help.\n\nIf a student asks about any notification, circular, or notice, only answer if the relevant information is present in the provided context. If the context is not sufficient, reply: \"I can't help, contact the staff locally at student_help@jssaten.ac.in\".\n\nAlways keep answers clear and concise. Only use the provided context to answer.\n\nContext: ${context}`,
    },
  });
  History.push({
    role: 'model',
    parts: [{ text: response.text }]
  });
  return response.text;
}
