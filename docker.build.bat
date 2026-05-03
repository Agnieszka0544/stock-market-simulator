@echo off
REM Stock Market Simulator - Multi-Architecture Docker Build Script (Windows)
REM Builds Docker images for both amd64 and arm64 architectures
REM Usage: docker.build.bat [TAG]
REM Example: docker.build.bat latest

setlocal enabledelayedexpansion

if "%1"=="" (
    set TAG=latest
) else (
    set TAG=%1
)

echo Building Stock Market Simulator Docker image for multiple architectures...
echo Tag: !TAG!
echo.

docker buildx build --platform linux/amd64,linux/arm64 -t stock-market-simulator:!TAG! -f Dockerfile .

echo.
echo Build complete! Image: stock-market-simulator:!TAG!
echo Supported architectures: linux/amd64, linux/arm64
