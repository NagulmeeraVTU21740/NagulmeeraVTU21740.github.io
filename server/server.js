const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active rooms and participants
const rooms = new Map();
const participants = new Map();

// Generate 6-digit room code
function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get room by code
function getRoomByCode(code) {
  for (const [roomId, room] of rooms) {
    if (room.code === code) {
      return room;
    }
  }
  return null;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create room
  socket.on('create-room', ({ username }) => {
    const roomCode = generateRoomCode();
    const roomId = uuidv4();
    
    const room = {
      id: roomId,
      code: roomCode,
      participants: [{
        id: socket.id,
        username: username || 'Anonymous'
      }],
      maxParticipants: 2
    };
    
    rooms.set(roomId, room);
    participants.set(socket.id, {
      roomId,
      username: username || 'Anonymous'
    });
    
    socket.join(roomId);
    
    socket.emit('room-created', {
      roomId: roomCode,
      participants: room.participants
    });
    
    console.log(`Room created: ${roomCode} by ${username}`);
  });

  // Join room
  socket.on('join-room', ({ roomId: roomCode, username }) => {
    const room = getRoomByCode(roomCode);
    
    if (!room) {
      socket.emit('room-not-found');
      return;
    }
    
    if (room.participants.length >= room.maxParticipants) {
      socket.emit('room-full');
      return;
    }
    
    const participant = {
      id: socket.id,
      username: username || 'Anonymous'
    };
    
    room.participants.push(participant);
    participants.set(socket.id, {
      roomId: room.id,
      username: username || 'Anonymous'
    });
    
    socket.join(room.id);
    
    // Notify all participants in the room
    io.to(room.id).emit('user-joined', {
      username: participant.username,
      participants: room.participants
    });
    
    socket.emit('room-joined', {
      roomId: roomCode,
      participants: room.participants
    });
    
    console.log(`${username} joined room: ${roomCode}`);
  });

  // Leave room
  socket.on('leave-room', ({ roomId: roomCode }) => {
    const room = getRoomByCode(roomCode);
    if (!room) return;
    
    const participant = participants.get(socket.id);
    if (!participant) return;
    
    // Remove participant from room
    room.participants = room.participants.filter(p => p.id !== socket.id);
    participants.delete(socket.id);
    
    socket.leave(room.id);
    
    // Notify remaining participants
    if (room.participants.length > 0) {
      io.to(room.id).emit('user-left', {
        username: participant.username,
        participants: room.participants
      });
    } else {
      // Delete room if empty
      rooms.delete(room.id);
    }
    
    console.log(`${participant.username} left room: ${roomCode}`);
  });

  // Video call signaling
  socket.on('video-signal', ({ signal, to, from }) => {
    const targetSocket = io.sockets.sockets.get(to);
    if (targetSocket) {
      targetSocket.emit('video-signal', { signal, from });
    }
  });

  // Chat messages
  socket.on('chat-message', (messageData) => {
    const participant = participants.get(socket.id);
    if (!participant) return;
    
    const room = rooms.get(participant.roomId);
    if (!room) return;
    
    // Broadcast message to all participants in the room
    io.to(room.id).emit('chat-message', {
      ...messageData,
      sender: socket.id,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  // Video control synchronization
  socket.on('video-control', (controlData) => {
    const participant = participants.get(socket.id);
    if (!participant) return;
    
    const room = rooms.get(participant.roomId);
    if (!room) return;
    
    // Broadcast video control to all participants in the room
    socket.to(room.id).emit('video-control', controlData);
  });

  // User joined video call
  socket.on('user-joined-call', () => {
    const participant = participants.get(socket.id);
    if (!participant) return;
    
    const room = rooms.get(participant.roomId);
    if (!room) return;
    
    socket.to(room.id).emit('user-joined-call', {
      username: participant.username
    });
  });

  // User left video call
  socket.on('user-left-call', () => {
    const participant = participants.get(socket.id);
    if (!participant) return;
    
    const room = rooms.get(participant.roomId);
    if (!room) return;
    
    socket.to(room.id).emit('user-left-call', {
      username: participant.username
    });
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const participant = participants.get(socket.id);
    if (!participant) return;
    
    const room = rooms.get(participant.roomId);
    if (!room) return;
    
    // Remove participant from room
    room.participants = room.participants.filter(p => p.id !== socket.id);
    participants.delete(socket.id);
    
    // Notify remaining participants
    if (room.participants.length > 0) {
      io.to(room.id).emit('user-left', {
        username: participant.username,
        participants: room.participants
      });
    } else {
      // Delete room if empty
      rooms.delete(room.id);
    }
    
    console.log(`${participant.username} disconnected from room: ${room.code}`);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    participants: participants.size,
    timestamp: new Date().toISOString()
  });
});

// Get active rooms (for debugging)
app.get('/rooms', (req, res) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    code: room.code,
    participants: room.participants.length,
    maxParticipants: room.maxParticipants
  }));
  
  res.json({
    rooms: roomList,
    total: rooms.size
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Active rooms: http://localhost:${PORT}/rooms`);
}); 