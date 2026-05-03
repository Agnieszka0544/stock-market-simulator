#!/bin/bash

# Stock Market Simulator - Start Script (Linux/macOS)
# Usage: ./start.sh [PORT]
# Example: ./start.sh 3000

PORT=${1:-3000}

echo "Starting Stock Market Simulator on port $PORT..."
echo "Available at: http://localhost:$PORT"
echo ""

PORT=$PORT npm start
