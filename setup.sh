#!/bin/bash

# CivicTrack - Full Setup Script
# Run this script to set up the entire project

echo "🚀 CivicTrack Setup Script Started..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

echo "✅ Backend setup complete"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

echo "✅ Frontend setup complete"

echo ""
echo "=========================================="
echo "✨ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start MongoDB: mongod"
echo "2. Terminal 1 (Backend): cd backend && npm start"
echo "3. Terminal 2 (Frontend): cd frontend && npm start"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
