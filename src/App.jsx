import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import RoomOptionsPage from './pages/RoomOptionsPage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import VideoCallPage from './pages/VideoCallPage';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room-options" element={<RoomOptionsPage />} />
            <Route path="/create-room" element={<CreateRoomPage />} />
            <Route path="/join-room" element={<JoinRoomPage />} />
            <Route path="/video-call/:roomId" element={<VideoCallPage />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                color: '#333',
              },
            }}
          />
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App; 