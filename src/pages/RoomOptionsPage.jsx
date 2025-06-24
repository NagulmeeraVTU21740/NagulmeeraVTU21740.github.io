import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';

const RoomOptionsPage = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  const handleJoinRoom = () => {
    navigate('/join-room');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <button 
          className="btn btn-secondary" 
          onClick={handleGoBack}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px',
            padding: '8px 16px',
            fontSize: '14px'
          }}
        >
          <FaArrowLeft />
          Back
        </button>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: 'white', 
            marginBottom: '16px',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            Choose Your Option
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'rgba(255,255,255,0.9)', 
            lineHeight: '1.6'
          }}>
            Create a new room to invite your partner, or join an existing room with a code.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px',
              color: 'white'
            }}>
              <FaPlus />
            </div>
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.3rem' }}>
              Create Room
            </h3>
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', 
              marginBottom: '20px',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Start a new video call room and get a unique 6-digit code to share with your partner.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={handleCreateRoom}
              style={{ width: '100%' }}
            >
              Create New Room
            </button>
          </div>

          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '16px', 
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px',
              color: 'white'
            }}>
              <FaSignInAlt />
            </div>
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.3rem' }}>
              Join Room
            </h3>
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', 
              marginBottom: '20px',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Enter the 6-digit code shared by your partner to join their video call room.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={handleJoinRoom}
              style={{ 
                width: '100%',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
              }}
            >
              Join Existing Room
            </button>
          </div>
        </div>

        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h4 style={{ color: 'white', marginBottom: '8px' }}>💡 How it works:</h4>
          <ol style={{ 
            color: 'rgba(255,255,255,0.8)', 
            textAlign: 'left',
            paddingLeft: '20px',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            <li>One person creates a room and gets a unique 6-digit code</li>
            <li>Share the code with your partner via text, email, or any messaging app</li>
            <li>Your partner enters the code to join the room</li>
            <li>Start your video call and enjoy watching videos together!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RoomOptionsPage; 