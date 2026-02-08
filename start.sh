#!/bin/bash

echo "Starting Daily Checklist App..."
echo "================================"

# Start backend server
echo "Starting backend server on port 5001..."
node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start React dev server
echo "Starting React dev server on port 3000..."
BROWSER=none PORT=3000 npm run client &
FRONTEND_PID=$!

echo ""
echo "✅ Application started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
