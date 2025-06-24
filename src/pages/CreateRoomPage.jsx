import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { FaCopy, FaShare, FaArrowLeft, FaUser, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const { createRoom, roomId, isConnected } = useSocket();
  const [username, setUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    if (roomId) {
      setRoomCode(roomId);
    }
  }, [roomId]);

  const handleGoBack = () => {
    navigate('/room-options');
  };

  const handleCreateRoom = async () => {
    if (!username.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to server. Please try again.');
      return;
    }

    setIsCreating(true);
    createRoom(username);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      toast.success('Room code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleShareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my video call room',
          text: `Join my video call room using this code: ${roomCode}`,
          url: window.location.origin + '/join-room'
        });
        toast.success('Room code shared!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Failed to share code');
        }
      }
    } else {
      // Fallback to copying
      handleCopyCode();
    }
  };

  const handleStartCall = () => {
    if (roomCode) {
      navigate(`/video-call/${roomCode}`);
    }
  };

  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
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

        {!roomCode ? (
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: 'white', 
              marginBottom: '16px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              Create Room
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'rgba(255,255,255,0.9)', 
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Enter your name to create a new video call room.
            </p>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <FaUser style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '18px'
                }} />
                <input
                  type="text"
                  className="input"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '48px' }}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleCreateRoom}
              disabled={isCreating || !isConnected}
              style={{ 
                width: '100%',
                opacity: isCreating || !isConnected ? 0.6 : 1
              }}
            >
              {isCreating ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  Creating Room...
                </>
              ) : !isConnected ? (
                'Connecting...'
              ) : (
                'Create Room'
              )}
            </button>

            {!isConnected && (
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '0.9rem', 
                marginTop: '16px' 
              }}>
                Connecting to server...
              </p>
            )}
          </div>
        ) : (
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: 'white', 
              marginBottom: '16px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              Room Created!
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'rgba(255,255,255,0.9)', 
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Share this code with your partner to join the room.
            </p>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '32px'
            }}>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>Room Code</h3>
              <div className="room-code">{roomCode}</div>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '0.9rem',
                marginBottom: '24px'
              }}>
                This code is unique to your room
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCopyCode}
                  style={{ flex: 1 }}
                >
                  <FaCopy />
                  Copy Code
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleShareCode}
                  style={{ flex: 1 }}
                >
                  <FaShare />
                  Share Code
                </button>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleStartCall}
              style={{ 
                width: '100%',
                fontSize: '1.1rem',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)'
              }}
            >
              Start Video Call
            </button>

            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h4 style={{ color: 'white', marginBottom: '8px' }}>📋 Next steps:</h4>
              <ol style={{ 
                color: 'rgba(255,255,255,0.8)', 
                textAlign: 'left',
                paddingLeft: '20px',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                <li>Share the room code with your partner</li>
                <li>Wait for them to join the room</li>
                <li>Click "Start Video Call" when ready</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreateRoomPage; 