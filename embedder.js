
import * as dotenv from 'dotenv';
dotenv.config();

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import fs from 'fs';
import path from 'path';

async function indexDocuments() {
  const documentsDir = path.join(process.cwd(), 'documents');
  const files = fs.readdirSync(documentsDir).filter(file => file.endsWith('.pdf'));
  if (files.length === 0) {
    console.log('No PDF files found in documents folder.');
    return;
  }

  const allChunkedDocs = [];
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  for (const file of files) {
    const filePath = path.join(documentsDir, file);
    const pdfLoader = new PDFLoader(filePath);
    const rawDocs = await pdfLoader.load();
    console.log(`Loaded: ${file}`);
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    allChunkedDocs.push(...chunkedDocs);
    console.log(`Chunked: ${file}`);
  }

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
  });
  console.log('Embedding model configured');

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  console.log('Pinecone configured');

  await PineconeStore.fromDocuments(allChunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });
  console.log('All data stored successfully');
}

indexDocuments();
