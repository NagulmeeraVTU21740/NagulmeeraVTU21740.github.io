# 🐱 Meow Video Calling

An all-in-one video calling website designed for long-distance relationships, featuring synchronized video watching, real-time chat, and high-quality video calls.

## ✨ Features

- 🎥 **High-quality video calling** using WebRTC
- 📱 **Synchronized video watching** - watch YouTube videos or uploaded videos together
- 💬 **Real-time chat** during video calls
- 🔐 **Secure room codes** - 6-digit unique codes for room access
- 📺 **YouTube video sharing** - paste any YouTube URL to watch together
- 📁 **Video upload and sharing** - upload your own videos to watch together
- 🎮 **Video controls synchronization** - play, pause, seek, and volume controls sync across users
- 📱 **Responsive design** - works on desktop and mobile devices
- 🌈 **Beautiful UI** - modern, gradient-based design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CallingWeb
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:3001`

2. **Start the frontend application** (in a new terminal)
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 📖 How to Use

### 1. Home Page
- Click the "Talk to your meow" button to get started

### 2. Room Options
- **Create Room**: Start a new video call room
- **Join Room**: Join an existing room with a code

### 3. Create Room
- Enter your name
- Click "Create Room" to generate a unique 6-digit code
- Share the code with your partner via text, email, or any messaging app
- Click "Start Video Call" when ready

### 4. Join Room
- Enter your name and the 6-digit room code shared by your partner
- Click "Join Room"
- Click "Start Video Call" when ready

### 5. Video Call Features
- **Video Controls**: Toggle camera and microphone on/off
- **Chat**: Send real-time messages during the call
- **Video Sharing**: 
  - Paste a YouTube URL and click "Share YouTube"
  - Upload a video file and click "Upload Video"
- **Synchronized Controls**: Play, pause, seek, and volume controls sync across both users

## 🛠️ Technical Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Simple Peer** - WebRTC peer connections
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time WebSocket communication
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_SERVER_URL=http://localhost:3001

# Backend
PORT=3001
NODE_ENV=development
```

### Customization

- **Room Code Length**: Modify the `generateRoomCode()` function in `server/server.js`
- **Max Participants**: Change `maxParticipants` in the room creation logic
- **UI Colors**: Update CSS variables in `src/index.css`
- **Server Port**: Change the `PORT` environment variable

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔒 Security Features

- **Room Code Validation**: 6-digit numeric codes only
- **Room Capacity Limits**: Maximum 2 participants per room
- **Automatic Room Cleanup**: Empty rooms are automatically deleted
- **WebRTC Security**: Encrypted peer-to-peer connections

## 🐛 Troubleshooting

### Common Issues

1. **Camera/Microphone Access Denied**
   - Make sure to allow camera and microphone permissions in your browser
   - Check if other applications are using your camera/microphone

2. **Room Code Not Working**
   - Ensure the code is exactly 6 digits
   - Check if the room still exists (rooms are deleted when empty)
   - Verify both users are connected to the server

3. **Video Not Syncing**
   - Ensure both users have stable internet connections
   - Try refreshing the page and rejoining the room
   - Check browser console for any errors

4. **Server Connection Issues**
   - Verify the backend server is running on port 3001
   - Check if the frontend is connecting to the correct server URL
   - Ensure no firewall is blocking the connection

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [Simple Peer](https://github.com/feross/simple-peer) for WebRTC implementation
- [React Icons](https://react-icons.github.io/react-icons/) for beautiful icons
- [Vite](https://vitejs.dev/) for fast development and building

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

---

Made with ❤️ for long-distance relationships everywhere 