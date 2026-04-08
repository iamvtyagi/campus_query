import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

const statusIcons = {
  uploaded: (
    <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
  processing: (
    <svg className="h-4 w-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  ready: (
    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
};

const FileList = ({ files, isLoading, onDelete }) => {
  const [deletingFiles, setDeletingFiles] = useState(new Set());

  const handleDelete = async (fileId) => {
    setDeletingFiles(prev => new Set(prev).add(fileId));
    try {
      await onDelete(fileId);
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-blue-600 font-medium">Loading files...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No files uploaded yet</h3>
        <p className="text-gray-500 max-w-sm mx-auto">Upload your first document using the upload section above to get started with CampusQuery.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                File
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Uploaded
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {files.map((file, index) => (
              <tr key={file._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-sm">
                      <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900 truncate max-w-xs">{file.filename}</div>
                      <div className="text-xs text-gray-500 uppercase font-medium">{file.format}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    {statusIcons[file.status] || statusIcons.uploaded}
                    <span className="ml-2 text-sm font-medium text-gray-700 capitalize">{file.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {formatDistanceToNow(new Date(file.createdAt || file.uploadedAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {Math.round(file.size / 1024)} KB
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(file._id)}
                    disabled={deletingFiles.has(file._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    title="Delete file"
                  >
                    {deletingFiles.has(file._id) ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-200 border-t-red-600"></div>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {files.map((file, index) => (
          <div key={file._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-sm">
                  <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{file.filename}</div>
                  <div className="text-xs text-gray-500 uppercase font-medium mt-1">{file.format}</div>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      {statusIcons[file.status] || statusIcons.uploaded}
                      <span className="ml-1 text-xs font-medium text-gray-600 capitalize">{file.status}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(file.size / 1024)} KB
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(file.createdAt || file.uploadedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(file._id)}
                disabled={deletingFiles.has(file._id)}
                className="ml-4 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                title="Delete file"
              >
                {deletingFiles.has(file._id) ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-200 border-t-red-600"></div>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
