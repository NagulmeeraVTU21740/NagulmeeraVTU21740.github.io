import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Use ngrok backend URL for public access
    const newSocket = io('https://79ec-49-37-202-144.ngrok-free.app', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('room-created', (data) => {
      setRoomId(data.roomId);
      toast.success('Room created successfully!');
    });

    newSocket.on('room-joined', (data) => {
      setRoomId(data.roomId);
      setParticipants(data.participants);
      toast.success('Joined room successfully!');
    });

    newSocket.on('user-joined', (data) => {
      setParticipants(data.participants);
      toast.success(`${data.username} joined the room!`);
    });

    newSocket.on('user-left', (data) => {
      setParticipants(data.participants);
      toast.error(`${data.username} left the room`);
    });

    newSocket.on('room-not-found', () => {
      toast.error('Room not found!');
    });

    newSocket.on('room-full', () => {
      toast.error('Room is full!');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = (username) => {
    if (socket) {
      socket.emit('create-room', { username });
    }
  };

  const joinRoom = (roomId, username) => {
    if (socket) {
      socket.emit('join-room', { roomId, username });
    }
  };

  const leaveRoom = () => {
    if (socket && roomId) {
      socket.emit('leave-room', { roomId });
      setRoomId(null);
      setParticipants([]);
    }
  };

  const value = {
    socket,
    isConnected,
    roomId,
    participants,
    createRoom,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 