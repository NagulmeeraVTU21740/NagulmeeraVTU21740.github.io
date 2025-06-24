import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaCat } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();

  const handleTalkToMeow = () => {
    navigate('/room-options');
  };

  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ marginBottom: '32px' }}>
          <FaCat size={80} color="white" style={{ marginBottom: '16px' }} />
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: 'white', 
            marginBottom: '16px',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            Meow Video Calling
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255,255,255,0.9)', 
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Stay connected with your loved ones across the distance. 
            Share moments, watch videos together, and keep the love alive.
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleTalkToMeow}
          style={{ 
            fontSize: '1.2rem', 
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
          }}
        >
          <FaHeart />
          Talk to your meow
        </button>

        <div style={{ 
          marginTop: '32px', 
          padding: '20px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '12px' }}>✨ Features</h3>
          <ul style={{ 
            color: 'rgba(255,255,255,0.9)', 
            textAlign: 'left',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ marginBottom: '8px' }}>🎥 High-quality video calling</li>
            <li style={{ marginBottom: '8px' }}>📱 Watch videos together in sync</li>
            <li style={{ marginBottom: '8px' }}>💬 Real-time chat</li>
            <li style={{ marginBottom: '8px' }}>🔐 Secure room codes</li>
            <li style={{ marginBottom: '8px' }}>📺 YouTube video sharing</li>
            <li style={{ marginBottom: '8px' }}>📁 Upload and share your videos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 