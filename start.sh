#!/bin/bash

echo "🐱 Starting Meow Video Calling..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd server
npm install
cd ..

echo "🚀 Starting servers..."

# Start backend server in background
echo "Starting backend server on port 3001..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Servers started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 