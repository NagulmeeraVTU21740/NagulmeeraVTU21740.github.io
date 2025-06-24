import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { FaArrowLeft, FaUser, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const { joinRoom, roomId, isConnected } = useSocket();
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleGoBack = () => {
    navigate('/room-options');
  };

  const handleJoinRoom = async () => {
    if (!username.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!roomCode.trim()) {
      toast.error('Please enter the room code');
      return;
    }

    if (roomCode.length !== 6) {
      toast.error('Room code must be 6 digits');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to server. Please try again.');
      return;
    }

    setIsJoining(true);
    joinRoom(roomCode, username);
  };

  const handleStartCall = () => {
    if (roomId) {
      navigate(`/video-call/${roomId}`);
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

        {!roomId ? (
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: 'white', 
              marginBottom: '16px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              Join Room
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'rgba(255,255,255,0.9)', 
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Enter your name and the room code to join the video call.
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
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <FaSignInAlt style={{ 
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
                  placeholder="Enter 6-digit room code"
                  value={roomCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setRoomCode(value);
                  }}
                  style={{ paddingLeft: '48px' }}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                  maxLength={6}
                />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleJoinRoom}
              disabled={isJoining || !isConnected}
              style={{ 
                width: '100%',
                opacity: isJoining || !isConnected ? 0.6 : 1,
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
              }}
            >
              {isJoining ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  Joining Room...
                </>
              ) : !isConnected ? (
                'Connecting...'
              ) : (
                'Join Room'
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

            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h4 style={{ color: 'white', marginBottom: '8px' }}>💡 Tips:</h4>
              <ul style={{ 
                color: 'rgba(255,255,255,0.8)', 
                textAlign: 'left',
                paddingLeft: '20px',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                <li>Make sure you have the correct 6-digit code from your partner</li>
                <li>The room code is case-sensitive</li>
                <li>Only numbers are allowed in the room code</li>
                <li>You can only join if the room exists and has space</li>
              </ul>
            </div>
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
              Successfully Joined!
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'rgba(255,255,255,0.9)', 
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              You have successfully joined the room. Ready to start the video call?
            </p>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '32px'
            }}>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>Room Details</h3>
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '8px', 
                padding: '16px',
                marginBottom: '16px'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                  <strong>Room Code:</strong>
                </p>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: 'white',
                  fontFamily: 'Courier New, monospace',
                  letterSpacing: '4px'
                }}>
                  {roomId}
                </div>
              </div>
              
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '0.9rem'
              }}>
                You're now connected to the room
              </p>
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
              <h4 style={{ color: 'white', marginBottom: '8px' }}>🎉 What's next:</h4>
              <ol style={{ 
                color: 'rgba(255,255,255,0.8)', 
                textAlign: 'left',
                paddingLeft: '20px',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                <li>Click "Start Video Call" to begin</li>
                <li>Allow camera and microphone access when prompted</li>
                <li>Enjoy your video call with synchronized video watching!</li>
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

export default JoinRoomPage; 