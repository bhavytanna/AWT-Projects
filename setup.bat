@echo off
REM CivicTrack - Full Setup Script for Windows
REM Run this batch file to set up the entire project

echo.
echo 🚀 CivicTrack Setup Script Started...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js found: %NODE_VERSION%
echo ✅ npm found: %NPM_VERSION%

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies already installed
)

echo ✅ Backend setup complete

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd ..\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

echo ✅ Frontend setup complete

echo.
echo ==========================================
echo ✨ Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Start MongoDB: mongod
echo 2. Terminal 1 (Backend): cd backend && npm start
echo 3. Terminal 2 (Frontend): cd frontend && npm start
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
pause
