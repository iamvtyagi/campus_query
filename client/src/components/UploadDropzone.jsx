import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadDropzone = ({ onDrop: onDropProp }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0 && !isUploading) {
      setIsUploading(true);
      try {
        await onDropProp(acceptedFiles);
      } finally {
        setIsUploading(false);
      }
    }
  }, [onDropProp, isUploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
        isDragActive 
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
      } ${isUploading ? 'opacity-75 cursor-not-allowed scale-100' : 'shadow-sm hover:shadow-md'}`}
    >
      <input {...getInputProps()} disabled={isUploading} />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl"></div>
      </div>
      
      <div className="relative flex flex-col items-center justify-center space-y-6">
        {/* Icon Container */}
        <div className={`relative ${isUploading ? 'animate-pulse' : ''}`}>
          {isUploading ? (
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-blue-600 rounded-full opacity-20"></div>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl transition-all duration-300 ${
              isDragActive 
                ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg' 
                : 'bg-gradient-to-br from-gray-100 to-blue-100 hover:from-blue-100 hover:to-indigo-100'
            }`}>
              <svg className={`h-12 w-12 transition-colors duration-300 ${
                isDragActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          {isUploading ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-blue-600">Uploading file...</p>
              <p className="text-sm text-blue-500">Please wait while we process your document</p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-blue-600">Drop the file here!</p>
              <p className="text-sm text-blue-500">Release to upload your document</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  <span className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">Your documents will be processed for CampusQuery</p>
              </div>
              
              {/* File Type Info */}
              <div className="flex items-center justify-center space-x-6 pt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">PDF</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">DOC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">DOCX</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 pt-2">Maximum file size: 10MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDropzone;