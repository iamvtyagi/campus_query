import express from 'express';
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import File from '../models/File.js';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only PDF and Word documents
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed'), false);
        }
    }
});

// Azure Blob Storage setup
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);

// Upload file to Azure Blob Storage (PDF only)
const uploadToAzureBlob = async (buffer, originalName) => {
    const blobName = `${Date.now()}-${originalName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: 'application/pdf' }
    });
    return { url: blockBlobClient.url, blobName };
};

// Delete file from Azure Blob Storage
const deleteFromAzureBlob = async (blobName) => {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
};


// Helper: Download PDF from Azure Blob Storage to local documents folder
async function downloadPdfFromAzure(url, localPath) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download PDF from Azure');
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(buffer));
    console.log("Downloaded PDF");
}

// Helper: Chunk and embed a single PDF file (like embedder.js, but for one file)
async function chunkAndEmbedPdf(localPath) {
    const pdfLoader = new PDFLoader(localPath);
    const rawDocs = await pdfLoader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'text-embedding-004',
    });
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });
    console.log('PDF chunked and embedded successfully');
}

// POST /api/files/upload - Upload a new file
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalname, mimetype, size, buffer } = req.file;

        // Upload to Azure Blob Storage (PDF only)
        const azureResult = await uploadToAzureBlob(buffer, originalname);

        // Determine file format
        let format = 'Unknown';
        if (mimetype === 'application/pdf') {
            format = 'PDF';
        } else if (mimetype === 'application/msword') {
            format = 'DOC';
        } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            format = 'DOCX';
        }

        // Save file details to MongoDB
        const newFile = new File({
            filename: originalname,
            originalName: originalname,
            mimetype: mimetype,
            size: size,
            azureUrl: azureResult.url,
            azurePublicId: azureResult.blobName,
            format: format,
            status: 'ready'
        });

        const savedFile = await newFile.save();

        // If PDF, download from Azure and trigger chunking/embedding
        if (format === 'PDF') {
            const documentsDir = path.join(process.cwd(), 'documents');
            if (!fs.existsSync(documentsDir)) {
                fs.mkdirSync(documentsDir);
            }
            const localPath = path.join(documentsDir, azureResult.blobName);
            try {
                await downloadPdfFromAzure(azureResult.url, localPath);
                await chunkAndEmbedPdf(localPath);
                // Optionally, update status in MongoDB to 'processed' or similar
                await File.findByIdAndUpdate(savedFile._id, { status: 'processed' });
            } catch (embedErr) {
                console.error('Chunk/embed error:', embedErr);
                await File.findByIdAndUpdate(savedFile._id, { status: 'error' });
            }
        }

        res.status(201).json({
            message: 'File uploaded successfully',
            file: {
                _id: savedFile._id,
                filename: savedFile.filename,
                format: savedFile.format,
                size: savedFile.size,
                status: savedFile.status,
                createdAt: savedFile.createdAt,
                cloudinaryUrl: savedFile.cloudinaryUrl
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        if (error.message && error.message.includes('Only PDF and Word documents')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ 
            error: 'Failed to upload file',
            details: error.message 
        });
    }
});

// GET /api/files - Get all files
router.get('/', async (req, res) => {
    try {
        const files = await File.find()
            .sort({ createdAt: -1 })
            .select('filename originalName format size status createdAt cloudinaryUrl');

        res.json({
            message: 'Files retrieved successfully',
            files: files
        });

    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve files',
            details: error.message 
        });
    }
});

// GET /api/files/:id - Get a specific file
router.get('/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.json({
            message: 'File retrieved successfully',
            file: file
        });

    } catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve file',
            details: error.message 
        });
    }
});

// DELETE /api/files/:id - Delete a file
router.delete('/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }


        // Delete from Azure Blob Storage
        try {
            await deleteFromAzureBlob(file.azurePublicId);
        } catch (azureError) {
            console.error('Azure Blob deletion error:', azureError);
            // Continue with MongoDB deletion even if Azure fails
        }

        // Delete from MongoDB
        await File.findByIdAndDelete(req.params.id);

        res.json({
            message: 'File deleted successfully',
            deletedFile: {
                _id: file._id,
                filename: file.filename
            }
        });

    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ 
            error: 'Failed to delete file',
            details: error.message 
        });
    }
});

// PUT /api/files/:id/status - Update file status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['uploaded', 'processing', 'ready', 'error'];
        
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const file = await File.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.json({
            message: 'File status updated successfully',
            file: file
        });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ 
            error: 'Failed to update file status',
            details: error.message 
        });
    }
});

export default router;
