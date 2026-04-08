import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getFiles, deleteFile, uploadFile } from '../services/api';
import FileList from '../components/FileList';
import UploadDropzone from '../components/UploadDropzone';

const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const data = await getFiles();
      setFiles(data);
    } catch (error) {
      toast.error('Failed to fetch files');
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(id);
        setFiles(files.filter(file => file._id !== id));
        toast.success('File deleted successfully');
      } catch (error) {
        toast.error('Failed to delete file');
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const uploadedFile = await uploadFile(file);
      setFiles([uploadedFile, ...files]);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Enhanced CampusQuery Logo Component with CQ letters
  const CampusQueryLogo = () => (
    <div className="flex items-center space-x-4 group cursor-pointer">
      <div className="relative">
        {/* Main logo container with glow effect */}
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 opacity-80 animate-pulse"></div>
          
          {/* Chat bubble base */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="relative">
              {/* CQ Letters */}
              <span className="text-white font-bold text-lg tracking-tight">CQ</span>
              
              {/* Graduation cap overlay */}
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-sm transform rotate-12 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Inner glow */}
          <div className="absolute inset-1 bg-gradient-to-br from-blue-300/30 to-transparent rounded-xl"></div>
        </div>
        
        {/* Outer glow effect */}
        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
        
        {/* Floating particles around logo */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce delay-100"></div>
        <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-60 animate-bounce delay-300"></div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-white transition-all duration-300">
          CampusQuery
        </span>
        <span className="text-xs text-blue-400 font-medium tracking-wider opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          Admin Portal
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-sky-500/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-blue-400/10 rounded-full blur-xl animate-float"></div>
        
        {/* Gradient waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-transparent to-indigo-600/20 animate-wave"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-sky-600/20 via-transparent to-blue-600/20 animate-wave-reverse"></div>
        </div>
        
        {/* Particle effects */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-twinkle-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-sky-400 rounded-full animate-twinkle"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle-delayed"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50 shadow-lg shadow-blue-900/20">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <CampusQueryLogo />
              <div className="flex items-center space-x-6">
                <div className="bg-blue-900/40 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-500/30 shadow-lg shadow-blue-900/20">
                  <span className="text-blue-100 text-sm font-medium">Welcome, Admin</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/30 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-10 max-w-7xl">
          {/* Header Section */}
          <div className="mb-16 animate-fade-in">
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-200 via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-6 animate-slide-up">
                Admin Dashboard
              </h1>
              <p className="text-blue-300/90 text-xl max-w-3xl mx-auto leading-relaxed">
                Manage your documents and files for the CampusQuery intelligent system
              </p>
            </div>
            
            {/* Enhanced Stats Cards with Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
              <div className="group bg-blue-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-10 hover:bg-blue-900/30 hover:scale-105 hover:shadow-blue-500/20 transition-all duration-700 animate-slide-up delay-100 relative overflow-hidden">
                {/* Glowing edge effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-5 rounded-2xl shadow-lg group-hover:shadow-blue-500/30 transition-all duration-500 group-hover:scale-110">
                      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-300/80 text-sm font-medium mb-2">Total Files</p>
                      <p className="text-5xl font-bold text-blue-100 group-hover:text-white transition-colors duration-500">{files.length}</p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-950/50 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1500 shadow-lg shadow-blue-500/30" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="group bg-blue-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-10 hover:bg-blue-900/30 hover:scale-105 hover:shadow-emerald-500/20 transition-all duration-700 animate-slide-up delay-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-5 rounded-2xl shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-500 group-hover:scale-110">
                      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-300/80 text-sm font-medium mb-2">Ready Files</p>
                      <p className="text-5xl font-bold text-blue-100 group-hover:text-emerald-100 transition-colors duration-500">{files.filter(f => f.status === 'ready').length}</p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-950/50 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-1500 shadow-lg shadow-emerald-500/30" style={{width: '90%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="group bg-blue-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-10 hover:bg-blue-900/30 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-700 animate-slide-up delay-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-2xl shadow-lg group-hover:shadow-amber-500/30 transition-all duration-500 group-hover:scale-110">
                      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-300/80 text-sm font-medium mb-2">Processing</p>
                      <p className="text-5xl font-bold text-blue-100 group-hover:text-amber-100 transition-colors duration-500">{files.filter(f => f.status === 'processing').length}</p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-950/50 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1500 animate-pulse shadow-lg shadow-amber-500/30" style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upload Section */}
          <div className="bg-blue-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-12 mb-12 hover:bg-blue-900/30 hover:shadow-blue-500/20 transition-all duration-700 animate-slide-up delay-400 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-10">
                <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-5 rounded-2xl shadow-lg mr-6 hover:shadow-sky-500/30 transition-all duration-500 group-hover:scale-110">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-blue-100 mb-3">Upload Files</h2>
                  <p className="text-blue-300/80 text-lg">Drag and drop your documents to get started</p>
                </div>
              </div>
              <div className="bg-blue-950/30 rounded-2xl p-4 border border-blue-500/20 shadow-inner">
                <UploadDropzone onDrop={handleUpload} />
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="bg-blue-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-12 hover:bg-blue-900/30 hover:shadow-violet-500/20 transition-all duration-700 animate-slide-up delay-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 p-5 rounded-2xl shadow-lg mr-6 hover:shadow-violet-500/30 transition-all duration-500 group-hover:scale-110">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-blue-100 mb-3">Document Library</h2>
                    <p className="text-blue-300/80 text-lg">Manage your uploaded files and their processing status</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-blue-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </span>
                </button>
              </div>
              <div className="bg-blue-950/30 rounded-2xl p-4 border border-blue-500/20 shadow-inner">
                <FileList 
                  files={files} 
                  isLoading={isLoading} 
                  onDelete={handleDelete} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        @keyframes wave-reverse {
          0%, 100% { transform: translateX(100%); }
          50% { transform: translateX(-100%); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(2); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 15s linear infinite;
        }
        
        .animate-wave-reverse {
          animation: wave-reverse 20s linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-twinkle-delayed {
          animation: twinkle-delayed 4s ease-in-out infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
