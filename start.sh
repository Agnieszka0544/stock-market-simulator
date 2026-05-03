#!/usr/bin/env bash
set -euo pipefail

# start.sh — bring up HA Docker Compose stack
# Usage: ./start.sh [port]
PORT=${1:-3000}
export PORT

echo "Starting HA stack on port $PORT..."
docker compose up --build -d --remove-orphans

echo "Services started. Access: http://localhost:$PORT"
