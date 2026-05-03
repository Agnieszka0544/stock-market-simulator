@echo off
REM start.bat — bring up HA Docker Compose stack
REM Usage: start.bat [port]
IF "%1"=="" (
  set "PORT=3000"
) ELSE (
  set "PORT=%1"
)

echo Starting HA stack on port %PORT%...
docker compose up --build -d --remove-orphans

echo Services started. Access: http://localhost:%PORT%
exit /b 0
