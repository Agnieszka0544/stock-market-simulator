@echo off
REM Stock Market Simulator - Start Script (Windows)
REM Usage: start.bat [PORT]
REM Example: start.bat 3000

setlocal enabledelayedexpansion

if "%1"=="" (
    set PORT=3000
) else (
    set PORT=%1
)

echo Starting Stock Market Simulator on port !PORT!...
echo Available at: http://localhost:!PORT!
echo.

set PORT=!PORT!
npm start
