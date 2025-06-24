@echo off
echo 🐱 Starting Meow Video Calling...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo Installing backend dependencies...
cd server
call npm install
cd ..

echo 🚀 Starting servers...

REM Start backend server
echo Starting backend server on port 3001...
start "Backend Server" cmd /k "cd server && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo Starting frontend server on port 3000...
start "Frontend Server" cmd /k "npm run dev"

echo ✅ Servers started successfully!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3001
echo.
echo Both servers are now running in separate windows.
echo Close the windows to stop the servers.
echo.
pause 