@echo off
setlocal

REM Run from this script's directory so paths stay stable.
set "ROOT=%~dp0"
cd /d "%ROOT%"

echo Starting ARCC backend and frontend...

REM Backend terminal (python -m pip is OK; no CALL needed)
start "ARCC Backend" cmd /k "cd /d ""%ROOT%backend"" && python -m pip install -r requirements.txt && python app.py"

REM Frontend: MUST use CALL for npm.cmd — otherwise npm install hands off to npm.cmd and npm start never runs.
start "ARCC Frontend" cmd /k "cd /d ""%ROOT%frontend"" && if not exist node_modules call npm install && set REACT_APP_API_BASE=http://localhost:5000/api && echo Starting React at http://localhost:3000 && call npm start"

REM Give services a moment to boot, then open app.
timeout /t 4 /nobreak >nul
start "" "http://localhost:3000"

echo Done. Check the two terminal windows for status.
endlocal
