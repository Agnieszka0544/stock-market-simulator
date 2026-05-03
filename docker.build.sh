#!/bin/bash

# Stock Market Simulator - Multi-Architecture Docker Build Script
# Builds Docker images for both amd64 and arm64 architectures
# Usage: ./docker.build.sh [TAG]
# Example: ./docker.build.sh latest

TAG=${1:-latest}

echo "Building Stock Market Simulator Docker image for multiple architectures..."
echo "Tag: $TAG"
echo ""

docker buildx build --platform linux/amd64,linux/arm64 -t stock-market-simulator:$TAG -f Dockerfile .

echo ""
echo "Build complete! Image: stock-market-simulator:$TAG"
echo "Supported architectures: linux/amd64, linux/arm64"
