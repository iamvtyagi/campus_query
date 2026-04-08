import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 30000, // 30 seconds timeout for file uploads
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
            throw new Error(message);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Network error - please check your connection');
        } else {
            // Something else happened
            throw new Error('An unexpected error occurred');
        }
    }
);

// File API functions
export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`Upload progress: ${percentCompleted}%`);
            },
        });

        return response.data.file;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

export const getFiles = async () => {
    try {
        const response = await api.get('/files');
        return response.data.files;
    } catch (error) {
        console.error('Get files error:', error);
        throw error;
    }
};

export const getFile = async (id) => {
    try {
        const response = await api.get(`/files/${id}`);
        return response.data.file;
    } catch (error) {
        console.error('Get file error:', error);
        throw error;
    }
};

export const deleteFile = async (id) => {
    try {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete file error:', error);
        throw error;
    }
};

export const updateFileStatus = async (id, status) => {
    try {
        const response = await api.put(`/files/${id}/status`, { status });
        return response.data.file;
    } catch (error) {
        console.error('Update file status error:', error);
        throw error;
    }
};

// Health check function
export const checkServerHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('Health check error:', error);
        throw error;
    }
};

export default api;
