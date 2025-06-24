import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { 
  FaVideo, 
  FaVideoSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaPhone, 
  FaPhoneSlash,
  FaYoutube,
  FaUpload,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaArrowLeft,
  FaPaperPlane
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Peer from 'simple-peer';

const VideoCallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket, participants, leaveRoom } = useSocket();
  
  // Video call states
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);

  // Chat states
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Video watching states
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoType, setVideoType] = useState(null); // 'youtube' or 'upload'
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Refs
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const videoPlayerRef = useRef();
  const chatMessagesRef = useRef();

  useEffect(() => {
    if (!socket) return;

    // Handle incoming video call signals
    socket.on('user-joined-call', handleUserJoinedCall);
    socket.on('user-left-call', handleUserLeftCall);
    socket.on('video-signal', handleVideoSignal);
    socket.on('chat-message', handleChatMessage);
    socket.on('video-control', handleVideoControl);

    return () => {
      socket.off('user-joined-call');
      socket.off('user-left-call');
      socket.off('video-signal');
      socket.off('chat-message');
      socket.off('video-control');
    };
  }, [socket]);

  useEffect(() => {
    // Scroll chat to bottom when new messages arrive
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserJoinedCall = (data) => {
    toast.success(`${data.username} joined the call!`);
    setIsCallActive(true);
  };

  const handleUserLeftCall = (data) => {
    toast.error(`${data.username} left the call`);
    setIsCallActive(false);
    setRemoteStream(null);
  };

  const handleVideoSignal = (data) => {
    const { signal, from } = data;
    
    if (peers[from]) {
      peers[from].signal(signal);
    } else {
      // Create new peer connection
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: localStream
      });

      peer.on('signal', (signal) => {
        socket.emit('video-signal', { signal, to: from, from: socket.id });
      });

      peer.on('stream', (stream) => {
        setRemoteStream(stream);
      });

      peer.signal(signal);
      setPeers(prev => ({ ...prev, [from]: peer }));
    }
  };

  const handleChatMessage = (data) => {
    setMessages(prev => [...prev, data]);
  };

  const handleVideoControl = (data) => {
    const { type, payload } = data;
    
    switch (type) {
      case 'play':
        if (videoPlayerRef.current) {
          videoPlayerRef.current.play();
          setIsVideoPlaying(true);
        }
        break;
      case 'pause':
        if (videoPlayerRef.current) {
          videoPlayerRef.current.pause();
          setIsVideoPlaying(false);
        }
        break;
      case 'seek':
        if (videoPlayerRef.current) {
          videoPlayerRef.current.currentTime = payload.time;
        }
        break;
      case 'volume':
        if (videoPlayerRef.current) {
          videoPlayerRef.current.volume = payload.volume;
        }
        break;
      case 'mute':
        if (videoPlayerRef.current) {
          videoPlayerRef.current.muted = payload.muted;
          setIsVideoMuted(payload.muted);
        }
        break;
      case 'new-video':
        setCurrentVideo(payload);
        setVideoType(payload.type);
        if (payload.type === 'youtube') {
          setYoutubeUrl(payload.url);
        } else {
          setUploadedVideo(payload.file);
        }
        break;
      default:
        break;
    }
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connections for all participants
      participants.forEach(participant => {
        if (participant.id !== socket.id) {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
          });

          peer.on('signal', (signal) => {
            socket.emit('video-signal', { signal, to: participant.id, from: socket.id });
          });

          peer.on('stream', (stream) => {
            setRemoteStream(stream);
          });

          setPeers(prev => ({ ...prev, [participant.id]: peer }));
        }
      });

      setIsCallActive(true);
      toast.success('Video call started!');
    } catch (error) {
      toast.error('Failed to access camera/microphone');
      console.error('Error accessing media devices:', error);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    Object.values(peers).forEach(peer => peer.destroy());
    setPeers({});
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    
    leaveRoom();
    navigate('/');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      id: Date.now(),
      text: newMessage,
      sender: socket.id,
      timestamp: new Date().toLocaleTimeString()
    };
    
    socket.emit('chat-message', messageData);
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const videoData = {
        type: 'upload',
        file: URL.createObjectURL(file),
        name: file.name
      };
      
      setCurrentVideo(videoData);
      setVideoType('upload');
      setUploadedVideo(videoData);
      
      // Notify other participants
      socket.emit('video-control', {
        type: 'new-video',
        payload: videoData
      });
      
      toast.success('Video uploaded and shared!');
    } else {
      toast.error('Please select a valid video file');
    }
  };

  const handleYouTubeUrl = () => {
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }
    
    const videoData = {
      type: 'youtube',
      url: youtubeUrl,
      videoId: videoId
    };
    
    setCurrentVideo(videoData);
    setVideoType('youtube');
    
    // Notify other participants
    socket.emit('video-control', {
      type: 'new-video',
      payload: videoData
    });
    
    toast.success('YouTube video shared!');
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const toggleVideoPlayback = () => {
    if (videoPlayerRef.current) {
      if (isVideoPlaying) {
        videoPlayerRef.current.pause();
        setIsVideoPlaying(false);
        socket.emit('video-control', { type: 'pause' });
      } else {
        videoPlayerRef.current.play();
        setIsVideoPlaying(true);
        socket.emit('video-control', { type: 'play' });
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoPlayerRef.current) {
      const newMuted = !isVideoMuted;
      videoPlayerRef.current.muted = newMuted;
      setIsVideoMuted(newMuted);
      socket.emit('video-control', { type: 'mute', payload: { muted: newMuted } });
    }
  };

  const handleVideoSeek = (event) => {
    const time = event.target.value;
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = time;
      socket.emit('video-control', { type: 'seek', payload: { time } });
    }
  };

  const handleGoBack = () => {
    if (isCallActive) {
      if (window.confirm('Are you sure you want to leave the call?')) {
        endCall();
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container" style={{ padding: '20px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={handleGoBack}>
          <FaArrowLeft />
          Leave
        </button>
        <h1 style={{ color: 'white', margin: 0 }}>Room: {roomId}</h1>
        <div style={{ color: 'rgba(255,255,255,0.8)' }}>
          {participants.length} participant(s)
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', height: 'calc(100vh - 120px)' }}>
        {/* Main content area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Video call area */}
          <div className="video-grid">
            {localStream && (
              <div className="video-container">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ width: '100%', height: 'auto' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '10px', 
                  left: '10px', 
                  background: 'rgba(0,0,0,0.7)', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  You
                </div>
              </div>
            )}
            
            {remoteStream && (
              <div className="video-container">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: 'auto' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '10px', 
                  left: '10px', 
                  background: 'rgba(0,0,0,0.7)', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  Partner
                </div>
              </div>
            )}
          </div>

          {/* Video controls */}
          <div className="controls">
            {!isCallActive ? (
              <button className="control-btn primary" onClick={startVideoCall}>
                <FaVideo />
                Start Video Call
              </button>
            ) : (
              <>
                <button 
                  className={`control-btn ${isVideoEnabled ? 'primary' : 'secondary'}`} 
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
                  {isVideoEnabled ? 'Video On' : 'Video Off'}
                </button>
                <button 
                  className={`control-btn ${isAudioEnabled ? 'primary' : 'secondary'}`} 
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  {isAudioEnabled ? 'Audio On' : 'Audio Off'}
                </button>
                <button className="control-btn danger" onClick={endCall}>
                  <FaPhoneSlash />
                  End Call
                </button>
              </>
            )}
          </div>

          {/* Video watching area */}
          {currentVideo && (
            <div className="video-player">
              {videoType === 'youtube' ? (
                <div className="youtube-player">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.videoId}?enablejsapi=1`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  ref={videoPlayerRef}
                  src={currentVideo.file}
                  controls
                  style={{ width: '100%', height: 'auto' }}
                  onTimeUpdate={(e) => setVideoProgress(e.target.currentTime)}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />
              )}
              
              <div className="controls">
                <button className="control-btn secondary" onClick={toggleVideoPlayback}>
                  {isVideoPlaying ? <FaPause /> : <FaPlay />}
                  {isVideoPlaying ? 'Pause' : 'Play'}
                </button>
                <button className="control-btn secondary" onClick={toggleVideoMute}>
                  {isVideoMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  {isVideoMuted ? 'Unmute' : 'Mute'}
                </button>
                {videoType === 'upload' && (
                  <input
                    type="range"
                    min="0"
                    max={videoPlayerRef.current?.duration || 0}
                    value={videoProgress}
                    onChange={handleVideoSeek}
                    style={{ flex: 1, margin: '0 10px' }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Video sharing controls */}
          <div className="controls">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                style={{ flex: 1, maxWidth: '300px' }}
                className="input"
              />
              <button className="control-btn primary" onClick={handleYouTubeUrl}>
                <FaYoutube />
                Share YouTube
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: 'none' }}
                id="video-upload"
              />
              <label htmlFor="video-upload" className="control-btn secondary" style={{ cursor: 'pointer' }}>
                <FaUpload />
                Upload Video
              </label>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="chat-container">
          <h3 style={{ color: 'white', marginBottom: '16px' }}>💬 Chat</h3>
          
          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === socket.id ? 'own' : ''}`}
              >
                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                  {message.sender === socket.id ? 'You' : 'Partner'} • {message.timestamp}
                </div>
                {message.text}
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="input"
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage; 