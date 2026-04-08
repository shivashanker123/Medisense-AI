@echo off
echo Checking for existing process on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000 " ^| find "LISTENING"') do (
    echo Killing existing process PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)
echo Starting MediSense Backend...
python app.py
