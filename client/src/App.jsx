import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/" element={<div className="p-8 text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to CampusQuery</h1>
            <p className="text-gray-600 mb-8 text-lg">JSS Academy of Technical Education, Noida</p>
            <div className="space-y-4">
              <a href="/chatbot" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-semibold mr-4">
                💬 Go to Chatbot
              </a>
              <a href="/admin-dashboard" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition font-semibold">
                📊 Go to Admin Dashboard
              </a>
            </div>
          </div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;