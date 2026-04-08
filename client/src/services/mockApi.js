// Mock data for files
const mockFiles = [
  {
    _id: '1',
    filename: 'sample-document.pdf',
    url: '#',
    publicId: 'sample1',
    size: 2457600, // 2.4MB
    format: 'application/pdf',
    status: 'ready',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    filename: 'college-notes.docx',
    url: '#',
    publicId: 'sample2',
    size: 512000, // 512KB
    format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'processing',
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    _id: '3',
    filename: 'exam-schedule.pdf',
    url: '#',
    publicId: 'sample3',
    size: 1024000, // 1MB
    format: 'application/pdf',
    status: 'uploaded',
    createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  }
];

// Mock API functions
export const getFiles = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockFiles]), 800); // Simulate network delay
  });
};

export const uploadFile = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFile = {
        _id: Date.now().toString(),
        filename: file.name,
        url: '#',
        publicId: `mock_${Date.now()}`,
        size: file.size,
        format: file.type,
        status: 'uploaded',
        createdAt: new Date().toISOString()
      };
      mockFiles.unshift(newFile);
      resolve(newFile);
    }, 1000);
  });
};

export const deleteFile = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockFiles.findIndex(file => file._id === id);
      if (index !== -1) {
        mockFiles.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};
