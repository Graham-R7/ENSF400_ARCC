@echo off
setlocal

REM Run from this script's directory so paths stay stable.
set "ROOT=%~dp0"
cd /d "%ROOT%"

echo Starting ARCC backend and frontend...

REM Backend terminal
start "ARCC Backend" cmd /k "cd /d ""%ROOT%backend"" && python -m pip install -r requirements.txt && python app.py"

REM Frontend terminal
start "ARCC Frontend" cmd /k "cd /d ""%ROOT%frontend"" && if not exist node_modules (npm install) && set REACT_APP_API_BASE=http://localhost:5000/api && npm start"

REM Give services a moment to boot, then open app.
timeout /t 4 /nobreak >nul
start "" "http://localhost:3000"

echo Done. Check the two terminal windows for status.
endlocal
