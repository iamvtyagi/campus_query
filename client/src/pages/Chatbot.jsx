import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Show welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: "👋 Hi! I'm CampusQuery, your smart campus assistant. Ask me anything about admissions, courses, events, or campus life!",
          sender: 'bot'
        }
      ]);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call backend API
      const response = await axios.post(
        'http://localhost:5000/chat',
        { question: input },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.answer || 'Sorry, no answer received.',
        sender: 'bot'
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Error: Could not connect to server.',
        sender: 'bot'
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="page-container">
      {/* College Website Header */}
      <div className="jss-header">
        <div className="header-top">
          <nav className="top-nav">
            <a href="/">JSS UNIVERSITY NOIDA</a>
            <a href="/">SUTTUR KSHETRA</a>
            <a href="/">ISSMVP</a>
            <a href="/">VIRTUAL CAMPUS TOUR</a>
            <a href="/">ERP</a>
            <a href="/">NIRF</a>
            <a href="/">ACCREDITATION</a>
            <a href="/">ALUMNI</a>
            <a href="/">CAREER OPPORTUNITY</a>
            <a href="/">CONTACT US</a>
          </nav>
        </div>

        <div className="header-middle">
          <div className="college-title">
            <h1>JSS MAHAVIDYAPEETHA</h1>
            <h2>JSS Academy of Technical Education, Noida</h2>
            <p>Approved by All India Council for Technical Education (AICTE), New Delhi.</p>
            <p>UG programs are Accredited by National Board of Accreditation (NBA), New Delhi.</p>
            <p>Affiliated to Dr APJ Abdul Kalsam Technical University, Uttar Pradesh, Lucknow</p>
          </div>
        </div>

        <div className="header-bottom">
          <nav className="main-nav">
            <a href="/">HOME</a>
            <a href="/">ADMISSION</a>
            <a href="/">ACADEMICS</a>
            <a href="/">FACILITIES</a>
            <a href="/">STUDENT SUPPORT</a>
            <a href="/">RESEARCH</a>
            <a href="/">TRAINING & PLACEMENT</a>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="jss-main-content">
        <div className="jss-hero">
          <img 
            src="http://jssonline.org/wp-content/uploads/2019/03/JSSATE-NOIDA.jpg" 
            alt="College Campus" 
            className="hero-image"
          />
          <div className="hero-overlay">
            <div className="hero-text">
              <h3>Welcome to CampusQuery</h3>
              <p>Your Smart Campus Assistant</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="mission-box">
            <h3>Our Mission</h3>
            <p>
              Provide an environment for acquiring ethical values and professional attitude
              while achieving academic excellence through quality education and research.
            </p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h4>Admissions</h4>
              <p>Learn about our undergraduate and postgraduate programs.</p>
            </div>
            <div className="info-card">
              <h4>Academics</h4>
              <p>Explore our comprehensive curriculum and courses.</p>
            </div>
            <div className="info-card">
              <h4>Campus Life</h4>
              <p>Discover student activities, clubs, and events.</p>
            </div>
            <div className="info-card">
              <h4>Placements</h4>
              <p>View training and placement opportunities.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Widget */}
      <div className={`floating-chatbot ${isOpen ? 'open' : ''}`}>
        {/* Chatbot Circle Button */}
        {!isOpen && (
          <button 
            className="chatbot-circle-btn"
            onClick={() => setIsOpen(true)}
            title="Chat with us"
          >
            <span className="chatbot-icon">💬</span>
          </button>
        )}

        {/* Chatbot Window */}
        {isOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header-bar">
              <h3>Chat with us</h3>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chatbot-message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                >
                  <span className="message-text">{msg.text}</span>
                </div>
              ))}
              {loading && (
                <div className="chatbot-message bot-msg">
                  <span className="message-text loading">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                className="chatbot-input"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="send-btn"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Back to Home Button */}
      <a href="/" className="back-to-home-btn">← Back to Home</a>
    </div>
  );
};

export default Chatbot;
